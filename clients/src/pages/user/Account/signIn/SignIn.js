'use client';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../../../redux/thunk/loginThunk';
import toast from 'react-hot-toast';
import GoogleAuthButton from '../../../../components/user/GoogleAuth/GoogleButton';


export default function Samp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate()

  // dispatch login
  const dispatch = useDispatch();
  const user = useSelector(state=> state.useReducer)
  console.log(user,"user")
  useEffect(()=>{
      if(user?.user){
        navigate("/")
      }
    },[user])

  const handleSubmit = async(e) => {
    e.preventDefault();
    // Handle sign in logic here
    let response = await dispatch(loginUser({email,password}))
    if(response.type !== "auth/loginUser/fulfilled") return toast.error(response.payload)
    
    handleNavigation('/')
  };
  const handleNavigation=(redirectTo)=>{
    navigate(redirectTo)
  }
  return (
    <div className="min-h-screen bg-[#f5f5f3] flex items-center justify-center p-4 ">
      <div className="md:w-[30%] w-full space-y-10 bg-white p-8 h-[90%] shadow-lg py-20">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">Welcome Back</h2>
          <p className="text-gray-600">Please sign in to your account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div className="relative">
            <label htmlFor="email" className="text-sm font-medium text-gray-700 block mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="text-sm font-medium text-gray-700 block mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 text-sm text-gray-600">
                Remember me
              </label>
            </div>
            <button type="button" className="text-sm font-medium text-gray-600 hover:text-black">
              Forgot password?
            </button>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            className="w-full bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 focus:ring-2 focus:ring-offset-2 focus:ring-black transition-all duration-200 font-medium"
          >
            Sign In
          </button>
          <GoogleAuthButton/>
          {/* Sign Up Link */}
          <p className="text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <button onClick={()=> handleNavigation("/signup")} className="font-medium text-black hover:underline">
              Sign up
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
