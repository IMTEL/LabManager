import { createSession } from "@/auth/session";
import { cookies } from "next/headers";
import {NextResponse} from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    const { username, password } = await req.json();

    const user = await prisma.user.findUnique({where: { username }});
    if (!user) return Response.json({ error: "Invalid credentials"}, { status: 401 } )
    if (user.password !== password) return Response.json({ error: "Invalid credentials"}, { status: 401 } )

    const session = await createSession(user.id);

    (await cookies()).set("session", session.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24,
        path: "/"
    });

    return NextResponse.json({ success: true });

}