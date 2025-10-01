"use client"
import { deleteUser } from "@/lib/actions";

interface ButtonProps {
    username?: string;
}

export default function Button({ username }: ButtonProps) {

    async function deletion(){
        console.log("Button clicked");
        if (username) {
            await deleteUser(username)
        }
    }
    

    return (
        <button onClick={deletion} className="bg-red-600 flex justify-center w-fit px-2 py-0.5 rounded-md">
            <p className="text-[1.3rem] text-black font-bold">Delete</p>
        </button>
    )
}