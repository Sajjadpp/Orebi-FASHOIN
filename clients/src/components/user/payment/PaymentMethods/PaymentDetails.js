const PaymentSection = ({ selectedPayment, onPaymentSelect }) => {
  const paymentMethods = [
    {
      id: 'razorpay',
      name: 'Razorpay Online Payment',
      description: 'Pay securely using credit/debit cards, net banking, UPI, and wallets',
      icon: '💳'
    },
    {
      id: 'wallet',
      name: 'Wallet Online Wallet',
      description: 'Pay securely using Wallet',
      icon: '👝'
    },
    {
      id: 'cod',
      name: 'Cash on Delivery',
      description: 'Pay when you receive your order',
      icon: '💵'
    }
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Select Payment Method</h2>
      {paymentMethods.map((method) => (
        <div key={method.id} className="mb-4">
          <label className="flex items-start space-x-3 p-4 border rounded hover:border-gray-400 cursor-pointer">
            <input
              type="radio"
              name="payment"
              checked={selectedPayment === method.id}
              onChange={() => onPaymentSelect(method.id)}
              className="mt-1"
            />
            <div>
              <div className="flex items-center">
                <span className="mr-2">{method.icon}</span>
                <p className="font-medium">{method.name}</p>
              </div>
              <p className="text-gray-600 text-sm">{method.description}</p>
            </div>
          </label>
        </div>
      ))}
    </div>
  );
};

export default PaymentSection