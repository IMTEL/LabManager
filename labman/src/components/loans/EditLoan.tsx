"use client"

import {loanCount} from "@/utils/inventoryUtils";
import {useEffect, useState} from "react";
import {updateLoan} from "@/lib/actions";

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
            image: string | null;
            createdAt: Date;

        }
    }
}

type Borrower = {
    id: number;
    name: string;
    phone: string;
    email: string;
}

interface EditLoanProps {
    loan: Loan;
    setSideView: (view: string) => void;
    setLoans: React.Dispatch<React.SetStateAction<Loan[]>>;
}

export default function EditLoan({loan, setSideView, setLoans}: EditLoanProps) {

    const [initialFormData, setInitialFormData] = useState({borrower: loan.borrower.name, startDate: loan.startDate, endDate: loan.endDate, borrowerPhone: loan.borrower.phone, borrowerMail: loan.borrower.email})
    const [formData, setFormData] = useState(initialFormData);

    const phoneRequired = formData.borrowerMail?.trim() === "";
    const emailRequired = formData.borrowerPhone?.trim() === "";

    const [borrowers, setBorrowers] = useState<Borrower[]>([]);
    useEffect(() => {
        fetch("/api/borrower")
            .then(res => res.json())
            .then(data => setBorrowers(data))
    }, []);


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

        const updatedLoan = await updateLoan(
            loan.id,
            formData.startDate,
            formData.endDate,
            formData.borrower,
            loan.borrower.id,
            formData.borrowerPhone,
            formData.borrowerMail
        );
        if (!updatedLoan) return;

        setLoans(prev =>
            prev.map(loan => loan.id === updatedLoan.id ? updatedLoan : loan)
            
        )

        setInitialFormData(formData);



    }

    return(
        <>
            {/* Dark backdrop */}
            <div
                className="fixed inset-0 bg-black/70 z-40"
                onClick={() => setSideView("")}
            />

            {/* Right-side panel */}
            <div className="fixed top-5 bottom-5 right-0 h-screen w-275 bg-brand-500 shadow-xl z-50 mr-5 rounded-lg flex flex-col ">

                {/* Vertical split */}
                <div className="flex flex-1  h-full">
                    {/* Left side of a panel */}
                    <div className="flex-1 rounded-l-lg p-2">
                        <h1 className="text-5xl font-bold">Edit loan</h1>
                        <div className="mt-7 mb-10">
                            <button form="loanDataForm" type="submit" className={ JSON.stringify(formData) === JSON.stringify(initialFormData) ? "bg-blue-600 mr-2 button-deactive" : "bg-blue-600 button mr-2"}>Save changes</button>
                            <button onClick={() => {setFormData(initialFormData)}} className={JSON.stringify(formData) === JSON.stringify(initialFormData) ? "bg-yellow-500 button-deactive mr-10" : "bg-yellow-500 button mr-10"}>Undo</button>
                            <button onClick={() => setSideView("")} className="bg-red-600 button">Cancel</button>
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
                                        console.log(e.target.value);
                                        setFormData({...formData, borrowerPhone: e.target.value})
                                        console.log(formData);
                                    }}
                                />
                                <label className="side-form-label">Borrower email:</label>
                                <input
                                    required={emailRequired}
                                    value={formData.borrowerMail ? formData.borrowerMail : ""}
                                    type="email"
                                    className="side-form-input"
                                    onChange={(e) => {
                                        setFormData({...formData, borrowerMail: e.target.value})
                                    }}
                                />
                            </form>
                        </div>
                        <span>---------------------------------------------------------------------------------------</span>
                        <h1 className="font-bold text-4xl mt-5 mb-3">Items</h1>
                        <div className="item-view">
                            <div className="mb-10">
                                {/*equipmentData.items.map((unit, index) => (
                                    hasActiveLoan = unit.activeLoan != null,
                                        <div key={unit.id} className="flex items-center justify-between bg-brand-200 rounded-md p-1 mb-3">
                                            <h1 className="font-bold text-xl text-black">Unit {index + 1}</h1>
                                            { unit.activeLoan && (unit.activeLoan.status !== "Returned") && <h1 className="text-black font-bold">Borrowed</h1>}
                                            { (unit.activeLoan == null || unit.activeLoan.status === "Returned") && <button
                                                className="bg-white h-8 w-8 border-black border-1 rounded-full flex items-center justify-center"
                                                onClick={() => setSelectedUnit(unit)}>
                                                <div className={selectedUnit == unit ? "bg-blue-600 h-4 w-4 rounded-full" : ""}></div>
                                            </button>}

                                        </div>
                                )) */}
                            </div>
                        </div>
                    </div>

                    {/* Right side of panel */}
                    <div className="flex-1 bg-brand-950 rounded-r-lg p-2">
                        <div className="flex justify-end">
                            <button onClick={() => setSideView("")} className="bg-red-600 w-11 h-11 rounded-full font-bold">X</button>
                        </div>
                        <div className="ml-7 mt-10">
                            {/*<div className="font-bold text-2xl mb-5">
                                <h1>{equipmentData.name}</h1>
                                <h1>{equipmentData.category.name}</h1>
                                <h1>{equipmentData.items.length - loanCount(equipmentData)}/{equipmentData.items.length} Available</h1>
                            </div> */}
                            <span>----------------------------------------------------------------------------------</span>
                            <h1 className="font-bold text-4xl mt-5">History</h1>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}