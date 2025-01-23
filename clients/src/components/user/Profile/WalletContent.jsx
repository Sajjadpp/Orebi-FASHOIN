import { useEffect, useState } from "react";
import { userAxiosInstance } from "../../../redux/constants/AxiosInstance";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const WalletContent = () => {
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(0);
  const user = useSelector((state) => state.userReducer.user);

  const fetchWallet = async () => {
    try {
      const response = await userAxiosInstance.get(`/wallet/${user._id}`);
      console.log(response.data.transactions, "transactions");
      setBalance(response.data.balance);
      setTransactions([...response.data.transactions]);
    } catch (error) {
      console.log(error);
      toast.error("Unable to fetch wallet details");
    }
  };

  useEffect(() => {
    fetchWallet();
  }, []);

  return (
    <>
      <h1 className="text-3xl font-extrabold text-gray-800 mb-6">My Wallet</h1>
      <div className="bg-white rounded-lg shadow-md p-8">
        {/* Balance Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-600 mb-1">Current Balance</h2>
          <p className="text-4xl font-bold text-green-600">₹{balance}</p>
        </div>

        {/* Transactions Section */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-800">Recent Transactions</h2>
          {transactions.length > 0 ? (
            transactions.map((transaction) => (
              <div
                key={transaction.transactionId}
                className="flex justify-between items-center border-b border-gray-200 pb-4"
              >
                <div>
                  <h3 className="text-md font-medium text-gray-700">
                    {transaction.description}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {new Date(transaction.date).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`text-lg font-semibold ${
                    transaction.type === "debit" ? "text-red-500" : "text-green-500"
                  }`}
                >
                  {transaction.type === "debit" ? "-" : "+"}₹{transaction.amount}
                </span>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No recent transactions found.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default WalletContent;
