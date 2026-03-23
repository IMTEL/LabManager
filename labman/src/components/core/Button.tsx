"use client"
import { logout } from "@/lib/actions";
import {redirect} from "next/navigation";

// TODO: Replcace with a html button

export default function Button() {

    async function deletion(){
        await logout()
        redirect("/login");
    }

    return (
        <button onClick={deletion} className="bg-red-600 flex justify-center w-fit px-2 py-0.5 rounded-md">
            <p className="text-[1.3rem] pb-0 text-black font-bold">Logout</p>
        </button>
        )
}