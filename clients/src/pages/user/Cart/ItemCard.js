import React, { useEffect, useRef, useState } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { userAxiosInstance } from "../../../redux/constants/AxiosInstance";
import toast from "react-hot-toast";
import Confirm from "./Confirm";

const ItemCard = ({ item: products, onRemove, refreshCart }) => {
  const [product, setProduct] = useState(products);
  const [item, setItem] = useState(product.cartItems);
  const quantityRef = useRef();

  const onUpdateQuantity = async (item, size, updateVal) => {
    try {
      if (quantityRef.current.textContent == 1 && updateVal == -1) return;

      await userAxiosInstance.patch('/cart', null, {
        params: {
          userId: product.userId,
          productId: item.productId,
          size,
          updateVal,
          quantity: quantityRef.current.textContent,
        },
      });

      toast.success(`Quantity ${updateVal === 1 ? 'increased' : 'decreased'}`);
      refreshCart(); // Refresh the cart after successful update
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data || 'Failed to update quantity');
    }
  };

  const [confirmPopup, setConfirmPopup] = useState(false);
  const [selectedSize, setSelectedSize] = useState(item?.stocks[0]?.size || '');

  const getCurrentStock = () => {
    return item.stocks.find(stock => stock.size === selectedSize) || item.stocks[0];
  };

  const handleSizeChange = (e) => {
    const newSize = e.target.value;
    setSelectedSize(newSize);
    refreshCart(); // Refresh the cart after size change
  };

  const formatPrice = (price) => {
    return parseFloat(price).toLocaleString('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    });
  };

  const calculateItemTotal = () => {
    const currentStock = getCurrentStock();
    return currentStock.quantity * parseFloat(product.productDetails.currentPrice);
  };

  useEffect(() => {
    setProduct(products);
    setItem(products.cartItems);
  }, [products]);

  const openConfirm = (productId, size) => {
    setConfirmPopup({ productId, size });
  };
  
  const onSuccess = () => {
    
    refreshCart(); // Refresh the cart after a successful operation
    setSelectedSize(item?.stocks[0]?.size);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
      {confirmPopup && (
        <Confirm state={confirmPopup} setState={setConfirmPopup} onSuccess={onSuccess} />
      )}
      <div className="flex gap-4">
        <img
          src={product.productDetails.images[0]}
          alt={product.productDetails.name}
          className="w-24 h-24 object-cover rounded"
        />
        <div className="flex-grow flex flex-col">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-lg">{product.productDetails.name}</h3>
              <p className="text-gray-600 mt-1">
                {formatPrice(product.productDetails.currentPrice)}
                {product.productDetails.regularPrice !== product.productDetails.currentPrice && (
                  <span className="line-through text-gray-400 ml-2">
                    {formatPrice(product.productDetails.regularPrice)}
                  </span>
                )}
              </p>
            </div>
            <button
              onClick={() => openConfirm(item._id, selectedSize)}
              className="p-1.5 text-red-500 hover:bg-red-50 rounded"
              aria-label="Remove item"
            >
              <Trash2 size={20} />
            </button>
          </div>
          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center gap-2">
              <label htmlFor={`size-${item._id}`} className="text-gray-600">
                Size:
              </label>
              <select
                id={`size-${item._id}`}
                value={selectedSize}
                onChange={handleSizeChange}
                className="border rounded px-2 py-1 bg-[#f5f5f3]"
              >
                {item.stocks.map((stock) => (
                  <option key={stock._id} value={stock.size}>
                    {stock.size}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-gray-600">Qty:</label>
              <div className="flex items-center border rounded bg-[#f5f5f3]">
                <button
                  onClick={() => onUpdateQuantity(item, selectedSize, -1)}
                  className="p-1.5 hover:bg-gray-200 rounded-l"
                  aria-label="Decrease quantity"
                >
                  <Minus size={16} />
                </button>
                <span className="px-3" ref={quantityRef}>
                  {getCurrentStock().quantity}
                </span>
                <button
                  onClick={() => onUpdateQuantity(item, selectedSize, 1)}
                  className="p-1.5 hover:bg-gray-200 rounded-r"
                  aria-label="Increase quantity"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
            <div className="ml-auto">
              <p className="font-medium">
                Total: {formatPrice(calculateItemTotal())}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
