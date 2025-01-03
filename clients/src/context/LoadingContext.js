import { createContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";


const LoadingContext = createContext();

const LoadingProvider = ({children})=>{

    const [isLoading, setIsLoading] = useState(false);
    let navigate = useNavigate()
    let user = useSelector(state => state.userReducer.user)

    useEffect(()=>{
        console.log(user)
        if(user && !user.status){
        navigate('/blocked')
        }
    })
    const updateLoading =() =>{
        setIsLoading(!isLoading);
    }

    
    return(
        <LoadingContext.Provider value={{isLoading, updateLoading}}>
            {children}
        </LoadingContext.Provider>
    )
    
}

export { LoadingContext, LoadingProvider}