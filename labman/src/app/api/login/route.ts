import { createSession } from "@/auth/session";
import { cookies } from "next/headers";
import {NextResponse} from "next/server";

export async function POST(req: Request) {
    const { username, password } = await req.json();
    const session = await createSession();

    (await cookies()).set("session", session.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24,
        path: "/"
    });

    return NextResponse.json({ success: true });

}