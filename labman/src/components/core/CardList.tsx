"use client"
import Card from "@/components/core/Card";
import {useState} from "react";
import {User} from "@/generated/prisma";
import {returnLoan, deleteLoan} from "@/lib/actions";

type Loans = {
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
    }
}[];

type Loan = Loans[0];

type Users = User[];

type Props = Loans | Users;

interface CardListProps {
    loansProp?: Loan[];
    usersProp?: User[];
}

const isLoan = (item: unknown): item is Loan => {
    return typeof item === "object" && item !== null && "borrower" in item;
};

const isUser = (item: unknown): item is User => {
    return typeof item === "object" && item !== null && "username" in item;
};


export default function CardList({ loansProp = [], usersProp = []}: CardListProps) {

    const [loans, setLoans] = useState<Loan[]>(loansProp);
    const [users, setUsers] = useState<User[]>(usersProp);

    const hasReturnedLoans = loans.some(
        (loan) => loan.status === "Returned"
    )

    async function handleReturnLoan(loanId: number) {
        const returnedLoan  = loans.find(loan => loan.id === loanId);

       if (!returnedLoan) return;

        const updatedLoan = {...returnedLoan, status: "Returned"};

        setLoans(prev =>
            prev.map(loan => {
                return loan.id === updatedLoan.id ? updatedLoan : loan;
            })
        );

        await returnLoan(loanId);

    }

    // TODO: In case a loan is added by mistake it should be possible to delete it but generally loans should not be deletable, due to importance for the historical record.
    //  For now it will just warn the user but there might be a more secure solution and other situations this also applies
    async function handleDeleteLoan (loanId: number) {
        const confirmation = window.confirm("Are you sure you want to permanently delete this loan? This should only be done if the loan was added by mistake.")
        if (!confirmation) return;
        setLoans(prev => prev.filter(loan => loan.id !== loanId));
        await deleteLoan(loanId)
    }

    return (
        <div className={"ml-5 mt-5"}>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {loans.map(loan => {
                    if (loan.status === "Returned") return;
                    return <Card loan={loan} returnLoan={handleReturnLoan} deleteLoan={handleDeleteLoan} key={loan.id} />;
                })}
                {users.map(user => {
                   return <Card user={user} key={user.id} />;
                })}
            </div>
            {hasReturnedLoans && (
                <div className={"mt-10"}>
                    <h1 className={"text-4xl font-bold"}>Returned loans:</h1>
                    <div className=" mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {loans.map((loan) => {
                            if (loan.status === "Returned") {
                                return (
                                    <Card loan={loan} key={loan.id} deleteLoan={handleDeleteLoan} />
                                )
                            }
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}