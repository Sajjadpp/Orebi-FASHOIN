import React, { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { userAxiosInstance } from '../../../redux/constants/AxiosInstance';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { generateInvoice } from '../../../services/Invoice/Invoice';

const OrderConfirmation = () => {
  const [orderDetails, setOrderDetails] = useState({});
  const [discount, setDiscount] = useState(0);
  const { state } = useLocation();
  const user = useSelector((state) => state?.userReducer?.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (state?.response) {
      try {
        const parsedData = JSON.parse(state.response);
        setOrderDetails(parsedData);
        // Check for coupon and calculate discount
        if (parsedData.discountApplied) {
          setDiscount(parsedData.discountApplied);
        }
      } catch (error) {
        console.error('Error parsing order details:', error);
        toast.error('Invalid order details.');
      }
    }
  }, [state]);

  const formatPrice = (price) => {
    return parseFloat(price).toLocaleString('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    });
  };

  useEffect(() => {
    if (Object.keys(orderDetails).length === 0) return;

    const sendMessage = async () => {
      try {
        await userAxiosInstance.get('/sendOrderMail', {
          params: { ...orderDetails, ...user },
        });
        toast.success('Order confirmation email sent!');
      } catch (error) {
        console.error('Error sending order email:', error);
        toast.error('Failed to send order confirmation email.');
      }
    };
    sendMessage();
  }, [orderDetails, user]);

  const handleDownloadInvoice = () => {
    // Ensure all numerical values are properly converted to numbers and have fallbacks
    const subtotal = Number(orderDetails.totalAmount - orderDetails.shippingCharge) || 0;
    const shippingCharge = Number(orderDetails.shippingCharge) || 0;
    const discountAmount = Number(orderDetails.discountApplied) || 0;
    const total = Number(orderDetails.totalAmount) || 0;

    // Create invoice data from actual order details with proper number formatting
    const invoiceData = {
      invoiceId: orderDetails.id || orderDetails._id,
      date: new Date(orderDetails.createdAt).toLocaleDateString(),
      customerName: user?.username || 'Customer',
      customerAddress: orderDetails.shippingAddress || 'N/A',
      items: (orderDetails.items || []).map(item => ({
        ...item,
        price: Number(item.price) || 0,
        quantity: Number(item.quantity) || 0,
        total: Number(item.price * item.quantity) || 0
      })),
      subtotal: subtotal.toFixed(2),
      shippingCharge: shippingCharge.toFixed(2),
      discountApplied: discountAmount.toFixed(2),
      totalAmount: total.toFixed(2),
      paymentMethod: orderDetails.paymentMethod || 'N/A',
      paymentStatus: orderDetails.paymentStatus || 'N/A',
      orderStatus: orderDetails.orderStatus || 'N/A'
    };
    console.log(invoiceData)
    generateInvoice(invoiceData);
  };

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
            <p className="text-lg font-medium text-gray-900">
              {orderDetails?.id || orderDetails?._id || '#N/A'}
            </p>
          </div>

          {/* Order Summary */}
          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{formatPrice(orderDetails.totalAmount - orderDetails.shippingCharge)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount Applied</span>
                  <span>- {formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>{formatPrice(orderDetails.shippingCharge)}</span>
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
              <p>Payment Method: {orderDetails.paymentMethod}</p>
              <p>Payment Status: {orderDetails.paymentStatus}</p>
              <p>Order Status: {orderDetails.orderStatus}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 space-y-3">
            <button
              onClick={() => {
                navigate('/profile');
                localStorage.setItem('profile_nav', 'orders');
              }}
              className="w-full bg-black text-white py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Track Order
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full bg-gray-100 text-gray-900 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Continue Shopping
            </button>
            <button
              onClick={handleDownloadInvoice}
              className="w-full bg-gray-100 text-gray-900 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Download Invoice
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;