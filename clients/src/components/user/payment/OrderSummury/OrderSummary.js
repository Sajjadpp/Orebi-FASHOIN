import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const OrderSummary = ({
  items,
  onApplyCoupon,
  handleCheckout,
  total,
  couponAmt,
  onCouponChange,
  onTotalChange: setTotal
}) => {
  const [couponCode, setCouponCode] = useState('');
  const [shippingCharge, setShippingCharge] = useState(0);
  const [calculations, setCalculations] = useState({
    subtotal: 0,
    shipping: 0,
    discount: 0,
    final: 0
  });

  const navigate = useNavigate();

  // Calculate all amounts whenever dependencies change
  useEffect(() => {
    // Get subtotal directly from items.totalAmt
    const subtotal = items?.totalAmt || 0;
    let shipping = 0;

    // Calculate shipping charge
    if (subtotal <= 1000) {
      shipping = 50;
    } else if (subtotal <= 4000) {
      shipping = 25;
    }

    const discount = couponAmt || 0;
    const finalTotal = subtotal + shipping - discount;

    console.log('Calculations:', {
      subtotal,
      shipping,
      discount,
      finalTotal,
      originalItems: items // Log the original items for debugging
    });

    setShippingCharge(shipping);
    setCalculations({
      subtotal,
      shipping,
      discount,
      final: finalTotal
    });

    // Update parent component's total
    setTotal(finalTotal);
  }, [items?.totalAmt, couponAmt, setTotal]);

  // Handle coupon application
  const handleCouponApply = () => {
    if (!couponCode.trim()) return;
    onApplyCoupon(couponCode);
  };

  // Handle coupon removal
  const handleCouponRemove = () => {
    onCouponChange(0);
    setCouponCode('');
  };

  // Render product items
  const renderProductItems = () => {
    if (!items?.products) return null;

    return items.products.map(({ productDetails, cartItems }) => {
      const totalQty = cartItems.stocks.reduce((acc, val) => acc + val.quantity, 0);
      const totalSize = cartItems.stocks.map(val => val.size).join(', ');
      const itemTotal = productDetails.currentPrice * totalQty;

      return (
        <div key={productDetails._id} className="flex items-start space-x-4 mb-4 pb-4 border-b">
          <img 
            src={productDetails?.images[0]} 
            alt={productDetails.name} 
            className="w-20 h-20 object-cover rounded" 
          />
          <div className="flex-1">
            <h3 className="font-medium">{productDetails.name}</h3>
            <p className="text-gray-600">
              Quantity: {totalQty} | Size: {totalSize}
            </p>
            <p className="text-gray-800">₹{productDetails.currentPrice} each</p>
          </div>
          <p className="font-medium">₹{itemTotal}</p>
        </div>
      );
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
      
      {renderProductItems()}

      <div className="mt-6">
        <div className="flex justify-between mb-2">
          <span>Subtotal</span>
          <span>₹{calculations.subtotal}</span>
        </div>
        
        <div className="flex justify-between mb-2">
          <span>Shipping</span>
          <span>{calculations.shipping === 0 ? 'Free' : `₹${calculations.shipping}`}</span>
        </div>
        
        <div className="flex justify-between mb-2">
          <span>Applied coupon</span>
          <span>{calculations.discount > 0 ? `-₹${calculations.discount}` : '₹0'}</span>
        </div>
        
        <div className="flex justify-between font-semibold text-lg mb-6">
          <span>Total</span>
          <span>₹{calculations.final}</span>
        </div>

        <div className="mb-4">
          <p className="font-medium mb-2">Coupon Code</p>
          <div className="flex space-x-2">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="Enter coupon code"
              className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={couponAmt > 0}
            />
            {couponAmt > 0 ? (
              <button
                onClick={handleCouponRemove}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Remove
              </button>
            ) : (
              <button
                onClick={handleCouponApply}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                disabled={!couponCode.trim()}
              >
                Apply
              </button>
            )}
          </div>
        </div>

        <button 
          onClick={() => handleCheckout(calculations.shipping)}
          className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default OrderSummary;