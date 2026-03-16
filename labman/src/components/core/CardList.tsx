"use client"
import Card from "@/components/core/Card";
import {useState, useOptimistic, startTransition} from "react";
import {User} from "@/generated/prisma";
import {UserClass} from "@/types/User";
import {returnLoan, deleteLoan, deleteUser} from "@/lib/actions";
import {LoanClass} from "@/types/Loan";
import EditLoan from "@/components/loans/EditLoan";
import {useSideView} from "@/app/sideViewContext";
import {Loan} from "@/types/Loan";

interface CardListProps {
    loansProp?: Loan[];
    usersProp?: User[];
}


export default function CardList({ loansProp = [], usersProp = []}: CardListProps) {

    const [loans, setLoans] = useState<Loan[]>(loansProp);
    const [users, setUsers] = useState<User[]>(usersProp);
    const [optimisticUsers, removeUser] = useOptimistic(
        users,
        (currentUsers, idToRemove : number) =>
        currentUsers.map(user =>
        user.id === idToRemove ? { ...user, status: "deleting" } : user))
// TODO: Temporary use of password field until I add another alternative
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [selectedLoanId, setSelectedLoanId] = useState<number | null>(null);

    const { sideView, setSideView } = useSideView();


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
            setUsername("");
            setPassword("");
            setUsers(prev => [...prev, newUser]);


        } else {
            alert("Failed to create user");
        }
    }

    async function deleteAction(id: number) {
        const res = await deleteUser(id);
        if (res.type === "error") return alert(res.message);
        setUsers(prev => prev.filter(user => user.id !== id));
    }

   async function handleDeleteUser(userId: number) {
        if (window.confirm("Are you sure you want to delete this user?")) {
            // Optimistically remove the user from the UI
            startTransition(async () => {
                removeUser(userId)
                try {
                    await deleteAction(userId);
                } catch (e) {
                    alert("Failed to delete user: " + e);
                }
            })
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

    return (
        <div className={"ml-5 mt-5 mr-5"}>
            { sideView == "loanEdit" && selectedLoanId && <EditLoan
                loan={loans.find(loan => loan.id === selectedLoanId)!}
                setLoans={setLoans}

            />}
            { users.length !== 0 && <div className={"mb-15"}>
                <form onSubmit={handleSubmit}>
                    <input value={username} onChange={(e) => setUsername(e.target.value)} type="text" name="username" placeholder="Username" className="bg-white rounded-md p-2 m-2 placeholder-black text-black" />
                    <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" name="password" placeholder="Password" className="bg-white rounded-md p-2 m-2 placeholder-black text-black" />
                    <button type="submit">Add User</button>

                </form>
            </div>}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {loans.filter(loanDto => loanDto.status !== "Returned").map(loanDto => {
                    const loan = new LoanClass(
                        loanDto.id,
                        loanDto.status,
                        loanDto.startDate,
                        loanDto.endDate,
                        loanDto.borrower,
                        loanDto.item,
                        {
                            deleteLoan: async (id : number) => handleDeleteLoan(id),
                            returnLoan: async (id : number) => handleReturnLoan(id)
                        }
                    )
                    return <Card loan={loan} setSelectedLoanId={setSelectedLoanId} setSideView={setSideView} key={loan.id} />;
                })}
                {optimisticUsers.map(userDto => {
                    const user = new UserClass(
                        userDto.id,
                        userDto.username,
                        userDto.createdAt,
                        userDto.latestActivity,
                        {
                            deleteUser: async (id: number) => handleDeleteUser(id)
                        },
                        userDto.status
                    )
                   return <Card user={user} key={user.id} />;
                })}
            </div>
            {hasReturnedLoans && (
                <div className={"mt-10"}>
                    <h1 className={"text-4xl font-bold"}>Returned loans:</h1>
                    <div className=" mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {loans.filter(loanDto => loanDto.status === "Returned").map(loanDto => {
                            const loan = new LoanClass(
                                loanDto.id,
                                loanDto.status,
                                loanDto.startDate,
                                loanDto.endDate,
                                loanDto.borrower,
                                loanDto.item,
                                {
                                    deleteLoan: async (id : number) => handleDeleteLoan(id),
                                    returnLoan: async (id : number) => handleReturnLoan(id)
                                }
                            )
                            return <Card loan={loan} key={loan.id} />;
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}