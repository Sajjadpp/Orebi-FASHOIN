import React, { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { userAxiosInstance } from '../../../redux/constants/AxiosInstance';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';

const OrderConfirmation = () => {
    const [orderDetails, setOrderDetails] = useState({});
    let {state}= useLocation()
    let user = useSelector(state => state?.userReducer?.user)
    const navigate = useNavigate()

    useEffect(()=>{
        console.log(JSON.parse(state.response))
        setOrderDetails(JSON.parse(state.response));
    },[state])

    const formatPrice = (price) => {
        return parseFloat(price).toLocaleString('en-IN', {
          style: 'currency',
          currency: 'INR',
          minimumFractionDigits: 2,
        });
    };

    useEffect(()=>{
        if(!orderDetails) return
        let sendMssage = async() =>{
            try{
                let response = await userAxiosInstance.get("/sendOrderMail",{
                    params:{...orderDetails, ...user}
                })
            }
            catch(error){
                console.log(error)
                toast.error('error')
            }
        }
        sendMssage()
    },[orderDetails])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header Section */}
        <div className="text-center p-8">
          <div className="mx-auto mb-4 h-16 w-16 flex items-center justify-center rounded-full bg-green-100">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Order Confirmed!</h1>
          <p className="mt-2 text-gray-600">Thank you for your purchase</p>
        </div>
        
        {/* Content Section */}
        <div className="px-8 pb-8 space-y-6">
          {/* Order Number */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Order Number</p>
            <p className="text-lg font-medium text-gray-900">#2024-0123</p>
          </div>
          
          {/* Order Summary */}
          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{formatPrice(orderDetails.totalAmount)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>{formatPrice(50)}</span>
              </div>
              <div className="flex justify-between font-medium text-gray-900 pt-2 border-t border-gray-200">
                <span>Total</span>
                <span>{formatPrice(orderDetails.totalAmount)}</span>
              </div>
            </div>
          </div>
          
          {/* Delivery Info */}
          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Delivery Information</h2>
            <div className="space-y-2 text-gray-600">
              <p>Estimated Delivery: 3-5 Business Days</p>
              <p>Shipping Method: Standard Delivery</p>
              <p>Tracking Number: Will be sent via email</p>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="mt-8 space-y-3">
            <button onClick={()=> {
              navigate('/profile')
              localStorage.setItem('profile_nav', 'orders')
              }} className="w-full bg-black text-white py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors">
              Track Order
            </button>
            <button onClick={()=> navigate('/')} className="w-full bg-gray-100 text-gray-900 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors">
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;