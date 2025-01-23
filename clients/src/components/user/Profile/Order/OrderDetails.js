
import { useSelector } from "react-redux";
import { userAxiosInstance } from "../../../../redux/constants/AxiosInstance";
import { useEffect, useState } from "react";
import { Clock, CreditCard, Package, Truck } from "lucide-react";
import { fetchData } from "../../../../services/fetchData/fetchData";
import toast from "react-hot-toast";
import OrderAddress from "./OrderAddress";
import Confirm from "../../../../pages/user/Cart/Confirm";
import Confirmation from "../../../../assets/elements/Confirmation";


const OrderDetails = ({orders, refresh}) => {
  const [order, setOrder] = useState({})
  const [addressDetails, setAddressDetails] = useState(false);
  const [cancelConfirm, setCancelConfirm] = useState(false)

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

  const fetchAddress = async() =>{
    try{
      let response = await fetchData('singleAddress',{addressId:orders.shippingAddress})
      orders.shippingAddress = response
    }
    catch(error){
      console.log(error)
      toast.error("try again")
    }
  }

  const handleCancelOrder = async(product, portion) =>{
    
    let {userId, productId} = product
    let orderId = order._id
    try{
      let response = await userAxiosInstance.delete('/order', {
        params:{
          userId,
          productId,
          orderId,
          portion
        }
      })
      console.log(response)
      toast.success(response.data)
      refresh()
      
    }
    catch(error){
      console.log(error);
      toast.error('try again later')

    }
  }

  useEffect(()=>{
    fetchAddress()
    setOrder(orders)
    console.log(order,"orders")
  },[orders])

  if(!order._id) return 
  return(
    <>
      <OrderAddress
        isOpen={addressDetails}
        onClose={()=> setAddressDetails(false)}
        addressData={orders.shippingAddress}
      />
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="space-y-4">
        
        <div key={order._id} className="bg-white rounded-lg shadow-sm border p-6">
          {/* Order Header */}
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold">Order #{order._id}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                <Clock size={16} />
                <span>Placed on {formatDate(order.createdAt)}</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(order.orderStatus)}`}>
                {order?.orderStatus?.charAt(0).toUpperCase() + order?.orderStatus?.slice(1)}
              </span>
              <span className="text-lg font-semibold">
              ₹{order.totalAmount.toFixed(2)}
              </span>
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
                    <h4 className="font-medium">{item.productId.name}</h4>
                    <div>
                      <span className="font-medium">₹{item.price.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="mt-1 text-sm text-gray-600">
                    {item.stocks.map((stock, idx) => (
                      <span key={idx} className="mr-4">
                        Size: {stock.size} | Qty: {stock.quantity}
                      </span>
                    ))}
                  </div>
                  <div className="mt-2 flex justify-between">
                    <span className={`text-sm ${getStatusColor(item.status)} px-2 py-2 rounded-full `}>
                      {item.status} 
                    </span>
                    <button className={`h-[40px] ${item.status != 'Pending' ? "hidden": null} rounded-md px-7 bg-red-200 text-red-700 ${getStatusColor(item.status)}`} onClick={()=> handleCancelOrder(item,"SINGLE")}>
                      {item.status == 'Pending' ? "Cancell" : null}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Footer */}
          <div className="mt-6 pt-4 border-t grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <CreditCard size={20} className="text-gray-400" />
              <div>
                <p className="text-sm font-medium">Payment Method</p>
                <p className="text-sm text-gray-600 capitalize">{order.paymentMethod}</p>
                <span className={`text-xs ${order.paymentStatus === 'success' ? 'text-green-600' : 'text-yellow-600'}`}>
                  {order.paymentStatus.toUpperCase()}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Package size={20} className="text-gray-400" />
              <div>
                <p className="text-sm font-medium">Shipping Address</p>
                <p className="text-sm text-gray-600" onClick={()=> setAddressDetails(true)}>Delivery details here</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Truck size={20} className="text-gray-400" />
              <div>
                <p className="text-sm font-medium">Delivery Status</p>
                <p className="text-sm text-gray-600 capitalize">{order.orderStatus}</p>
              </div>
            </div>
          </div>
        </div>
        <button className={`h-[50px] px-4 bg-red-300 ${order.orderStatus !=="pending"&& 'hidden'}`} onClick={()=> setCancelConfirm({id:'null', portion:'FULL'})}>
            cancel order
        </button> 
        </div>
      </div>
      <Confirmation
        buttonText={"cancel order"}
        data={'Are you sure to delete the order'}
        isOpen={cancelConfirm}
        onClose={()=> setCancelConfirm(false)}
        onConfirm={()=> handleCancelOrder(cancelConfirm.id, cancelConfirm.portion)}
      />
    </>
  )
    
};

export default OrderDetails