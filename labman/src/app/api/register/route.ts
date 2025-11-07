import prisma from "@/lib/prisma";
import hashPassword from "@/lib/auth/hashPassword";
import {NextResponse} from "next/server";

export async function POST(req: Request) {
    const { username, password } = await req.json();

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) {
        return new Response(JSON.stringify({ error: "User already exists" }), { status: 400 });
    } else {
        console.log("User does not exist");
    }
    // Create the user
    await prisma.user.create({
        data: {
            username,
            hashedPassword
        }
    });

    return NextResponse.json({ success: true });
}