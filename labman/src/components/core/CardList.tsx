"use client"
import Card from "@/components/core/Card";
import {useState} from "react";
import {User} from "@/generated/prisma";
import {returnLoan, deleteLoan, deleteUser} from "@/lib/actions";


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

interface CardListProps {
    loansProp?: Loan[];
    usersProp?: User[];
}


export default function CardList({ loansProp = [], usersProp = []}: CardListProps) {

    const [loans, setLoans] = useState<Loan[]>(loansProp);
    const [users, setUsers] = useState<User[]>(usersProp);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const res = await fetch("/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username,
                password
            })
        });

        const newUser : User = await res.json();

        if (newUser) {
            console.log(newUser)
            setUsername("");
            setPassword("");
            setUsers(prev => [...prev, newUser]);


        } else {
            alert("Failed to create user");
        }
    }

   async function handleDeleteUser(userId: number) {
        if (window.confirm("Are you sure you want to delete this user?")) {
            setUsers(prev => prev.filter(user => user.id !== userId));
            await deleteUser(userId);
        }
   }


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
    console.log(users)

    return (
        <div className={"ml-5 mt-5"}>
            { users.length !== 0 && <div className={"mb-15"}>
                <form onSubmit={handleSubmit}>
                    <input value={username} onChange={(e) => setUsername(e.target.value)} type="text" name="username" placeholder="Username" className="bg-white rounded-md p-2 m-2 placeholder-black text-black" />
                    <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" name="password" placeholder="Password" className="bg-white rounded-md p-2 m-2 placeholder-black text-black" />
                    <button type="submit">Add User</button>

                </form>
            </div>}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {loans.map(loan => {
                    if (loan.status === "Returned") return;
                    return <Card loan={loan} returnLoan={handleReturnLoan} deleteLoan={handleDeleteLoan} key={loan.id} />;
                })}
                {users.map(user => {
                   return <Card user={user} key={user.id} deleteUser={handleDeleteUser} />;
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