import AddUser from "@/components/users/AddUser";
import Card from "@/components/core/Card";
import prisma from "@/lib/prisma";
import {cookies} from "next/headers";
import {validateSessionToken} from "@/auth/session";
import {redirect} from "next/navigation";



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
            <div className=" ml-5 mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
                {loans.map((loan, index) => (
                    <Card key={loan.id} loan={loan} name={"Loan #" + (index + 1)} start={loan.startDate.toLocaleDateString()} last={loan.endDate.toLocaleDateString()} />
                ))}
            </div>
        </div>
    )
}