import React, { useEffect, useState } from 'react';
import { adminAxiosInstance } from '../../../redux/constants/AxiosInstance';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import OrderDetailsPage from '../../../components/admin/Orders/OrderViewDetails/OrderDetails';

const OrderList = () => {
  // Sample data - replace with your actual data
 
    const [orders, setOrders] = useState([])
    const [detailPopup, setDetailPopup] = useState(false)
    const fetchOrders = async() =>{
        try{
            const response = await adminAxiosInstance.get('/orders')
            setOrders(response.data)
        }
        catch(error){
            console.log(error)
            toast.error('try again')
        }
    }

  useEffect(()=>{
    fetchOrders()
  },[])
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  // Calculate pagination values
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = orders?.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(orders?.length / itemsPerPage);

  // Handle page changes
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Handle view details click
  const handleViewDetails = (data) => {
    setDetailPopup({...data})
  };
  
  return (
    <div className="p-4">
        {
            detailPopup &&
            <OrderDetailsPage
                isOpen={detailPopup}
                data={detailPopup}
                onClose={()=> setDetailPopup(false)}
            />
        }
        <table className="w-full border-collapse bg-white shadow-sm rounded-lg overflow-hidden">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Name</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Email</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Total</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Status</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {currentItems.map((order) => {
            return(
            <tr key={order._id} className="hover:bg-gray-50">
              <td className="px-6 py-4 text-sm text-gray-900">{order.user.username}</td>
              <td className="px-6 py-4 text-sm text-gray-900">{order.user.email}</td>
              <td className="px-6 py-4 text-sm text-gray-900">₹{order.totalAmount}</td>
              <td className="px-6 py-4 text-sm">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  order.orderStatus === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {order.orderStatus}
                </span>
              </td>
              <td className="px-6 py-4 text-sm">
                <button
                  onClick={() => handleViewDetails(order)}
                  className="text-blue-600 hover:text-blue-900 font-medium"
                >
                  View Details
                </button>
              </td>
            </tr>
          )})}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-center mt-4 gap-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded bg-gray-100 text-gray-600 disabled:opacity-50"
        >
          Previous
        </button>
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            className={`px-3 py-1 rounded ${
              currentPage === index + 1
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded bg-gray-100 text-gray-600 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default OrderList;