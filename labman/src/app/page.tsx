import prisma from '@/lib/prisma';
import "./globals.css";

export default async function Home() {
  return (
      <div className="mx-auto w-fit">
        <h1 className="mx-auto w-fit font-bold text-6xl my-8">VR Lab Management</h1>
        <div className="my-80">
          <h1 className="font-bold text-5xl mx-auto w-fit">Login</h1>
          <form className="flex flex-col gap-5 pt-4">
            <input type="text" name="username" placeholder="Username" className="bg-white rounded-md p-2 m-2 placeholder-black text-black" />
            <input type="password" name="password" placeholder="Password" className="bg-white rounded-md p-2 m-2 placeholder-black text-black" />
            <button type="submit" className="bg-blue-500 text-white rounded-md p-2 m-2">Login</button>
          </form>
        </div>

      </div>


  );
}
