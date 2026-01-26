"use client"
import {createContext, useState} from "react";

export const popupContext = createContext(null);

export const PopupProvider = ({children}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState("");

    return (
        <popupContext.Provider value={{isOpen, setIsOpen, message, setMessage}}>
            <>
                {children}
                <div className={`${isOpen ? "block" : "hidden"}`}>
                    <div className="bg-white rounded-md p-4 mx-auto mt-20 w-[300px]">
                        <h1 className="text-2xl text-black font-bold">{message}</h1>
                    </div>
                </div>
            </>
        </popupContext.Provider>
    )
}