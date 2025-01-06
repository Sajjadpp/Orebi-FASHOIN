import React from 'react';
import { userAxiosInstance } from '../../../redux/constants/AxiosInstance';
import toast from 'react-hot-toast';
import {useSelector} from 'react-redux'



const Confirm = ({ state, setState, onSuccess }) => {
  const user = useSelector(state => state.userReducer.user);

  const handleRemoveProduct = async (pace) => {
    if (!user) return;

    try {
      const response = await userAxiosInstance.delete('/cart', {
        params: {
          productId: state.productId,
          size: state.size,
          pace,
          userId: user._id
        }
      });
      toast.success(response.data);
      setState(false);
      onSuccess();
    } catch (error) {
      toast.error(error.response.data);
      console.log(error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-6 mx-4 transform transition-all">
        <p className="text-gray-800 text-lg font-medium text-center mb-8">
          Are you sure you want to proceed with the following action?
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => handleRemoveProduct('HALF')}
            className="bg-red-500 text-white px-6 py-2.5 rounded-lg hover:bg-red-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
          >
            Remove Selected Size
          </button>
          <button
            onClick={() => handleRemoveProduct('FULL')}
            className="bg-red-500 text-white px-6 py-2.5 rounded-lg hover:bg-red-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
          >
            Remove Product
          </button>
          <button
            onClick={() => setState(false)}
            className="bg-gray-500 text-white px-6 py-2.5 rounded-lg hover:bg-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};



export default Confirm;
