import { useSelector } from "react-redux";
import { userAxiosInstance } from "../../../../redux/constants/AxiosInstance";
import { useEffect, useState } from "react";
import { Clock, CreditCard, Package, Truck } from "lucide-react";
import { fetchData } from "../../../../services/fetchData/fetchData";
import OrderDetails from "./OrderDetails";

const OrdersContent = () => {
  const [orders, setOrders] = useState([]);
  const user = useSelector(state => state.userReducer.user)
  const [viewDetails, setViewDetails] = useState(false)
  const fetchOrders = async() =>{
    if(!user) return 
    try{
      let response = await fetchData('order',{userId: user._id} )
      console.log(response,"user")
      setOrders(response)
    }
    catch(error){
      console.log(error)
    }
  }
  const getStatusColor = (status) => {
    const statusColors = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'processing': 'bg-blue-100 text-blue-800',
      'shipped': 'bg-purple-100 text-purple-800',
      'delivered': 'bg-green-100 text-green-800',
      'Cancelled': 'bg-red-100 text-red-800',
      'returned': 'bg-gray-100 text-gray-800',
      'return-request': 'bg-orange-100 text-orange-800',
      'cancel-request': 'bg-pink-100 text-pink-800'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  useEffect(()=>{
    fetchOrders()
  },[user])
  if(viewDetails) return <OrderDetails orders={viewDetails} refresh={fetchOrders}/>
  return(
    <div >
      
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      <div className={`bg-white rounded-lg shadow-sm p-6 `} >
        <div className="space-y-4">
        {orders && orders.map((order) => (
        <div key={order._id} className="bg-white rounded-lg shadow-sm border p-6">
          {/* Order Header */}
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold">Order #{order._id.slice(-6)}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                <Clock size={16} />
                <span>Placed on {formatDate(order.createdAt)}</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              
            </div>
          </div>

          {/* Order Items */}
          <div className="space-y-4">
            {order && order.items.map((item, index) => (
              <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-16 h-16 bg-gray-200 rounded">
                  <img
                    src={item.productId.images[0]}
                    alt="Product"
                    className="w-full h-full object-cover rounded"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h4 className="font-medium">Product Name</h4>
                    <span className={`text-sm ${getStatusColor(item.status)} px-2 py-1 rounded-full`}>
                      {item.status} 
                    </span>
                  </div>
                  <div className="mt-1 text-sm text-gray-600">
                    {item.price.toFixed(2)}
                  </div>
                  
                </div>
              </div>
            ))}
          </div>

          {/* Order Footer */}
          <div className="mt-6 pt-4 border-t flex justify-between">
              <button className=" h-[50px] px-5 bg-green-200 text-green-700 rounded-md" onClick={()=> setViewDetails(order)}>
                view details
              </button>
              <div className="flex flex-col items-end gap-2">
              <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(order.orderStatus)}`}>
                {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
              </span>
              <span className="text-md font-semibold">
                {order.totalAmount.toFixed(2)}
              </span>
              </div>
          </div>
        </div>
      ))}
        </div>
      </div>
    </div>
  )
    
};

export default OrdersContent