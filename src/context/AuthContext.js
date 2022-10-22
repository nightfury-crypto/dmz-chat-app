import { useEffect, useState, createContext } from "react";
import { auth } from "../firebase/FirebaseSetup.js";
import { onAuthStateChanged } from "firebase/auth";

export const AuthContext = createContext();

export const AuthContextProvider = ({children}) => {
    const [currentUser, setCurrentUser] = useState({})

    useEffect(() => {
        const unSub = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
        });

        return () => {
            unSub()
          } 
    }, [])

    return (
        <AuthContext.Provider value={{currentUser}}>
            {children}
        </AuthContext.Provider>
    )
}
