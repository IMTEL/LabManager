import { createSession } from "@/auth/session";
import { cookies } from "next/headers";
import {NextResponse} from "next/server";
import prisma from "@/lib/prisma";
import comparePassword from "@/lib/auth/comparePassword";

export async function POST(req: Request) {
    const { username, password } = await req.json();

    const users = await prisma.user.findMany();
    // TODO: Temporary initial user creation. Will create a proper init of the system later
    if (users.length === 0) {
        console.log("No existing users, creating new user")
        const res = await fetch("http://localhost:3000/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username,
                password
            })
        })

    }

    const user = await prisma.user.findUnique({where: { username }});
    console.log(user);
    // Check if the user exists
    if (!user) return Response.json({ error: "Username not found"}, { status: 401 } )
    if (!( await comparePassword(password, user.hashedPassword))) return Response.json({ error: "Invalid password"}, { status: 401 } )

    // Create a session for the user
    const session = await createSession(user.id);
    // Set the session cookie
    (await cookies()).set("session", session.token, {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24,
        path: "/"
    });

    return NextResponse.json({ success: true });

}