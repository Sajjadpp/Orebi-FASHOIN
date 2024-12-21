const CouponsContent = () => (
    <>
      <h1 className="text-2xl font-bold mb-6">My Coupons</h1>
      <div className="grid grid-cols-2 gap-6">
        {[1, 2, 3].map((coupon) => (
          <div key={coupon} className="bg-white p-6 rounded-lg shadow-sm border-2 border-dashed border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">SAVE{coupon}0</h3>
              <span className="text-green-600 font-semibold">{coupon}0% OFF</span>
            </div>
            <p className="text-gray-600 text-sm mb-4">Valid until Dec {20 + coupon}, 2023</p>
            <button className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800">
              Use Coupon
            </button>
          </div>
        ))}
      </div>
    </>
  );

export default CouponsContent