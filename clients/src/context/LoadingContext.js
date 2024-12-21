import { createContext, useState } from "react";


const LoadingContext = createContext();

const LoadingProvider = ({children})=>{

    const [isLoading, setIsLoading] = useState(false);

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