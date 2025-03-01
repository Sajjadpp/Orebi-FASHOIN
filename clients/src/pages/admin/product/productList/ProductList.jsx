import React, { useEffect, useState } from 'react';
import { Edit, Trash2, Eye, CheckSquare, XSquare } from 'lucide-react';
import { adminAxiosInstance } from '../../../../redux/constants/AxiosInstance';
import NetworkAlert from '../../../../assets/elements/NetworkAlert';
import { useNavigate } from 'react-router-dom';
import EditProductPopup from '../EditProduct/EditProduct';
import toast from 'react-hot-toast';
import Confirmation from '../../../../assets/elements/Confirmation';

const AdminProductList = () => {
  const [products, setProducts] = useState([]);
  const [network, setNetwork] = useState(false)
  const [editProduct, setEditedProduct] = useState(false)
  const [isPopup, setIsPopup] = useState(false);

  const fetchAllProducts = async()=>{
    try{

        let response = await adminAxiosInstance.get("/productList")
        setProducts(response.data)
        
    }
    catch(error){
        console.log(error)
        setNetwork(true)
    }
  }

  useEffect(()=>{

    fetchAllProducts()
  },[])


  const HandleEdit = (product) =>{  
    setEditedProduct(product)
  }

  const handleToogleActivation = async(productId, productStatus)=>{

    try{
      let response = await adminAxiosInstance.patch("/product",null, {params:{
        productId,
        productStatus
      }})

      setProducts(products.map((product)=>{
        if(productId === product._id){
          return {...product, status: !productStatus}
        }
        return product
      }))
      toast.success(response.data)
      setIsPopup(false)
    }
    catch(error){
      toast.error(error.respone.data || error.message)
    }
  }
  if(editProduct) return (
    <EditProductPopup
      product={editProduct}
      isOpen={editProduct}
      onClose={()=> setEditedProduct(false)}
    />)
  return (
    <div className="p-6 max-w-7xl mx-auto">
      
        {
            network &&
            <NetworkAlert setNetwork={setNetwork} text="network issue try again later"/>
        }

        {/* start confirmation popup */}
        
          {isPopup &&
            <Confirmation
            buttonText={`${isPopup.status ? "inactivate" : "activate"} the product`}
            data={'are you sure to the user'}
            isOpen={isPopup}
            onClose={()=> setIsPopup(false)}
            onConfirm={()=> handleToogleActivation(isPopup.productId, isPopup.status)}
          />
          }
        
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Product Management</h1>
        <button className="bg-green-200 text-green-700 px-4 py-2 rounded-lg font-medium hover:bg-green-300 transition-colors">
          Add New Product
        </button>
      </div>

      {
        products.length ?
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        <table className="min-w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img 
                      src={product.images[0]} 
                      alt={product.name} 
                      className="h-16 w-16 object-cover rounded"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{product.name}</td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold"> ₹{product.currentPrice}</span>
                      {product.regularPrice !== product.currentPrice && (
                        <span className="text-sm text-gray-500 line-through">
                          ₹{product.regularPrice}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{product.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {product.stock.reduce((acc, item) => acc + item.quantity, 0)} units
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      product.status ? 'bg-green-200 text-green-700' : 'bg-red-200 text-red-700'
                    }`}>
                      {product.status ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-2">
                      <button 
                        className="p-1 hover:bg-gray-100 rounded transition-colors" 
                        title="View"
                      >
                        <Eye size={18} className="text-blue-600" />
                      </button>
                      <button 
                        className="p-1 hover:bg-gray-100 rounded transition-colors" 
                        title="Edit"
                        onClick={()=> HandleEdit(product)}
                      >
                        <Edit size={18} className="text-green-600" />
                      </button>
                      <button 
                        className="p-1 hover:bg-gray-100 rounded transition-colors" 
                        title={product.status ? 'Deactivate' : 'Activate'}
                        onClick={()=> setIsPopup({productId:product._id, status:product.status})}
                      >
                        {product.status ? (
                          <XSquare size={18} className="text-red-600" />
                        ) : (
                          <CheckSquare size={18} className="text-green-600" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
      </div>
      :<div>
        no products
      </div>
      }
    </div>
  );
};

export default AdminProductList;