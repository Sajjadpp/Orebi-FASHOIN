import { createContext, useState } from "react";


const SidebarContext = createContext();

const SidebarContextProvider = ({children})=>{

    const [isToogle, setIsToogle] = useState(true);

    const updateToogle =() =>{
        setIsToogle(!isToogle);
    }

    return(
        <SidebarContext.Provider value={{isToogle, updateToogle}}>
            {children}
        </SidebarContext.Provider>
    )
    
}

export { SidebarContext, SidebarContextProvider}