import React, { useEffect, useState } from "react";
import Banner from "../../../components/user/Banner/Banner";
import BannerBottom from "../../../components/user/Banner/BannerBottom";
import BestSellers from "../../../components/user/home/BestSellers/BestSellers";
import NewArrivals from "../../../components/user/home/NewArrivals/NewArrivals";
import Sale from "../../../components/user/home/Sale/Sale";
import SpecialOffers from "../../../components/user/home/SpecialOffers/SpecialOffers";
import YearProduct from "../../../components/user/home/YearProduct/YearProduct";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../../redux/slices/userSlice";
import VerificationWarning from "../../../assets/elements/VerificationWarning";
import {GoogleAuth} from '../../../components/user/GoogleAuth/GoogleAuth'
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { userAxiosInstance } from "../../../redux/constants/AxiosInstance";

const Home = () => {

  const [isUser, setIsUser] = useState();
  const [warning, setWarning] = useState();
  const user = useSelector(state => state.userReducer.user);
  const dispatch = useDispatch()
  const navigate = useNavigate()
  useEffect(()=>{
    if(user && !user.token){
      setWarning(true)
    }
    let notUser = !user?.token
    if(!user?.token) return GoogleAuth(dispatch);

    setIsUser(user)
    console.log('working')
    if(user && !user?.status){
      
      dispatch(logoutUser())
      return navigate('/blocked')

    } 
    notUser && toast.success('user logined successfull')
    
  },[dispatch, user])
  console.log(isUser)

  useEffect(()=>{
    console.log(user)
    if(!warning && !user?.token){
      dispatch(logoutUser())
    }
  },[warning, dispatch, user])

  useEffect(()=>{
    if(!isUser) return 
    let user = userAxiosInstance.get('/protected',{
      headers:{
        Authorization: `Barear ${isUser.token}`
      }
    })
  },[isUser])
  
  return (
    <div className="w-full mx-auto">
      {warning && <VerificationWarning setWarning={setWarning}/>}
      <Banner />
      <BannerBottom user={user}/>
      <div className="max-w-container mx-auto px-4">
        <Sale />
        <NewArrivals />
        <BestSellers />
        <YearProduct />
        <SpecialOffers />
      </div>
    </div>
  );
};

export default Home;
