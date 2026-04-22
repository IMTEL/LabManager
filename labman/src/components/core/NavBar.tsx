"use client"
import PathName from "@/components/core/PathName";

import {logout} from "@/lib/actions/userActions";
import {useState} from "react";
import ChatMenu from "@/components/ai/ChatMenu";

export default function NavBar({ username }: { username: string | null }) {
    const [isOpen, setIsOpen] = useState(false);

    async function logoutButton(){
        await logout();
    }

    return(
        <>
            {isOpen && <ChatMenu setIsOpen={setIsOpen} />}
            <div className="flex justify-between items-center border-b-white border-b-[1px] mb-5">
                < PathName />
                <div className="flex items-center">
                    <div className="mr-8 pt-4">
                        <button className={"button bg-green-600 mr-2"} onClick={() => setIsOpen(true)}>AI</button>
                        <button className={"button bg-red-600"} onClick={logoutButton}>Logout</button>
                    </div>
                    <p className="pr-4 pt-7 font-bold text-2xl">{username || "Not logged in"}</p>
                </div>
            </div>
        </>

    )
}