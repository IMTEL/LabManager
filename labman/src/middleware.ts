import {NextRequest} from "next/server";
import {NextResponse} from "next/server";
import {cookies} from "next/headers";
// import {validateSessionToken} from "@/auth/session";

export async function middleware(req: NextRequest) {

    const token = (await cookies()).get("session")?.value;

    if (!token) {
        return Response.redirect(new URL("/login", req.url));
    }

   /* const session = await validateSessionToken(token);

    if (!session) {
        const res = NextResponse.redirect(new URL("/", req.url));
        res.cookies.set("session", "", { maxAge: 0});
        return res;
    } */

    return NextResponse.next();
}

export const config = {matcher: ["/", "/users"]};