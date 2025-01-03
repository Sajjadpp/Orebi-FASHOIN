import toast from "react-hot-toast";
import { userAxiosInstance } from "../../redux/constants/AxiosInstance"

export const fetchData = async(path,dataObj) =>{

    try{
        let response = await userAxiosInstance.get(`/${path}`, {
            params: dataObj
        })
        console.log(response.data,"response")
        return response.data
    }
    catch(error){
        console.log(error);
        toast.error(error.response.data)
    }
}