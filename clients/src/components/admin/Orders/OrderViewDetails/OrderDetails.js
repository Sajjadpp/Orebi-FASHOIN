import React, { useEffect, useState } from 'react';
import { adminAxiosInstance, userAxiosInstance } from '../../../../redux/constants/AxiosInstance';

const OrderDetailsPage = ({ isOpen, data, onClose }) => {
  

  const [orderData, setOrderData] = useState({data});

  
  const statusOptions = {
    pending: ["Shipped", "Cancelled"],
    shipped: ["delivered"],
    cancelled: [],
    delivered: []
  };

  const [selectedStatus, setSelectedStatus] = useState(orderData.orderStatus);
  
console.log(selectedStatus,"selectedStatus")
  const handleStatusUpdate = async() => {
    setOrderData(prev => ({
      ...prev,
      status: selectedStatus
    }));
    let response = await adminAxiosInstance.patch('/orders',null, {
        params:{
            status:selectedStatus,
            _id: orderData._id
        }
    })

    console.log(`Status updated to: ${selectedStatus}`, response.data);
  };


  useEffect(()=>{
    setOrderData(data)
    setSelectedStatus(data.orderStatus)
  },[data])

  if (!isOpen || !data) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
      <div className="min-h-screen px-4 text-center">
        {/* Background overlay */}
        <div className="fixed inset-0 transition-opacity" onClick={onClose}>
          <div className="absolute inset-0 bg-black opacity-50"></div>
        </div>

        {/* Modal container */}
        <div className="inline-block w-full max-w-6xl my-8 text-left align-middle transition-all transform bg-gray-50 shadow-xl rounded-lg">
          {/* Modal header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-lg flex justify-between items-center">
            <h1 className="text-2xl font-bold">Order Details</h1>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Modal content */}
          <div className="p-6">
            {/* Order Header */}
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-xl font-bold mb-2">Order #{orderData.orderId}</h2>
                  <p className="text-gray-600">Order Date: {orderData.orderDate}</p>
                </div>
                <div className="flex gap-4 items-center">
                  <select 
                    value={selectedStatus}
                    onChange={(e) =>{
                        console.log(e.target.value)
                        setSelectedStatus(e.target.value)
                    } }
                    className="p-2 border rounded-md"
                  >
                    <option value={selectedStatus}>{selectedStatus}</option>
                    {console.log(statusOptions[orderData.orderStatus])}
                    {statusOptions[selectedStatus]?.map(status=>{
                    console.log(status)
                        return (
                        <option value={status}>{status}</option>
                    )})}
                  </select>
                  <button 
                    onClick={handleStatusUpdate}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    Update Status
                  </button>
                </div>
              </div>
            </div>

            {/* Information Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* User Details */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-lg font-semibold mb-4">User Details</h2>
                <div className="space-y-2">
                  <p><span className="font-medium">Name:</span> {orderData.user?.username}</p>
                  <p><span className="font-medium">Email:</span> {orderData.user?.email}</p>
                  <p><span className="font-medium">Mobile:</span> {orderData.user?.mobileNo}</p>
                </div>
              </div>

              {/* Order Details */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-lg font-semibold mb-4">Order Details</h2>
                <div className="space-y-2">
                  <p><span className="font-medium">Order ID:</span> {orderData.orderId}</p>
                  <p><span className="font-medium">Status:</span> 
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium
                      ${orderData.orderStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                      ${orderData.orderStatus === 'shipped' ? 'bg-blue-100 text-blue-800' : ''}
                      ${orderData.orderStatus === 'delivered' ? 'bg-green-100 text-green-800' : ''}
                      ${orderData.orderStatus === 'cancelled' ? 'bg-red-100 text-red-800' : ''}
                    `}>
                        
                      {orderData?.orderStatus ?? 'pending'}
                    </span>
                  </p>
                  <p><span className="font-medium">Date:</span> {orderData.createdAt}</p>
                </div>
              </div>

              {/* Address Details */}
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

            {/* Products Table */}
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
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {orderData && orderData?.productDetails?.map((product, i) => {
                        let item = orderData.items[i]
                        let stocks = item.stocks;
                            
                        return (
                      <tr key={product?._id}>
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
                        ₹{product?.currentPrice}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {data &&  stocks?.map(item =>(
                            <div>
                                {item.size} : {item.quantity}
                            </div>
                          ))}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                        ₹{item?.total}
                        
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium
                            ${item?.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                            ${item?.status === 'shipped' ? 'bg-blue-100 text-blue-800' : ''}
                            ${item?.status === 'delivered' ? 'bg-green-100 text-green-800' : ''}
                            ${item?.status === 'cancelled' ? 'bg-red-100 text-red-800' : ''}
                          `}>
                            {item?.status}
                          </span>
                        </td>
                      </tr>
                    )})}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Grand Total */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex justify-end">
                <div className="text-xl font-bold">
                  Grand Total: ₹{orderData.totalAmount}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;