import {  createContext, useReducer } from "react";

export const StatusContext = createContext();

export const StatusContextProvider = ({ children }) => {

    const IINITIAL_STATE = {
        userID: "null",
        status: {}
    }

    const statusReducer = (state, action) => {
        switch (action.type) {
            case "CHANGE_STATUS":
                return {
                    status: action.payload,
                    userID: action.payload.uid
                };

            default:
                return state;
        }
    }

    const [state, dispatchStatus] = useReducer(statusReducer, IINITIAL_STATE);

    return (
        <StatusContext.Provider value={{ statusData: state, dispatchStatus }}>
            {children}
        </StatusContext.Provider>
    )
}
