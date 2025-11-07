import { createSession } from "@/auth/session";
import { cookies } from "next/headers";
import {NextResponse} from "next/server";
import prisma from "@/lib/prisma";
import comparePassword from "@/lib/auth/comparePassword";

export async function POST(req: Request) {
    const { username, password } = await req.json();

    const user = await prisma.user.findUnique({where: { username }});
    // Check if the user exists
    if (!user) return Response.json({ error: "Invalid credentials"}, { status: 401 } )
    if (!( await comparePassword(password, user.hashedPassword))) return Response.json({ error: "Invalid credentials"}, { status: 401 } )

    // Create a session for the user
    const session = await createSession(user.id);
    // Set the session cookie
    (await cookies()).set("session", session.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24,
        path: "/"
    });

    return NextResponse.json({ success: true });

}