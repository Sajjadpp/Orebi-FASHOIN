/* global google*/

import { GOOGLE_CLIENT } from "../../../constants/Constants";
import { userAxiosInstance } from "../../../redux/constants/AxiosInstance";
import { SaveUser } from "../../../redux/slices/userSlice";
import toast from "react-hot-toast";






  
export const GoogleAuth = (dispatch) => {

    const OnSignedIn = async(response) => {
        
        try{
            let responses = await userAxiosInstance.post(
                "/verifyGoogleUser",
                {token:response.credential}
            );
            
            if(responses.status === 200){
                
                let user = dispatch(SaveUser(responses.data.user))
                console.log(user,"working user")
            //  
                toast.success('logined successfully')
            }
            else{

                toast.error(response.data.message || 'login failed')
            }
        }
        catch(error){
            console.log(error,"error")
            toast.error(error.response.data.message ?? "server error")
        }
    
    
    };

    try{
      google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT,
        callback: OnSignedIn,
      });
    
      google.accounts.id.prompt((notification) => {
        console.log("Prompt notification: ", notification);
    
        if (notification.isNotDisplayed()) {
          console.log("Not displayed reason: ", notification.getNotDisplayedReason());
        } else if (notification.isSkippedMoment()) {
          console.log("Skipped reason: ", notification.getSkippedReason());
        } else if (notification.isDismissedMoment()) {
          console.log("Dismissed reason: ", notification.getDismissedReason());
        } else {
          console.log("One Tap displayed successfully!");
        }
      });
    }
    catch(error){
      console.log(error)
    }
};
  