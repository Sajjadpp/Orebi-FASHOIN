import { createSlice } from "@reduxjs/toolkit";
import { loginUser } from "../thunk/loginThunk";

const initialState = {
    loading: false,
    user: null,
    token: null,
    role: "user"
}


export const userSlice = createSlice({

    name: "user",
    initialState,
    reducers:{

        SaveUser: ( state, action )=>{
        
            return { ...state, user: action.payload}
        },

        logoutUser:(state, action)=>{
            return {...state, user: null, token: null}
        },
        updateUser:(state, action) =>{
            return {...state, user:{...state.user, ...action.payload}}
        }

    },
    extraReducers:(builder)=>{
        builder
        .addCase(loginUser.pending,(state)=>{
            state.status = "loading";
            state.loading = true
            state.error = null;
        })
        .addCase(loginUser.fulfilled, (state, action)=>{
            
            return {...state, status: "succeeded", loading: false, user:action.payload}
        })
        .addCase(loginUser.rejected, (state, action)=>{

            return {...state, status: "failure", loading: false, error: action.payload}
        })

    }
}) 

export const {
    SaveUser,
    logoutUser,
    updateUser
} = userSlice.actions

export default userSlice.reducer