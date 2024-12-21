import { createAsyncThunk } from "@reduxjs/toolkit";
import { userAxiosInstance } from "../constants/AxiosInstance";

export const loginUser = createAsyncThunk('auth/loginUser',async(credential, {rejectWithValue})=>{

    try{
        const response = await userAxiosInstance.post("/verifyUser",credential)
        let {data} = response;
        if(response.status !== 200) return rejectWithValue(data.data) 
        
        return data.user
    }
    catch(err){
        return rejectWithValue(err.response.data ?? err.message)
        
    }
})