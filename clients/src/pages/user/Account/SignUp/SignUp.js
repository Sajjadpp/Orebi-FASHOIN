import React, { useEffect, useState } from 'react';
import { Lock, Mail, User } from 'lucide-react';
import Input from "../Input"
import validateForm, { isExist, validatePassword } from './validation';
import { useDispatch, useSelector } from 'react-redux';
import { SaveUser } from '../../../../redux/slices/userSlice';
import { useNavigate } from 'react-router-dom';
import PasswordStrengthIndicator from '../../../../components/user/Account/PasswordStrength';
import toast,{Toaster} from 'react-hot-toast'
import GoogleAuthButton from '../../../../components/user/GoogleAuth/GoogleButton';
// Input Component


export default function SignUpPage() {
  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [message, setMessage] = useState({
    email: null,
    password: null,
    name: null,
    cPassword: null,
    userExist: null,
    all: false,
  });
  const [passwordStrength, setPasswordStrength] = useState('');

  // Validation functions
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector(state=> state.userReducer.user)

  const getPasswordStrength = (password) => {
    const { validations } = validatePassword(password);
    const validCount = Object.values(validations).filter(Boolean).length;
    
    if (validCount <= 1) return "weak";
    if (validCount <= 3) return "medium";
    if (validCount <= 4) return "strong";
    return "very-strong";
  };

  useEffect(()=>{
    if(user){
      navigate("/")
    }
  },[user])

  // Real-time validation
  useEffect(() => {
    const errors = validateForm(formData);
    setMessage(errors);
    
    // Update password strength
    if (formData.password) {
      setPasswordStrength(getPasswordStrength(formData.password));
    }
  }, [formData]);

  const handleChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    const errors = await validateForm(formData);
    console.log(errors)
    if (errors.all && acceptTerms) {
      // Proceed with form submission
      console.log('Form submitted:', formData);
      
      dispatch(SaveUser({...formData, token: null}));
      
      navigate("/verify")
      // Add your API call here
    } else {
      setMessage(errors);
      console.log(errors.userExist)
      toast.error(errors.userExist)
    }
  };

  

  return (
    <div className="min-h-screen bg-[#f5f5f3] flex items-center justify-center p-4">
      

      <div className="max-w-md w-full space-y-8 bg-white p-8 shadow-lg">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">Create Account</h2>
          <p className="text-gray-600">{ message.userExist ?? "Join us today and get started"}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            id="fullName"
            label={message.name ?? "Full Name"}
            placeholder="Enter your full name"
            icon={User}
            value={formData.fullName}
            onChange={handleChange('fullName')}
            required
            color={message.name ? "red" : "black"}
          />

          <Input
            id="email"
            label={message.email ?? "Email Address"}
            type="email"
            placeholder="Enter your email"
            icon={Mail}
            value={formData.email}
            onChange={handleChange('email')}
            required
            color={message.email ? "red" : "black"}
          />

          <div className="space-y-2">
            <Input
              id="password"
              label={message.password ?? "Password"}
              placeholder="Create a password"
              icon={Lock}
              value={formData.password}
              onChange={handleChange('password')}
              required
              isPassword
              showPassword={showPassword}
              onTogglePassword={() => setShowPassword(!showPassword)}
              color={message.password ? "red" : "black"}
            />
            {formData.password && <PasswordStrengthIndicator passwordStrength={passwordStrength}/>}
          </div>

          <Input
            id="confirmPassword"
            label={message.cPassword ?? "Confirm Password"}
            placeholder="Confirm your password"
            icon={Lock}
            value={formData.confirmPassword}
            onChange={handleChange('confirmPassword')}
            required
            isPassword
            showPassword={showConfirmPassword}
            onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
            color={message.cPassword ? "red" : "black"}
          />

          <div className="flex items-start">
            <input
              id="terms"
              type="checkbox"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              className="h-4 w-4 mt-1 text-black focus:ring-black border-gray-300 rounded"
              required
            />
            <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
              I agree to the{' '}
              <button type="button" className="font-medium text-black hover:underline">
                Terms of Service
              </button>{' '}
              and{' '}
              <button type="button" className="font-medium text-black hover:underline">
                Privacy Policy
              </button>
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 focus:ring-2 focus:ring-offset-2 focus:ring-black transition-all duration-200 font-medium"
          >
            Create Account
          </button>
          <GoogleAuthButton/>
          <p className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <button onClick={()=> navigate('/signin')} type="button" className="font-medium text-black hover:underline">
              Sign in
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}