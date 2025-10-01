"use server"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache";
import { deleteSession } from "@/auth/session"

export async function deleteUser(username : string) {
    console.log("Delete user", username);

    const user = await prisma.user.findUnique({
        where: {
            username: username
        },
        include: {
            sessions: true
        }
    })


    if (user) {
        console.log(user.sessions)
        for (const session of user.sessions) {
            await deleteSession(session.id);
        }
    }

    await prisma.user.delete({
        where: {
            username: username
        }
    });

    revalidatePath("/users");
}