import { createSlice } from "@reduxjs/toolkit"


let initialState = {
    isAuthenticated: false,
    token: null
}

export const adminSlice = createSlice({

    name: "admin",
    initialState,
    reducers:{

        SaveAdmin: ( state, action )=>{
        
            return { ...state, token: action.payload, isAuthenticated: true}
        },

        logoutAdmin:(state, action)=>{
            return {...state, admin: null, token: null}
        },
        

    },
})
export const {
    SaveAdmin,
    logoutAdmin
} = adminSlice.actions

export default adminSlice.reducer