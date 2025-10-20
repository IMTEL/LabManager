"use client"

import prisma from '@/lib/prisma';
import "../../(main)/globals.css";
import { useState } from "react";

export default function Home() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: React.FormEvent) {
      e.preventDefault();
      const res = await fetch("/api/login", {
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
          window.location.href = "/";
      } else {
          alert("Invalid username or password");
      }


  }
  return (
      <div className="mx-auto w-fit">
        <h1 className="mx-auto w-fit font-bold text-6xl my-8">VR Lab Management</h1>
        <div className="my-80">
          <h1 className="font-bold text-5xl mx-auto w-fit">Login</h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5 pt-4">
            <input value={username} onChange={(e) => setUsername(e.target.value)} type="text" name="username" placeholder="Username" className="bg-white rounded-md p-2 m-2 placeholder-black text-black" />
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" name="password" placeholder="Password" className="bg-white rounded-md p-2 m-2 placeholder-black text-black" />
            <button type="submit" className="bg-green-500 text-black rounded-md p-2 m-2">Login</button>
          </form>
        </div>

      </div>


  );
}
