import prisma from "@/lib/prisma";
import {cookies} from "next/headers";
import {validateSessionToken} from "@/auth/session";
import {redirect} from "next/navigation";
import CardList from "@/components/core/CardList";



export default async function Loans() {
    const token = (await cookies()).get("session")?.value;
    const session = token ? await validateSessionToken(token) : null;

    if (!session) {
        redirect("/login");
    }
    const loans = await prisma.loan.findMany({
        include: {
            item: {
                include: {
                    equipment: true
                }
            },
            borrower: true
        }
    });


    return(
        <div>
            <CardList loansProp={loans} />
        </div>
    )
}