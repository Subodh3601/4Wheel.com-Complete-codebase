import {createContext, useContext, useState } from "react";

export const clientContext = createContext();

export const ClientProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState({})
    const [profileMenu, setProfileMenu] = useState(false)
    
    return (
        <clientContext.Provider value={{isAuthenticated,setIsAuthenticated,user,setUser,profileMenu,setProfileMenu}}>
            {children}
        </clientContext.Provider>
    )
}

export const useClient = () => useContext(clientContext);