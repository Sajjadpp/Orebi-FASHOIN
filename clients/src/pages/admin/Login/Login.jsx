import React, { useEffect, useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Loader2, XCircle } from 'lucide-react';
import CustomAlert from './Alert';
import { adminAxiosInstance, userAxiosInstance } from '../../../redux/constants/AxiosInstance';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { SaveAdmin } from '../../../redux/slices/adminSlice';

const AdminLogin = () => {
  // ... [Previous state declarations remain the same]
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // navigation
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const admin = useSelector(state=> state.adminReducer.token)
  useEffect(()=>{
    if(admin) return navigate('/admin')
  },[admin])

  // ... [Rest of the component remains the same until the Alert usage]
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      if (!email || !password) {
        throw new Error('Please fill in all fields');
      }

      let response = await adminAxiosInstance.post('/login',{email, password})
      console.log('working,', response)
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false)
        navigate("/admin")
        dispatch(SaveAdmin(response.data.token))
      }, 2000);
      
    } catch (err) {
      console.log(err.response)
      setError(err.response.data );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 animate-gradient-shift">
      <div className={`max-w-md w-full mx-4 space-y-8 p-8 bg-white/90 backdrop-blur-lg rounded-xl shadow-lg 
        transition-all duration-500 ease-in-out transform 
        ${isSuccess ? 'scale-105 bg-green-50/90' : 'hover:shadow-1xl'}
        ${isLoading ? 'scale-[0.98] opacity-80' : ''}`}>
        
        {/* Logo Section */}
        <div className="text-center relative">
          <div className={`mx-auto h-16 w-16 bg-gradient-to-tr from-indigo-600 to-purple-600 
            rounded-xl flex items-center justify-center mb-4 transform transition-all duration-700
            ${isSuccess ? 'rotate-180 scale-110' : 'animate-float'}`}>
            <Lock className={`h-8 w-8 text-white transition-transform duration-700 
              ${isSuccess ? 'rotate-180' : ''}`} />
          </div>
          
          <div className="relative overflow-hidden">
            <h2 className={`text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 
              bg-clip-text text-transparent transition-all duration-300 
              ${isSuccess ? 'translate-y-[-100%]' : 'translate-y-0'}`}>
              Admin Login
            </h2>
            <h2 className={`text-3xl font-bold text-green-500 absolute top-0 left-0 w-full
              transition-all duration-300
              ${isSuccess ? 'translate-y-0' : 'translate-y-[100%]'}`}>
              Welcome Back!
            </h2>
          </div>
          
          <p className="mt-2 text-sm text-gray-600">
            Please sign in to your admin account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">

          {error && (
            <CustomAlert variant="destructive">
              {error}
            </CustomAlert>
          )}

          {/* ... [Rest of the form remains exactly the same] ... */}
          {/* Email Field with floating label */}
          <div className="relative group">
            <div className="relative transition-all duration-300 transform origin-left">
              <input
                id="email"
                type="email"
                required
                disabled={isLoading}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="peer w-full px-10 py-3 border-2 border-gray-300 rounded-lg outline-none 
                  focus:border-indigo-500 placeholder-transparent transition-all duration-300
                  disabled:opacity-50 disabled:cursor-not-allowed bg-white/50 backdrop-blur-sm"
                placeholder="Email"
              />
              <label
                htmlFor="email"
                className="absolute left-10 -top-6 text-sm text-gray-600 cursor-text 
                  transition-all duration-300 peer-placeholder-shown:text-base 
                  peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400
                  peer-focus:-top-6 peer-focus:text-sm peer-focus:text-indigo-600"
              >
                Email address
              </label>
              <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400 
                transition-colors duration-300 group-focus-within:text-indigo-500" />
            </div>
          </div>

          {/* Password Field with floating label */}
          <div className="relative group">
            <div className="relative transition-all duration-300 transform origin-left">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                disabled={isLoading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="peer w-full px-10 py-3 border-2 border-gray-300 rounded-lg outline-none 
                  focus:border-indigo-500 placeholder-transparent transition-all duration-300
                  disabled:opacity-50 disabled:cursor-not-allowed bg-white/50 backdrop-blur-sm"
                placeholder="Password"
              />
              <label
                htmlFor="password"
                className="absolute left-10 -top-6 text-sm text-gray-600 cursor-text 
                  transition-all duration-300 peer-placeholder-shown:text-base 
                  peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400
                  peer-focus:-top-6 peer-focus:text-sm peer-focus:text-indigo-600"
              >
                Password
              </label>
              <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400 
                transition-colors duration-300 group-focus-within:text-indigo-500" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                className="absolute right-3 top-3.5 text-gray-400 
                  hover:text-indigo-500 transition-colors duration-300"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Remember Me and Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2 cursor-pointer group">
              <div className="relative">
                <input
                  type="checkbox"
                  disabled={isLoading}
                  className="peer sr-only"
                />
                <div className="h-4 w-4 border-2 border-gray-300 rounded 
                  transition-all duration-300 peer-checked:bg-indigo-500 
                  peer-checked:border-indigo-500 peer-disabled:opacity-50" />
                <div className="absolute inset-0 flex items-center justify-center 
                  text-white scale-0 peer-checked:scale-100 transition-transform duration-300">
                  <svg className="h-3 w-3" fill="none" strokeLinecap="round" 
                    strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" 
                    stroke="currentColor">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <span className="text-sm text-gray-600 group-hover:text-gray-800 
                transition-colors duration-300">
                Remember me
              </span>
            </label>

            <a href="#" className="text-sm font-medium text-indigo-600 
              hover:text-purple-600 transition-colors duration-300">
              Forgot password?
            </a>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`relative w-full py-3 px-4 border border-transparent rounded-lg
              text-sm font-medium text-[black] overflow-hidden transition-all duration-300
              disabled:opacity-50 disabled:cursor-not-allowed transform
              ${isSuccess 
                ? 'bg-green-500 hover:bg-green-600' 
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
              } hover:scale-[1.02] active:scale-[0.98]`}
          >
            <div className="relative flex items-center justify-center">
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : isSuccess ? (
                'Success!'
              ) : (
                'Sign in'
              )}
            </div>
            
          </button>
        </form>
      </div>
    </div>
  );
};

// Animation keyframes remain the same
const styles = `
@keyframes gradient-shift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

@keyframes success-wave {
  0% { transform: translateX(-100%) skewX(-15deg); }
  50%, 100% { transform: translateX(100%) skewX(-15deg); }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-8px); }
  75% { transform: translateX(8px); }
}

.animate-gradient-shift {
  background-size: 400% 400%;
  animation: gradient-shift 15s ease infinite;
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

.animate-success-wave {
  animation: success-wave 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.animate-shake {
  animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
}
`;

export default AdminLogin;