const OrdersContent = () => (
    <>
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="space-y-4">
          {[1, 2, 3].map((order) => (
            <div key={order} className="border-b pb-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">Order #{order}23456</h3>
                  <p className="text-sm text-gray-500">Placed on Dec {order + 5}, 2023</p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  Delivered
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );

export default OrdersContent