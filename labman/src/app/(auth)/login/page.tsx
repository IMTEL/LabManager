"use client"

import prisma from '@/lib/prisma';
import "../../(main)/globals.css";
import { useState } from "react";
// TODO: A potential problem is that the website requires a user account to interact with it but it also requires an user to create an user in the first place
export default function Home() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const version = process.env.NEXT_PUBLIC_VERSION;
  const env = process.env.NEXT_PUBLIC_ENV;

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
      <>
          <div className="mx-auto w-fit">
            <h1 className="mx-auto w-fit font-bold text-6xl my-8">VR Lab Management</h1>
            <div className="my-80">
              <h1 className="font-bold text-5xl mx-auto w-fit">Login</h1>
              <form onSubmit={handleSubmit} className="flex flex-col gap-5 pt-4">
                <input value={username} onChange={(e) => setUsername(e.target.value)} type="text" name="username" placeholder="Username" className="bg-white rounded-md p-2 m-2 placeholder-black text-black" />
                <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" name="password" placeholder="Password" className="bg-white rounded-md p-2 m-2 placeholder-black text-black" />
                <button type="submit" className="bg-green-500 text-black rounded-md p-2 m-2 font-bold">LOGIN</button>
              </form>
            </div>
          </div>
          <p className={"text-gray-300 text-2xl mb-3 ml-3 fixed bottom-0"}>{version}-{env}</p>
      </>




  );
}
