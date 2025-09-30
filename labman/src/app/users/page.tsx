import AddUser from "@/components/users/AddUser";
import Card from "@/components/core/Card";
import prisma from "@/lib/prisma";
import {cookies} from "next/headers";
import {validateSessionToken} from "@/auth/session";
import {redirect} from "next/navigation";



export default async function Users() {
    const token = (await cookies()).get("session")?.value;
    const session = token ? await validateSessionToken(token) : null;

    if (!session) {
        redirect("/login");
    }
    const users = await prisma.user.findMany();
    console.log(users);
    console.log(users[0].latestActivity.toLocaleDateString());
    return(
        <div>
            <AddUser />
            {users.map((user) => (
                <Card key={user.id} type="Test" name={user.username} start={user.createdAt.toLocaleDateString()} latestActivity={user.latestActivity.toLocaleDateString()} />
            ))}

        </div>
    )
}