"use client"
import PathName from "@/components/core/PathName";

import {logout} from "@/lib/actions/userActions";

export default function NavBar({ username }: { username: string | null }) {
    async function logoutButton(){
        await logout();

    }

    return(
        <div className="flex justify-between items-center border-b-white border-b-[1px] mb-5">
            < PathName />
            <div className="flex items-center">
                <div className="mr-8 pt-4">
                    <button className={"button bg-red-600"} onClick={logoutButton}>Logout</button>
                </div>
                <p className="pr-4 pt-7 font-bold text-2xl">{username || "Not logged in"}</p>
            </div>
        </div>
    )
}