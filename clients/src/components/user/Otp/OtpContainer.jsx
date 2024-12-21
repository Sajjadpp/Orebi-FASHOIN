import React, { useState, useEffect } from 'react';
import { userAxiosInstance } from '../../../redux/constants/AxiosInstance';
import { useDispatch, useSelector } from 'react-redux';
import { SaveUser } from '../../../redux/slices/userSlice';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const OTPVerificationContainer = ({ length = 4, expiryTime = 15 , setResend}) => {
  const [otp, setOtp] = useState(new Array(length).fill(''));
  const [timeLeft, setTimeLeft] = useState(expiryTime);
  
  useEffect(() => {
    if (timeLeft <= 0) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timeLeft]);
  
  const handleChange = (element, index) => {
    if (isNaN(element.value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);
    
    // Move to next input if current field is filled
    if (element.value && index < length - 1) {
      const nextInput = element.parentNode.nextSibling.querySelector('input');
      if (nextInput) nextInput.focus();
    }
  };
  
  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      // Move to previous input on backspace
      const prevInput = e.target.parentNode.previousSibling.querySelector('input');
      if (prevInput) prevInput.focus();
    }
  };

  const userdata = useSelector(state=> state.userReducer.user)

  const handleResend = async() => {

      let response = await userAxiosInstance.post("/generateOtp",userdata)
      if(response.status !== 200) return toast.error(response.data.message)

      setTimeLeft(expiryTime);
      toast.success('otp sended successfully')
      setOtp(new Array(length).fill(''));
  };
  
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const handleVerify=async()=>{

    let NumOtp = Number(otp.join(""))

    try{
        let response = await userAxiosInstance.post("/verifyOtp",{...userdata,otp: NumOtp})
        console.log(response);
        if(response.status != 200) return "err";
        let {token, user} = response.data
        dispatch(SaveUser({...user, token}))
        navigate('/')
    }
    catch(error){
        console.log(error)
        toast.error(error.response.data || error.message)
        setOtp(new Array(length).fill(''));
    }
    
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md my-20">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Enter Verification Code
        </h2>
        <p className="text-gray-600 mb-6">
          We have sent a verification code to your email
        </p>
      </div>
      
      <div className="flex justify-center gap-4 mb-6">
        {otp.map((digit, index) => (
          <div key={index} className="w-12 h-12 border-2 border-gray-300 rounded-lg">
            <input
              type="text"
              maxLength={1}
              className="w-full h-full text-center text-xl font-semibold text-gray-800 focus:outline-none focus:border-blue-500"
              value={digit}
              onChange={(e) => handleChange(e.target, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
            />
          </div>
        ))}
      </div>
      
      <div className="text-center text-sm text-gray-600 mb-4">
        Time remaining: {String(Math.floor(timeLeft / 60)).padStart(2, '0')}:
        {String(timeLeft % 60).padStart(2, '0')}
      </div>
      
      <button
        className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
        onClick={handleVerify}
      >
        Verify Code
      </button>
      
      <button
        className="w-full text-gray-600 mt-4 text-sm hover:text-gray-800"
        onClick={handleResend}
        disabled={timeLeft > 0}
      >
        Resend Code
      </button>
    </div>
  );
};

export default OTPVerificationContainer;