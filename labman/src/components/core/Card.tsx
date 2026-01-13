"use client"

import {User} from "@/generated/prisma";



type Loan = {
    id: number;
    startDate: Date;
    endDate: Date;
    status: string;

    borrower: {
        id: number;
        name: string;
        phone?: string | null;
        email?: string | null
        note?: string | null
        creationDate: Date;

    }
    item: {
        id: number;
        equipment: {
            id: number;
            name: string;
            categoryId: number;
            image: string;
            createdAt: Date;

        }
    };
}

interface CardProps {
    user?: User
    loan?: Loan;
    returnLoan?: (id: number) => void
    deleteLoan?: (id: number) => void
    deleteUser?: (id: number) => void
}

// TODO: Could have a button to reactivate a loan, not a priority right now

export default function Card({ loan, user, returnLoan, deleteLoan, deleteUser}: CardProps) {

    const name = loan?.item.equipment.name || user?.username;
    const start = loan?.startDate.toLocaleDateString("no") || new Date(user.createdAt).toLocaleDateString("no");
    const last = loan?.endDate.toLocaleDateString("no") || new  Date(user.latestActivity).toLocaleDateString("no");

    if (loan) {
        if (new Date(loan.endDate) < new Date() && loan.status === "Active") {
            loan.status = "Due";
        }
    }

    return(
        <div className="bg-brand-950 border-white border-[1px] rounded-[18px] w-fit">
            <div className="border-b-white border-b-[1px] flex gap-2 ">
                <h1 className="text-3xl font-bold pl-3 pt-2.5">{name}</h1>
                {loan && <span className={"mt-3 text-3xl"}>|</span>}
                {loan && <p title={loan.item.equipment.name} className="mt-4 text-2xl w-40 whitespace-nowrap overflow-hidden text-ellipsis">{loan.item?.equipment.name}</p>}
                {loan && <div className={"mt-4 mr-3 ml-auto rounded-md flex justify-center px-1 w-fit h-5 left-3" + (loan.status === "Returned" ? " bg-green-400" : loan.status === "Active" ? " bg-yellow-400" : " bg-red-600" )}>
                    <p className={"font-bold text text-black text-nowrap"}>{loan.status === "Returned" ? "Returned" : loan.status === "Active" ? "Active" : "Due" }</p>
                </div>}
            </div>

            {!loan && <div className="pl-3 pt-2.5 pb-2.5 w-fit">
                <h1 className="text-2xl">{"Created: " + start}</h1>
                <h1 className="text-2xl">{"Latest activity: " + last}</h1>
            </div>}

            {loan && <div className="grid grid-cols-2 grid-rows-2 gap-4">
                <div className="pl-3 pt-2.5 pb-2.5 w-fit">
                    <h1 className="text-2xl text-gray-300 font-bold">Equipment: </h1>
                    <p className="text-2xl">{loan.item.equipment.name}</p>
                </div>

                <div></div>

                <div className="pl-3 pt-2.5 pb-2.5 w-fit">
                    <div className="grid grid-cols-2 grid-rows-3 gap-2">
                        <h1 className="text-2xl text-gray-300 font-bold">Borrower: </h1>
                        <h1 className="text-2xl ml-10">{loan.borrower.name}</h1>
                        <h1 className="text-2xl text-gray-300 font-bold">Start: </h1>
                        <h1 className="text-2xl ml-10">{start}</h1>
                        <h1 className="text-2xl text-gray-300 font-bold">End: </h1>
                        <h1 className="text-2xl ml-10">{last}</h1>
                    </div>
                </div>
            </div>}

            <div className="mb-3 ml-4 mt-5 flex gap-2">
                <button className="button bg-blue-600">Edit</button>
                <button onClick={() => deleteLoan && loan ? deleteLoan(loan.id) : deleteUser(user.id)} className="button bg-red-600">Delete</button>
                { loan && loan.status != "Returned" && <button onClick={() => returnLoan ? returnLoan(loan.id) : alert("Error")} className="button bg-green-500 ml-auto mr-3">Return</button>}
            </div>

        </div>
    )
}