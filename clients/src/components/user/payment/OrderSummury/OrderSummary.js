import { useEffect, useState } from "react";

const OrderSummary = ({ items, onApplyCoupon, handleCheckout, onTotalChange:setTotal, total, couponAmt, onCouponChange }) => {
  const [couponCode, setCouponCode] = useState('');
  const [shippingCharge, setShippingCharge] = useState(0);
  const subtotal = items?.totalAmt;


  useEffect(() => {
    console.log('working 1', items.totalAmt)
    let shippingCharge;
    if (subtotal <= 1000) {
        console.log('working 2')
        
        setShippingCharge(50);
        shippingCharge = 50
      } else if (subtotal <= 4000) {
        setShippingCharge(25);
        shippingCharge = 25
        console.log('working 3')
      } else {
        console.log('working 4')
        shippingCharge = 0
        setShippingCharge(0);
      }
      console.log(subtotal, shippingCharge, couponAmt)
      setTotal(subtotal + shippingCharge - couponAmt);
      console.log(total)
  },[items.totalAmt, couponAmt]);

  
  
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
    
      {items.products &&  items?.products?.map(({productDetails, cartItems}) => {

        let totalQnty = cartItems.stocks.reduce((acc, val) => acc + val.quantity,0);
        let totalSize = cartItems.stocks.map(val=> val.size).join(',')
        return (
        <div key={productDetails.id} className="flex items-start space-x-4 mb-4 pb-4 border-b">
          <img src={productDetails?.images[0]} alt={productDetails.name} className="w-20 h-20 object-cover rounded" />
          <div className="flex-1">
            <h3 className="font-medium">{productDetails.name}</h3>
            <p className="text-gray-600">Quantity: {totalQnty} | Size: {totalSize}</p>
            <p className="text-gray-800">₹{productDetails.currentPrice} each</p>
          </div>
          <p className="font-medium">₹{productDetails.currentPrice * totalQnty}</p>
        </div>
        )
      })}

      <div className="mt-6">
        <div className="flex justify-between mb-2">
          <span>Subtotal</span>
          <span>₹{subtotal}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Shipping</span>
          <span>{!shippingCharge ? 'Free' : `₹${shippingCharge}`}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Applied coupon</span>
          <span>{`₹${couponAmt}`}</span>
        </div>
        <div className="flex justify-between font-semibold text-lg mb-6">
          <span>Total</span>
          <span>₹{total}</span>
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
            />
            {
              !couponAmt ? 
              <button
                onClick={() => onApplyCoupon(couponCode)}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                
                
              >
                Apply
              </button>
              : <button
                  onClick={() => onCouponChange(0)}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                  
                  
                >
                  remove
                </button>
            }
          </div>
        </div>

        <button onClick={()=> handleCheckout(shippingCharge)} className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default OrderSummary;
