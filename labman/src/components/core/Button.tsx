"use client"
import { deleteUser, logout } from "@/lib/actions";
import {redirect} from "next/navigation";

interface ButtonProps {
    type?: string;
    username?: string;
}

export default function Button({ username, type }: ButtonProps) {

    async function deletion(){
        if (username) {
            if (type == "deleteUser") {
                await deleteUser(username)
            }

        } else if (type == "logout") {
            await logout()
            redirect("/login");
        }
    }
    
    if (type == "deleteUser") {
        return (
            <button onClick={deletion} className="bg-red-600 flex justify-center w-fit px-2 py-0.5 rounded-md">
                <p className="text-[1.3rem] text-black font-bold">Delete</p>
            </button>
        )
    } else if (type == "logout") {
        return (
            <button onClick={deletion} className="bg-red-600 flex justify-center w-fit px-2 py-0.5 rounded-md">
                <p className="text-[1.3rem] pb-0 text-black font-bold">Logout</p>
            </button>
        )
    }

}