"use client"
import {usePathname} from "next/navigation";
import Link from "next/link";

export default function SideBar() {

    const pages = [
        { name: "Inventory", path: "/" },
        { name: "Users", path: "/users" },
    ];

    const currentPath = usePathname();

    console.log(currentPath);

    return(
        <div className="bg-brand-950 h-screen">
            <div className="border-b-white border-b-[1px]">
                <h1 className="text-3xl font-bold pt-4 pl-2 pb-5">VR Lab Management</h1>
            </div>

            <div className="text-2xl pl-2 pt-4">
                {pages.map(({ name, path }) => (
                    <Link
                        key={name}
                        href={path}
                        className={`block text-3xl ${path == currentPath ? "font-bold text-green-500" : ""}`}
                    >
                        {name}
                    </Link>
                ))}
            </div>
        </div>
    )
}