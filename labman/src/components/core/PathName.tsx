"use client"
import { usePathname } from "next/navigation";

export default function PathName() {
    let pathname = usePathname().split("/")[1];

    if (pathname == "") {
        pathname = "Inventory";
    } else {
        pathname = pathname.charAt(0).toUpperCase() + pathname.slice(1);
    }

    return(
        <h1 className="pl-4 pt-4 pb-2 font-bold text-5xl">{pathname}</h1>
    )
}