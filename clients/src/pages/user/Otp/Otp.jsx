import React, { useContext, useEffect, useState } from 'react';
import OTPVerificationContainer from '../../../components/user/Otp/OtpContainer';
import { userAxiosInstance } from '../../../redux/constants/AxiosInstance';
import { useSelector } from 'react-redux';
import Header from '../../../components/user/home/Header/Header';
import Footer from '../../../components/user/home/Footer/Footer';
import { LoadingContext } from '../../../context/LoadingContext';
import { useNavigate } from 'react-router-dom';

function Otp() {
  const userdata = useSelector((state) => state.userReducer.user);
  console.log(userdata,"wokring")
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // For handling errors

  const navigate = useNavigate()

  useEffect(() => {
    if(userdata && userdata.token) return navigate('/')
    const fetchOtp = async () => {
      setLoading(true)
      try {
        const response = await userAxiosInstance.post('/generateOtp', userdata);
        console.log(response);

        if (response.status !== 200) {
          setError('Failed to generate OTP');
          setLoading(false);
          return;
        }

        setLoading(false);
      } catch (err) {
        setError('Something went wrong');
        setLoading(false);
        console.error(err);
      }
    };

    fetchOtp();
  }, [userdata]); // Adding userdata as dependency in case it changes

  return (
    <div className="h-lvh flex flex-col align-center">
      <Header />
      {loading ? (
        <p>Loading...</p> // Display text instead of just 'loading'
      ) : error ? (
        <p>{error}</p> // Show error message if any
      ) : (
        <OTPVerificationContainer expiryTime={60} length={4} />
      )}
      <Footer />
    </div>
  );
}

export default Otp;
