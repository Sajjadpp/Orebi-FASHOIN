import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { fetchData } from '../../../services/fetchData/fetchData';
import { useSelector } from 'react-redux';
import AddressSection from '../../../components/user/payment/AddressSection/AddressSection';
import PaymentSection from '../../../components/user/payment/PaymentMethods/PaymentDetails';
import OrderSummary from '../../../components/user/payment/OrderSummury/OrderSummary';
import toast from 'react-hot-toast';
import { userAxiosInstance } from '../../../redux/constants/AxiosInstance';
import NetworkAlert from '../../../assets/elements/NetworkAlert';



const CheckoutPage = () => {

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [addresses, setAddress] = useState([])
  const [orders, setOrders] = useState([])
  const userId = useSelector(state => state.userReducer.user._id)
  const [outOfStock, setOutOfStock] = useState(false)
  const [total, setTotal] = useState(orders?.cartItems?.total || 0)
  const navigate = useNavigate()

  const fetchAddress = async()=>{
    let response = await fetchData('address', {userId})
    console.log(response)
    setAddress(response)
  }

  const fetchOrder = async() =>{
    let response = await fetchData('cart', {userId})
    console.log(response,"working")
    setOrders(response)
  }

  // check products
  const checkProduct =async() =>{
    if(!orders) return 
    let products = orders.products.map(item => item.cartItems);
    console.log(products);
    
    try{
      
      let response = await userAxiosInstance.get('/checkProducts', {
        params:{
          products
        }
      })
      if(!response.data) return 
      
      setOutOfStock(response.data)
      console.log(response)
    }
    catch(error){
      console.log('error', error)
    }
  }

  useEffect(()=>{
    console.log('working')
    fetchAddress()
    fetchOrder()
  },[])

  

  useEffect(()=>{
    checkProduct()
  },[orders])


  const handleApplyCoupon = (code) => {
    // Add coupon logic here
    console.log('Applying coupon:', code);
  };

  const handleCheckout = async(shippingCharge) => {
    if (!selectedAddress) {
      toast.error('Please select a shipping address');
      return;
    }
    if (!selectedPayment) {
      toast.error('Please select a payment method');
      return;
    }
    // Add checkout logic here
    console.log('Proceeding to checkout');
    try{
      if(await checkProduct()){
        return toast.error('product is out of stock')
      }
      
      let response = await userAxiosInstance.post('/order', {
        ...orders, 
        selectedAddress,
        shippingCharge,
        total
      })
      
      navigate('/orderCompleted',{
        state:{
          response: JSON.stringify(response.data)
        }
      })

    }
    catch(error){
      console.log(error);
      toast.error("try again later")
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      {outOfStock && <NetworkAlert setNetwork={setOutOfStock} text={'product is out of stock'}/>}
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <AddressSection
              addresses={addresses}
              selectedAddress={selectedAddress}
              onAddressSelect={setSelectedAddress}
              refreshData={fetchAddress}
            />
            <PaymentSection
              selectedPayment={selectedPayment}
              onPaymentSelect={setSelectedPayment}
            />
          </div>
          <div>
            <OrderSummary
              items={orders}
              onApplyCoupon={handleApplyCoupon}
              handleCheckout={handleCheckout}
              refreshData={fetchOrder}
              onTotalChange={setTotal}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;