import AddUser from "@/components/users/AddUser";
import prisma from "@/lib/prisma";
import {cookies} from "next/headers";
import {validateSessionToken} from "@/auth/session";
import {redirect} from "next/navigation";
import CardList from "@/components/core/CardList";



export default async function Users() {
    const token = (await cookies()).get("session")?.value;
    const session = token ? await validateSessionToken(token) : null;

    if (!session) {
        redirect("/login");
    }
    const users = await prisma.user.findMany();
    return(
        <div>
            <CardList usersProp={users} />
        </div>
    )
}