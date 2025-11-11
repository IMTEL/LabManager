"use server"
import prisma from "@/lib/prisma"
import {revalidatePath} from "next/cache";
import {deleteSession, validateSessionToken} from "@/auth/session"
import {cookies} from "next/headers";

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

export async function getSession() {
    const token = (await cookies()).get("session")?.value;

    if (token) {
        return validateSessionToken(token);
    } else {
        console.log("No active session");
        return null;
    }
}

export async function logout() {
    console.log("Logging out");
    const session = await getSession();
    if (session) {
        await deleteSession(session.id);
    }
}

export async function deleteEquipment(name: string) {
    await prisma.equipment.delete({
        where: {
            name: name
        }
    })
    revalidatePath("/");
}

export async function deleteUnit(id: number) {
    await prisma.item.delete({
        where: {
            id: id
        }
    })
    revalidatePath("/");
}

export async function addUnit(equipmentName: string) {

    const equipment = await prisma.equipment.findUnique({
        where: {
            name: equipmentName
        }
    })

    if (!equipment) {alert("Equipment not found"); return}

    const newUnit = await prisma.item.create({
        data: {
            equipmentId: equipment.id,
            status: "Available",

        }

    })
    revalidatePath("/");
    console.log("Added unit");
    return newUnit;
}