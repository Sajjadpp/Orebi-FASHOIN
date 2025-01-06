import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { adminAxiosInstance, userAxiosInstance } from '../../../redux/constants/AxiosInstance';
import toast from 'react-hot-toast';

const StockList = () => {
  const [products, setProducts] = useState([
    {
      id:'',
      name: "bagy pants",
      currentPrice: "899",
      stock: [
        { size: "36", quantity: 2 },
        { size: "38", quantity: 7 }
      ]
    },
    {
      name: "name",
      currentPrice: "899",
      stock: [
        { size: "36", quantity: 2 },
        { size: "38", quantity: 7 }
      ]
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [newQuantity, setNewQuantity] = useState('');

  const handleOpenModal = (product, size) => {
    setSelectedProduct(product);
    setSelectedSize(size);
    setNewQuantity('');
    setIsModalOpen(true);
  };

  const handleSubmit = () => {
    if (!selectedProduct || !selectedSize || newQuantity === '') return;

    setProducts(prevProducts => {
      return prevProducts.map(product => {
        if (product === selectedProduct) {
          return {
            ...product,
            stock: product.stock.map(item => {
              if (item === selectedSize) {
                return {
                  ...item,
                  quantity: item.quantity + parseInt(newQuantity)
                };
              }
              return item;
            })
          };
        }
        return product;
      });
    });

    setIsModalOpen(false);
  };

  const handleStockSave = async(productId) =>{
    const product = products.find(product => product._id == productId)
    console.log(product.stock)
    try{

        let response = await adminAxiosInstance.patch("/product",{stock: product.stock, _id: product._id})
        toast.success(response.data);
        fetchProducts()
    }
    catch(error){
        console.log('error');
        toast.success(error.response.data)
    }

  }

  const fetchProducts = async() =>{

    const product = await adminAxiosInstance.get('/productList');
    console.log(product.data)
    setProducts(product.data)
  }

  useEffect(()=>{
    fetchProducts()
  },[])
  return (
    <div className="p-6">
      {/* Product List */}
      <div className="space-y-4 ">
        {products.map((product, productIndex) => (
          <div key={productIndex} className="bg-white rounded-lg shadow-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <span className="text-gray-600">₹{product.currentPrice}</span>
            </div>
            
            <div className="divide-y">
              {product.stock.map((stockItem, sizeIndex) => (
                <div 
                  key={sizeIndex}
                  className="py-3 flex items-center justify-between"
                >
                  <div className="space-x-4">
                    <span className="font-medium">Size: {stockItem.size}</span>
                    <span>Stock: {stockItem.quantity}</span>
                  </div>
                  
                  <button
                    onClick={() => handleOpenModal(product, stockItem)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    <Plus size={16} />
                    Add Stock
                  </button>
                </div>
              ))}
              
            </div>
            <div className='w-[100vh] flex align-end mt-6'>
                  <button onClick={()=> handleStockSave(product._id)} className='flex items-center gap-2 px-4 py-2 text-green-700 bg-green-200 rounded hover:bg-green-300 '>Save</button>
              </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">
              Update Stock - {selectedProduct?.name} (Size: {selectedSize?.size})
            </h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Stock: {selectedSize?.quantity}
              </label>
              <input
                type="number"
                value={newQuantity}
                onChange={(e) => setNewQuantity(e.target.value)}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                placeholder="Enter quantity to add"
                min="1"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!newQuantity || parseInt(newQuantity) <= 0}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockList;