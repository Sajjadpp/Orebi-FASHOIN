import axios from "axios"

import { logoutUser, updateUser } from "../slices/userSlice";
import { store } from "../store";
import { logoutAdmin } from "../slices/adminSlice";


const baseurl = 'https://api.orebi.shop'



let userAxiosInstance = axios.create({

    baseURL:`${baseurl}/api/user`,
    withCredentials: true
})

let adminAxiosInstance = axios.create({
    baseURL: `${baseurl}/api/admin`,
    withCredentials: true
})
let AuthAxiosInstance = axios.create({
    baseURL: `${baseurl}/api/auth`,
    withCredentials: true
})


userAxiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        console.log(error,"my error")
        console.log(error.response.status)
        if (error.response && error.response.status === 403) {
            if (error.response.data.message === 'Token invalid or expired') {
                
                return store.dispatch(logoutUser()) 
            }
            console.error('You are blocked!');
            store.dispatch(updateUser({status:false}))
        }
      return Promise.reject(error);
    }
);

userAxiosInstance.interceptors.request.use(
    (config) => {

      const token = store.getState().userReducer?.user?.token
      console.log(token,"token")
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) =>{
        console.log(error,"error")
        return Promise.reject(error)
    } 
);
  
adminAxiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      console.log(error)
      if(error.response && error.response.status === 403) {
        if (error.response.data.message === 'Token invalid or expired') {
          
          
          return store.dispatch(logoutAdmin()) 
          
        }
        return 
      }
      return Promise.reject(error);
    }
);

adminAxiosInstance.interceptors.request.use(
    (config) => {

      const token = store.getState().adminReducer.token
      console.log(token,"token")
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) =>{
        console.log(error,"error")
        return Promise.reject(error)
    } 
);
  

export { userAxiosInstance, adminAxiosInstance , AuthAxiosInstance}
