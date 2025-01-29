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
  // Core state
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [orders, setOrders] = useState({ products: [], totalAmt: 0 });
  
  // Order calculation state
  const [total, setTotal] = useState(0);
  const [couponAmt, setCouponAmt] = useState(0);
  
  // Status states
  const [outOfStock, setOutOfStock] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const userId = useSelector(state => state.userReducer.user._id);
  const navigate = useNavigate();
  const { Razorpay } = useRazorpay();

  // Fetch initial data
  useEffect(() => {
    const initializeCheckout = async () => {
      setIsLoading(true);
      try {
        await Promise.all([fetchAddress(), fetchOrder()]);
      } catch (error) {
        console.error('Error initializing checkout:', error);
        toast.error('Failed to load checkout data');
      } finally {
        setIsLoading(false);
      }
    };

    initializeCheckout();
  }, [userId]);

  // Check stock when orders change
  useEffect(() => {
    if (orders.products?.length) {
      checkProduct();
    }
  }, [orders]);

  // Fetch addresses
  const fetchAddress = async () => {
    try {
      const response = await fetchData('address', { userId });
      setAddresses(response);
      return response;
    } catch (error) {
      console.error('Error fetching addresses:', error);
      toast.error('Failed to fetch addresses');
      throw error;
    }
  };

  // Fetch cart/orders
  const fetchOrder = async () => {
    try {
      const response = await fetchData('cart', { userId });
      setOrders(response); // Set the entire response object
      setTotal(response?.cartItems?.total || 0);
      return response;
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to fetch orders');
      throw error;
    }
  };
  console.log(orders)
  // Check product stock
  const checkProduct = async () => {
    if (!orders?.products?.length) return false;
    
    try {
      const products = orders.products.map(item => item.cartItems);
      const response = await userAxiosInstance.get('/checkProducts', { 
        params: { products } 
      });
      setOutOfStock(response.data);
      return response.data;
    } catch (error) {
      console.error('Error checking product stock:', error);
      toast.error('Failed to check product availability');
      return false;
    }
  };

  // Handle coupon application
  const handleApplyCoupon = async (code) => {
    if (!code?.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }

    try {
      const response = await userAxiosInstance.post('/checkCoupon', { 
        code, 
        userId, 
        total 
      });
      
      setCouponAmt(response.data.discountAmount);
      toast.success(`Coupon applied! You saved ₹${response.data.discountAmount}`);
    } catch (error) {
      console.error('Error applying coupon:', error);
      toast.error(error.response?.data?.message || 'Failed to apply coupon');
    }
  };

  // Handle checkout process
  const handleCheckout = async (shippingCharge) => {
    // Validation checks
    if (!selectedAddress) {
      toast.error('Please select a shipping address');
      return;
    }
    if (!selectedPayment) {
      toast.error('Please select a payment method');
      return;
    }

    try {
      // Check stock before proceeding
      const isOutOfStock = await checkProduct();
      if (isOutOfStock) {
        toast.error('One or more products are out of stock');
        return;
      }

      // Calculate final total
      const finalTotal = total - couponAmt;

      // Create order
      const orderData = {
        ...orders,
        selectedAddress,
        shippingCharge,
        discountApplied: couponAmt,
        total: finalTotal,
        selectedPayment,
      };

      const response = await userAxiosInstance.post('/order', orderData);

      // Handle payment based on method
      if (selectedPayment === 'razorpay') {
        console.log(finalTotal, 'finaltotal', response.data)
        handleRazorPayment(response.data, finalTotal.toFixed());
      } else {
        navigateToOrderComplete(response.data);
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      toast.error(error.response?.data?.message || 'Error during checkout');
    }
  };

  // Handle Razorpay payment
  const handleRazorPayment = (orderData, finalTotal) => {
    handlePayment(
      Razorpay,
      async () => {
        try {
          await userAxiosInstance.put('/order', {
            _id: orderData._id,
            paymentStatus: 'success'
          });
          navigateToOrderComplete(orderData);
        } catch (error) {
          console.error('Error during payment confirmation:', error);
          toast.error('Payment confirmation failed');
          handlePaymentFailure();
        }
      },
      handlePaymentFailure,
      finalTotal
    );
  };

  // Handle payment failure
  const handlePaymentFailure = () => {
    toast.error('Payment failed. You can complete the payment in your order history');
    setTimeout(() => {
      navigate('/profile');
    }, 2000);
  };

  // Navigate to order completion
  const navigateToOrderComplete = (data) => {
    navigate('/orderCompleted', {
      state: { response: JSON.stringify(data) }
    });
  };

  if (isLoading) {
    return <div>Loading checkout...</div>; // Consider using a proper loading component
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 relative">
      <CouponPopup onApplyCoupon={handleApplyCoupon} />
      
      {outOfStock && (
        <NetworkAlert 
          setNetwork={setOutOfStock} 
          text="Product is out of stock" 
        />
      )}
      
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