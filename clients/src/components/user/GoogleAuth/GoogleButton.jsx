import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { GOOGLE_CLIENT } from '../../../constants/Constants';
import { userAxiosInstance } from '../../../redux/constants/AxiosInstance';
import { SaveUser } from '../../../redux/slices/userSlice';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';


function GoogleAuthButton() {
    const dispatch = useDispatch()
    const navigate = useNavigate()

  const handleLogin = async(gResponse) => {
    // Handle login response here
    console.log('Google Login Success:', gResponse);
    // You can now send the response to your backend to verify the token
    try{
      const response = await userAxiosInstance.post(
        "/verifyGoogleUser",
        {token: gResponse.credential}
      )
      
      console.log(response);
      if(response.status === 200){
                  
        let user = dispatch(SaveUser(response.data.user))
        console.log(user,"working user")
        toast.success('logined successfully')
        navigate("/")
      }
      else{
        toast.error(response.data.message)
      }
    }
    catch(error){
      console.log(error)
      toast.error(error?.response?.data?.message || error.message)
    }
    
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT} >
      <div className="flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg shadow-lg  ">
          <GoogleLogin
            onSuccess={handleLogin}
            onError={() => console.log('Login Failed')}
            useOneTap
            render={(renderProps) => (
              <button
                onClick={renderProps.onClick}
                disabled={renderProps.disabled}
                className="w-full bg-blue-500 text-white font-bold py-3 px-4 rounded-md flex items-center justify-center space-x-3 hover:bg-blue-600 focus:outline-none"
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
                  alt="Google Logo"
                  className="w-6 h-6"
                />
                <span>Continue with Google</span>
              </button>
            )}
          />
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}

export default GoogleAuthButton;
