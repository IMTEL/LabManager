"use client"

import {useEffect, useState} from "react";
import {updateLoan} from "@/lib/actions";
import {Loan} from "@/types/Loan";
import SideView from "@/components/core/SideView/SideView";


type Borrower = {
    id: number;
    name: string;
    phone: string;
    email: string;
}

interface EditLoanProps {
    loan: Loan;
    setLoans: React.Dispatch<React.SetStateAction<Loan[]>>;
}

export default function EditLoan({loan, setLoans}: EditLoanProps) {

    const [initialFormData, setInitialFormData] = useState({borrower: loan.borrower.name, startDate: loan.startDate, endDate: loan.endDate, borrowerPhone: loan.borrower.phone, borrowerMail: loan.borrower.email})
    const [formData, setFormData] = useState(initialFormData);

    const phoneRequired = formData.borrowerMail?.trim() === "";
    const emailRequired = formData.borrowerPhone?.trim() === "";

    const [borrowers, setBorrowers] = useState<Borrower[]>([]);
    useEffect(() => {
        fetch("/api/borrower")
            .then(res => res.json())
            .then(data => setBorrowers(data))
    }, [initialFormData]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (
            !formData.borrower.trim()
            || !formData.startDate
            || !formData.endDate
            || (!formData.borrowerPhone?.trim() && !formData.borrowerMail?.trim())
        ) {
            alert("Please fill in all required fields");
            return;
        }
        let updatedLoan: Loan;
        const res = await updateLoan(
                loan.id,
                formData.startDate,
                formData.endDate,
                formData.borrower,
                loan.borrower.id,
                formData.borrowerPhone,
                formData.borrowerMail
            );
        console.log(res);

        if (res.type === "error") {
            alert(res.message);
            return;
        } else if (res.type === "success") {
            updatedLoan = res.data;
        }

        setLoans(prev =>
            prev.map(loan => loan.id === updatedLoan.id ? updatedLoan : loan)
            
        )
        setInitialFormData(formData);
    }

    return(
        <>
            <SideView>
                <>
                    <div className="mt-7 mb-10">
                        <button form="loanDataForm" type="submit" className={ JSON.stringify(formData) === JSON.stringify(initialFormData) ? "bg-blue-600 mr-2 button-deactive" : "bg-blue-600 button mr-2"}>Save changes</button>
                        <button onClick={() => {setFormData(initialFormData)}} className={JSON.stringify(formData) === JSON.stringify(initialFormData) ? "bg-yellow-500 button-deactive mr-10" : "bg-yellow-500 button mr-10"}>Undo</button>
                        <button className="bg-red-600 button">Cancel</button>
                    </div>

                    <div className="mb-25">

                        <form id="loanDataForm" onSubmit={handleSubmit}>
                            <label className="side-form-label">Borrower:</label>
                            <input
                                id="borrower"
                                value={formData.borrower}
                                list="borrowers"
                                required
                                type="text"
                                className="side-form-input"
                                onChange={(e) => {
                                    const borrower = borrowers.find(borrower => borrower.name === e.target.value);
                                    // TODO: Better to use functional updates because React hasn't re-rendered the component yet and should not do two state changes at once due to batching
                                    setFormData(prev => ({
                                        ...prev,
                                        borrower: e.target.value,
                                        borrowerPhone: borrower?.phone || "",
                                        borrowerMail: borrower?.email || ""
                                    }))
                                }}
                            />
                            <datalist id="borrowers">
                                {borrowers.map(borrower => <option key={borrower.id} value={borrower.name}>{borrower.name}</option>)}
                            </datalist>
                            <label className="side-form-label">Start date:</label>
                            <input
                                id="startDate"
                                type="date"
                                required
                                value={formData.startDate.toISOString().split("T")[0]}
                                className="side-form-input"
                                onChange={(e) => {
                                    const selected = e.target.value;
                                    setFormData({...formData, startDate: new Date(selected)})
                                }}
                            />
                            <label className="side-form-label">End date:</label>
                            <input
                                type="date"
                                required
                                value={formData.endDate.toISOString().split("T")[0]}
                                min={formData.startDate.toISOString().split("T")[0]}
                                className="side-form-input"
                                onChange={(e) => {
                                    const selected = e.target.value;
                                    if (selected < formData.startDate.toLocaleDateString()) return;
                                    setFormData({...formData, endDate: new Date(selected)});

                                }}
                            />
                            <label className="side-form-label">Borrower phone number:</label>
                            <input
                                required={phoneRequired}
                                value={formData.borrowerPhone ? formData.borrowerPhone : ""}
                                type="tel"
                                pattern="[0-9]{8}"
                                className="side-form-input"
                                onChange={(e) => {
                                    e.target.setCustomValidity("");
                                    if (e.target.value.length === 8) {
                                        if (borrowers.find(borrower => borrower.phone === e.target.value && borrower.id !== loan.borrower.id)) {
                                            e.target.setCustomValidity("A borrower with the same phone number already exists");
                                            e.target.reportValidity();
                                        }
                                    }
                                    setFormData({...formData, borrowerPhone: e.target.value})

                                }}
                            />
                            <label className="side-form-label">Borrower email:</label>
                            <input
                                required={emailRequired}
                                value={formData.borrowerMail ? formData.borrowerMail : ""}
                                type="email"
                                className="side-form-input"
                                onChange={(e) => {
                                    e.target.setCustomValidity("");
                                    if (e.target.checkValidity()) {
                                        if (borrowers.find(borrower => borrower.email === e.target.value && borrower.id !== loan.borrower.id)) {
                                            e.target.setCustomValidity("A borrower with the same email already exists");
                                            e.target.reportValidity();
                                        }
                                    }
                                    setFormData({...formData, borrowerMail: e.target.value})
                                }}
                            />
                        </form>
                    </div>
                </>

            </SideView>
        </>
    )
}