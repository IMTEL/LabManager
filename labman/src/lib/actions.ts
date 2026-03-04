"use server"
import prisma from "@/lib/prisma"
import {revalidatePath} from "next/cache";
import {deleteSession, validateSessionToken} from "@/auth/session"
import {cookies} from "next/headers";
import {Borrower} from "@/generated/prisma";
import {Loan} from "@/types/Loan";

type ActionResult<T> = | { type: "success"; data: T} | { type: "confirm"; message: string} | { type: "error"; message: string}

export async function deleteUser(userId : number) {

    const user = await prisma.user.findUnique({
        where: {
            id: userId
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
            id: userId
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
        },
        // TODO: Relational properties always have to be specified or else they will not be included in the response
        include: {
            loans: true,
            activeLoan: true
        }

    })
    revalidatePath("/");
    console.log("Added unit");
    return newUnit;
}

export async function updateEquipment (equipmentId: number, name: string, category: string, image: string) {

    let categoryId = 0;

    let equipmentCategory = await prisma.equipmentCategory.findUnique({where: {name: category}})

    if (equipmentCategory) {
        console.log("Category exists");
        categoryId = equipmentCategory.id
    } else {
        console.log("Category exists")
        equipmentCategory = await prisma.equipmentCategory.create({data: {name: category}})
        categoryId = equipmentCategory.id
    }

    const equipment = await prisma.equipment.update({
        where: {
            id: equipmentId,
        },
        data : {
            name: name,
            categoryId: categoryId,
            image: image
        },
        include: {category: true}
    })
    revalidatePath("/");
    return equipment;
}

export async function addBorrower(name: string, phone?: string | null, email?: string | null, borrowerId?: number) : Promise<ActionResult<Borrower>> {
    const user = await getUser();
    if (!user) {return {type: "error", message: "Could not find a valid user"}}
    let borrower : Borrower | null = null;


    // If phone or email is actually empty, set it to null
    if (phone?.trim() === "") {phone = null}
    if (email?.trim() === "") {email = null}

    // If borrowerId is provided, update the borrower with the provided information
    if (borrowerId) {
        borrower = await prisma.borrower.findUnique({where:{id: borrowerId}})
        /* TODO: Potentially unsafe. The function can in theory be called with an unrelated id updating the wrong borrower
            Since the unique values phone and mail can change they can't be used to verify the borrower.
            A possible solution is to compare the old values with what is currently stored in the database.
            But it shouldn't really be a big deal as there is now way for the client to abuse it.*/
        if (!borrower) {return {type: "error", message: "Could not find borrower with id " + borrowerId}}


        if (phone && borrower.phone !== phone) {
            console.log("Phone number has changed, checking for duplicates")
            if (await prisma.borrower.findUnique({where:{phone: phone}})) {
                console.log("Borrower with phone number already exists")

                return {type: "error", message: `A borrower with the same phone number already exists.`}
            }
        } else if (email && borrower.email !== email) {
            if (await prisma.borrower.findUnique({where:{email: email}}))
                return {type: "error", message: `A borrower with the same email already exists.`}
        }

        borrower = await prisma.borrower.update(
            {
                where: {id: borrowerId},
                data: {name: name, phone: phone, email: email}
            }
        )
        return {type: "success", data: borrower};
    }

    if (phone) {
        borrower = await prisma.borrower.findUnique({where:{phone: phone}})
        /* if (borrower && borrower.name !== borrowerName) {
            if  (window.confirm(`A borrower with the same phone number already exists with a different name (${borrower.name}). Click OK to assign this loan to ${borrowerName}. Click Cancel to assign it to ${borrower.name} instead.`)) {
                borrower = null;
            }
         } */

    } else if (email)  {
        borrower = await prisma.borrower.findUnique({where:{email: email}})
        /*if (borrower && borrower.name !== borrowerName) {
           if  (window.confirm(`A borrower with the same email already exists with a different name (${borrower.name}). Click OK to assign this loan to ${borrowerName}. Click Cancel to assign it to ${borrower.name} instead.`)) {
               borrower = null;
           }
        } */
    } else {
       return {type: "error", message: "No borrower phone/email provided"}
    }

    if (!borrower) {
        borrower = await prisma.borrower.create({
            data: {
                name: name,
                phone: phone,
                email: email,
                note: "",
                creationDate: new Date(),
            }
        })
    }
    return {type: "success", data: borrower};
}

export async function updateLoan (loanId: number, start : Date, end : Date, borrowerName : string, borrowerId : number, unitId : number, phone? : string | null, email? : string | null) : Promise<ActionResult<Loan>>  {
    if (await getUser() === null) {return {type:"error", message: "Could not find a valid user"}}

    // Check if the loan exists
    const currentLoan = await prisma.loan.findUnique({where: {id: loanId}})
    if (!currentLoan) {return {type: "error", message: "Could not find corresponding loan in database"}}

    // Find the connected borrower and update borrower details if needed
    const res = await addBorrower(borrowerName, phone, email, borrowerId)
    if (res.type !== "success") {return {type: "error", message: res.message}}

    // If the user has changed the unit being loaned, check that this is unit is available
    if (currentLoan.itemId !== unitId) {
        const newUnit = await prisma.item.findUnique({where: {id: unitId}})
        if (!newUnit) {return {type: "error", message: "Could not find corresponding unit in database"}}
        if (newUnit.status !== "Available") {return {type: "error", message: "The selected unit is not available"}}
    }

    const loan = await prisma.loan.update({
        where: {
            id: loanId
        },
        data: {
            startDate: start,
            endDate: end,
            borrowerId: res.data.id,
            itemId: unitId
        },
        include: {
            borrower: true,
            item: {
                include: {
                    equipment: {
                        include: {
                            category: true,
                            items: {
                                include: {
                                    loans: true,
                                    activeLoan: true
                                }
                            }

                        }
                    }
                }
            }
        }
    })
    revalidatePath("/loans");
    return {type: "success", data: loan};

}

export async function addLoan (borrowerName : string, start : string, end : string, unitId : number, phone : string | null, email : string | null) {
    const dateStart = new Date(start);
    const dateEnd = new Date(end);
    const user = await getUser();
    if (!user) {alert("Could not find a valid user"); return}

    const res = await addBorrower(borrowerName, phone, email)
    if (res.type !== "success") {return}

    const loan = await prisma.loan.create({
        data: {
            startDate: dateStart,
            endDate: dateEnd,
            status: "Active",
            borrowerId: res.data.id,
            userId: user.id,
            itemId: unitId
        }
    })

    await prisma.item.update({
        where: {
            id: unitId
        },
        data: {
            status: "Unavailable",
            activeLoanId: loan.id
        }
    })
    revalidatePath("/");
    return loan;
}

export async function getUser() {
    const session = await getSession();

    if (session) {
            const tSession = await prisma.session.findUnique({
                where: { id: session.id },
                include: {
                    user: true
                }
            })
            return tSession?.user;
    } else {
        return null;
    }

}

export async function deleteLoan(id: number) {
    await prisma.loan.delete({
        where: {
            id: id
        }
    })
    revalidatePath("/loans");
}

export async function returnLoan(id: number) {
    await prisma.loan.update({
        where: {
            id: id
        },
        data: {
            status: "Returned"
        }
    })
    revalidatePath("/loans");
}