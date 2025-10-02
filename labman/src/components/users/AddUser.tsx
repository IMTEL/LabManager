"use client"
import { useState } from "react";
import {useRouter} from "next/navigation";

export default function AddUser() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const res = await fetch("/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username,
                password
            })
        });

        if (res.ok) {
            setUsername("");
            setPassword("");
            router.refresh();
        } else {
            alert("Failed to create user");
        }
    }
    return(
        <div>
            <form onSubmit={handleSubmit}>
                <input value={username} onChange={(e) => setUsername(e.target.value)} type="text" name="username" placeholder="Username" className="bg-white rounded-md p-2 m-2 placeholder-black text-black" />
                <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" name="password" placeholder="Password" className="bg-white rounded-md p-2 m-2 placeholder-black text-black" />
                <button type="submit">Add User</button>

            </form>
        </div>
    )

}