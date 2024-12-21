const WalletContent = () => (
    <>
      <h1 className="text-2xl font-bold mb-6">My Wallet</h1>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Balance</h2>
          <p className="text-3xl font-bold">$250.00</p>
        </div>
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Recent Transactions</h2>
          {[1, 2, 3].map((transaction) => (
            <div key={transaction} className="flex justify-between items-center border-b pb-4">
              <div>
                <h3 className="font-semibold">Purchase #{transaction}54321</h3>
                <p className="text-sm text-gray-500">Dec {transaction + 2}, 2023</p>
              </div>
              <span className="font-semibold text-red-600">-$49.99</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );

export default WalletContent