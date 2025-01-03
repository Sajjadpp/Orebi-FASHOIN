import React from 'react';
import { userAxiosInstance } from '../../../redux/constants/AxiosInstance';
import toast from 'react-hot-toast';
import {useSelector} from 'react-redux'

const Confirm = ({state, setState, onSuccess}) => {

  const user = useSelector(state => state.userReducer.user)
  console.log(state,"state","  ", setState,"setSate")
  
  const handleRemoveProduct = async(pace)=>{
    if(!user) return 

    try{
      const response = await userAxiosInstance.delete('/cart',{
        params:{
          productId: state.productId,
          size: state.size,
          pace,
          userId: user._id
        }
      })
      toast.success(response.data)
      setState(false)
      onSuccess()
    }
    catch(error){
      toast.error(error.response.data)
      console.log(error)
    }
  }
  return (
    <div className='absolute inset-0 flex items-center justify-center w-100 h-100 bg-black-100'>

    <div className="w-[540px] h-40 bg-gray-200 shadow-md p-4 rounded-lg flex flex-col justify-between items-center text-white">
      <p className="text-center">Are you sure you want to proceed with the following action?</p>
      <div className="flex space-x-4">
        <button onClick={()=> handleRemoveProduct('HALF')} className="bg-red-500 px-4 py-2 rounded hover:bg-red-600 transition">Remove Selected Size</button>
        <button onClick={()=> handleRemoveProduct('FULL')} className="bg-red-500 px-4 py-2 rounded hover:bg-red-600 transition">Remove Product</button>
        <button onClick={()=> setState(false)} className="bg-gray-500 px-4 py-2 rounded hover:bg-gray-600 transition">Cancel</button>
      </div>
    </div>
    </div>
  );
};

export default Confirm;
