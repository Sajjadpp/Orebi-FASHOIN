


import React, { useEffect, useState } from 'react';
import { adminAxiosInstance } from '../../../../redux/constants/AxiosInstance';
import toast from 'react-hot-toast';

const OrderDetailsPage = ({ isOpen, data, onClose, refresh }) => {
  const [orderData, setOrderData] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const statusOptions = {
    pending: ["Shipped", "Cancelled"],
    Shipped: ["Out for delivery"],
    cancelled: [],
    delivered: [],
    "Out for delivery": ['Delivered'],
    "return-request": []
  };

  useEffect(() => {
    if (data) {
      setOrderData(data);
      setSelectedStatus(data.orderStatus);
    }
  }, [data]);

  const handleStatusUpdate = async () => {
    if (selectedStatus === orderData.orderStatus) {
      toast.error('Please select a different status');
      return;
    }

    setIsUpdating(true);
    try {
      const response = await adminAxiosInstance.patch('/orders', null, {
        params: {
          status: selectedStatus,
          _id: orderData._id
        }
      });

      setOrderData(prev => ({
        ...prev,
        orderStatus: selectedStatus
      }));

      toast.success(response.data);
      
      if (refresh) {
        await refresh();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message ?? 'Error updating status');
      setSelectedStatus(orderData.orderStatus);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleReturnRequest = async (productId, action) => {
    setIsUpdating(true);
    try {
      const response = await adminAxiosInstance.patch('/orders/return-request', {
        orderId: orderData._id,
        productId,
        action
      });

      // Update the local state to reflect the change
      setOrderData(prev => ({
        ...prev,
        items: prev.items.map(item => {
          if (item.productId === productId) {
            return {
              ...item,
              status: action === 'accept' ? 'Return Accepted' : 'Return Declined'
            };
          }
          return item;
        })
      }));

      toast.success(response.data?.message ?? response.data);
      
      if (refresh) {
        await refresh();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message ?? 'Error updating return request');
    } finally {
      setIsUpdating(false);
    }
  };

  if (!isOpen || !orderData) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
      {/* Previous modal structure remains the same until the table */}
      <div className="min-h-screen px-4 text-center">
        {/* ... (previous code remains the same) ... */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-lg flex justify-between items-center">
          <h1 className="text-2xl font-bold">Order Details</h1>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div> 
        <div className="inline-block w-full max-w-6xl my-8 text-left align-middle transition-all transform bg-gray-50 shadow-xl rounded-lg">
          {/* ... (previous code remains the same until the table) ... */}
          <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-xl font-bold mb-2">Order #{orderData.orderId}</h2>
                  <p className="text-gray-600">Order Date: {new Date(orderData.createdAt).toLocaleString()}</p>
                </div>
                <div className="flex gap-4 items-center">
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="p-2 border rounded-md"
                    disabled={isUpdating}
                  >
                    <option value={orderData.orderStatus}>{orderData.orderStatus}</option>
                    {statusOptions[orderData.orderStatus]?.map((status, index) => (
                      <option key={index} value={status}>{status}</option>
                    ))}
                  </select>
                  <button
                    onClick={handleStatusUpdate}
                    disabled={isUpdating || selectedStatus === orderData.orderStatus}
                    className={`px-4 py-2 rounded-md text-white ${
                      isUpdating || selectedStatus === orderData.orderStatus
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {isUpdating ? 'Updating...' : 'Update Status'}
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-lg font-semibold mb-4">User Details</h2>
                <div className="space-y-2">
                  <p><span className="font-medium">Name:</span> {orderData.user?.username}</p>
                  <p><span className="font-medium">Email:</span> {orderData.user?.email}</p>
                  <p><span className="font-medium">Mobile:</span> {orderData.user?.mobileNo}</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-lg font-semibold mb-4">Order Details</h2>
                <div className="space-y-2">
                  <p><span className="font-medium">Order ID:</span> {orderData.orderId}</p>
                  <p>
                    <span className="font-medium">Status:</span> 
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium
                      ${orderData.orderStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                      ${orderData.orderStatus === 'Shipped' ? 'bg-blue-100 text-blue-800' : ''}
                      ${orderData.orderStatus === 'Delivered' ? 'bg-green-100 text-green-800' : ''}
                      ${orderData.orderStatus === 'Cancelled' ? 'bg-red-100 text-red-800' : ''}
                    `}>
                      {orderData?.orderStatus}
                    </span>
                  </p>
                  <p><span className="font-medium">Date:</span> {new Date(orderData.createdAt).toLocaleString()}</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-lg font-semibold mb-4">Address Details</h2>
                <div className="space-y-2">
                  <p><span className="font-medium">Street:</span> {orderData.shippingAddress?.fullAddress}</p>
                  <p><span className="font-medium">City:</span> {orderData.shippingAddress?.place}</p>
                  <p>
                    <span className="font-medium">State:</span> {orderData.shippingAddress?.state},
                    <span className="font-medium ml-2">ZIP:</span> {orderData.shippingAddress?.pincode}
                  </p>
                  <p><span className="font-medium">Country:</span> {orderData.shippingAddress?.country}</p>
                </div>
              </div>
            </div>
          <div className="bg-white rounded-lg shadow-sm mb-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Product</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Price</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Quantity</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Total</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {orderData.items.map((item, i) => {
                    const product = orderData.productDetails[i];
                    return (
                      <tr key={item.productId}>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <img 
                              src={product?.images[0]} 
                              alt={product?.name} 
                              className="w-16 h-16 object-cover rounded-md mr-4"
                            />
                            <span className="text-sm font-medium text-gray-900">{product?.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          ₹{item.price}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {item.stocks.map((stock, idx) => (
                            <div key={idx}>
                              {stock.size} : {stock.quantity}
                            </div>
                          ))}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          ₹{item.total}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium
                            ${item.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                            ${item.status === 'Shipped' ? 'bg-blue-100 text-blue-800' : ''}
                            ${item.status === 'Delivered' ? 'bg-green-100 text-green-800' : ''}
                            ${item.status === 'Cancelled' ? 'bg-red-100 text-red-800' : ''}
                            ${item.status === 'return-request' ? 'bg-purple-100 text-purple-800' : ''}
                            ${item.status === 'Return Accepted' ? 'bg-green-100 text-green-800' : ''}
                            ${item.status === 'Return Declined' ? 'bg-red-100 text-red-800' : ''}
                          `}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {item.status === 'return-request' && (
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleReturnRequest(item.productId, 'accept')}
                                disabled={isUpdating}
                                className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-gray-300"
                              >
                                Accept
                              </button>
                              <button
                                onClick={() => handleReturnRequest(item.productId, 'decline')}
                                disabled={isUpdating}
                                className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:bg-gray-300"
                              >
                                Decline
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* ... (rest of the code remains the same) ... */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between">
              <div className="space-y-2">
                <p><span className="font-medium">Subtotal:</span> ₹{orderData.totalAmount - orderData.shippingCharge + orderData.discountApplied}</p>
                <p><span className="font-medium">Shipping:</span> ₹{orderData.shippingCharge}</p>
                <p><span className="font-medium">Discount:</span> -₹{orderData.discountApplied}</p>
              </div>
              <div className="text-xl font-bold">
                Grand Total: ₹{orderData.totalAmount.toFixed()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;