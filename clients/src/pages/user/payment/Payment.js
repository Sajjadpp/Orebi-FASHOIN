import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { useRazorpay } from 'react-razorpay';

import { fetchData } from '../../../services/fetchData/fetchData';
import { userAxiosInstance } from '../../../redux/constants/AxiosInstance';
import AddressSection from '../../../components/user/payment/AddressSection/AddressSection';
import PaymentSection from '../../../components/user/payment/PaymentMethods/PaymentDetails';
import OrderSummary from '../../../components/user/payment/OrderSummury/OrderSummary';
import CouponPopup from '../../../components/user/payment/CouponPopup/CouponPopup';
import NetworkAlert from '../../../assets/elements/NetworkAlert';
import handlePayment from '../../../services/Payment/Razorpay';

const CheckoutPage = () => {
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [outOfStock, setOutOfStock] = useState(false);
  const [total, setTotal] = useState(0);
  const [couponAmt, setCouponAmt] = useState(0)
 
  const userId = useSelector(state => state.userReducer.user._id);
  const navigate = useNavigate();
  const { Razorpay } = useRazorpay();

  // Fetch User Data
  const fetchAddress = async () => {
    try {
      const response = await fetchData('address', { userId });
      setAddresses(response);
    } catch (error) {
      console.error('Error fetching addresses:', error);
      toast.error('Failed to fetch addresses.');
    }
  };

  const fetchOrder = async () => {
    try {
      const response = await fetchData('cart', { userId });
      setOrders(response);
      setTotal(response?.cartItems?.total || 0);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to fetch orders.');
    }
  };

  // Check Product Stock
  const checkProduct = async () => {
    if (!orders || !orders.products) return false;
    const products = orders.products.map(item => item.cartItems);

    try {
      const response = await userAxiosInstance.get('/checkProducts', { params: { products } });
      setOutOfStock(response.data);
      return response.data;
    } catch (error) {
      console.error('Error checking product stock:', error);
      toast.error('Failed to check product availability.');
      return false;
    }
  };

  // Apply Coupon Code
  const handleApplyCoupon = async (code) => {
    if (!code) {
      toast.error('Please enter a coupon code.');
      return;
    }

    try {
      const response = await userAxiosInstance.post('/checkCoupon', { code, userId, total });
      
      const newTotal = total - response.data.discountAmount;
      setCouponAmt(response.data.discountAmount)

      toast.success(`Coupon applied! You saved ₹${response.data.discountAmount}`);

    } catch (error) {
      console.error('Error applying coupon:', error);
      toast.error(error.response.data.message);
    }
  };

  // Handle Checkout
  const handleCheckout = async (shippingCharge) => {
    if (!selectedAddress) {
      toast.error('Please select a shipping address.');
      return;
    }
    if (!selectedPayment) {
      toast.error('Please select a payment method.');
      return;
    }

    try {
      const isOutOfStock = await checkProduct();
      if (isOutOfStock) {
        toast.error('One or more products are out of stock.');
        return;
      }
      console.log(total, couponAmt, shippingCharge)
      const response = await userAxiosInstance.post('/order', {
        ...orders,
        selectedAddress,
        shippingCharge,
        discountApplied: couponAmt,
        total: total-couponAmt+shippingCharge,
        selectedPayment,
      });

      if (selectedPayment === 'razorpay') {
        handleRazorPay(response.data);
      } else {
        navigate('/orderCompleted', { state: { response: JSON.stringify(response.data) } });
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      toast.error(error.response.data?.message ?? error.response.data ?? 'Error during checkout');
    }
  };

  // Razorpay Payment
  const handleRazorPay = (data) => {
    console.log(total,"total in handle razorpay")

    handlePayment(Razorpay, async () => {
      try {
        await userAxiosInstance.put('/order', { _id: data._id, paymentStatus: 'success' });
        navigate('/orderCompleted', { state: { response: JSON.stringify(data) } });
      } catch (error) {
        console.error('Error during payment confirmation:', error);
        toast.error('Payment failed. Try again.');
      }
    }, ()=>{

    }, total);
  };

  // Fetch Data on Load
  useEffect(() => {
    fetchAddress();
    fetchOrder();
  }, []);

  useEffect(() => {
    if (orders.products?.length) {
      checkProduct();
    }
  }, [orders]);

  return (
    <div className="min-h-screen bg-gray-100 py-8 relative">
      <CouponPopup onApplyCoupon={handleApplyCoupon} />
      {outOfStock && <NetworkAlert setNetwork={setOutOfStock} text="Product is out of stock" />}
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
              total={total}
              couponAmt={couponAmt}
              onCouponChange={setCouponAmt}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
