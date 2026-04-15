"use server"
import {deleteSession, validateSessionToken} from "@/auth/session";
import {redirect} from "next/navigation";
import {cookies} from "next/headers";
import prisma from "@/lib/prisma";
import {revalidatePath} from "next/cache";

type ActionResult<T> = | { type: "success"; data: T} | { type: "confirm"; message: string} | { type: "error"; message: string}


export async function deleteUser(userId: number): Promise<ActionResult<void>> {

    if (await getUser() === null) {
        return {type: "error", message: "Could not find a valid user"}
    }

    // if (userId === 1) {return {type: "error", message: "Cannot delete admin user"}}

    const user = await prisma.user.findUnique({
        where: {id: userId},
        include: {sessions: true}
    })

    if (user) {
        for (const session of user.sessions) {
            await deleteSession(session.id);
        }
    }

    await prisma.user.delete({
        where: {id: userId}
    });

    revalidatePath("/users");
    return {type: "success", data: undefined};
}

export async function getSession() {
    const token = (await cookies()).get("session")?.value;

    if (token) {
        return validateSessionToken(token);
    } else {
        return null;
    }
}

export async function logout() {
    const session = await getSession();
    if (session) {
        await deleteSession(session.id);
    }
    redirect("/login")
}

export async function getUser() {
    const session = await getSession();

    if (session) {
        const tSession = await prisma.session.findUnique({
            where: {id: session.id},
            include: {user: true}
        })
        return tSession?.user;
    } else {
        return null;
    }

}