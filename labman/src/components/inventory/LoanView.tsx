"use client"
import {useEffect, useState} from "react";
import {addLoan} from "@/lib/actions";
import {Equipment} from "@/types/inventory";
import {loanCount} from "@/utils/inventoryUtils";

type Unit = {
    id: number;
    equipmentId: number;
    status: string;
    createdAt: Date;
    notes: string[];
    errors: string[];
};

type Borrower = {
    id: number;
    name: string;
    phone: string;
    email: string;
}

interface LoanViewProps {
    equipmentData: Equipment;
    setSideView: (view: string) => void;
    setAllEquipment: React.Dispatch<React.SetStateAction<Equipment[]>>;
    setSelectedEquipment: (equipment: Equipment | null) => void;
}

export default function LoanView({setSideView, equipmentData, setAllEquipment, setSelectedEquipment} : LoanViewProps) {
    const [borrowers, setBorrowers] = useState<Borrower[]>([]);

    useEffect(() => {
        fetch("/api/borrower")
        .then(res => res.json())
        .then(data => setBorrowers(data))
    }, []);

    const [selectedUnit, setSelectedUnit] = useState<Unit>();

    const today = new Date().toISOString().split("T")[0];
    const [formData, setFormData] = useState({borrower: "", startDate: today, endDate: "", borrowerPhone: "", borrowerEmail: ""})

    const phoneRequired = formData.borrowerEmail.trim() === "";
    const emailRequired = formData.borrowerPhone.trim() === "";

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        console.log(formData);
        if ( !selectedUnit || !formData.borrower?.trim() || !formData.startDate?.trim() || !formData.endDate?.trim() || (!formData.borrowerPhone?.trim() && !formData.borrowerEmail?.trim())) {
            alert("Please fill in all required fields");
            return;
        }
        const newLoan = await addLoan(formData.borrower, formData.startDate, formData.endDate, selectedUnit.id, formData.borrowerPhone, formData.borrowerEmail);

        if (!newLoan) return;

        const updatedEquipment = {
            ...equipmentData,
            items: equipmentData.items.map(item => {
                if (item.id === selectedUnit.id) {
                    return {...item, activeLoan: newLoan, activeLoanId: newLoan.id}
                } else {
                    return item;
                }
            })
        }

        setAllEquipment(prev =>
            prev.map(eq => eq.id === updatedEquipment.id ? updatedEquipment : eq))

        setSelectedEquipment(updatedEquipment);


    }

    let hasActiveLoan = false;


    //TODO: More imrpovements to do on this form and the other forms plus valditation of the form data. Delaying this until the core functionality is done.

    return (
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
                        <h1 className="text-5xl font-bold">New Loan</h1>
                        <div className="mt-7 mb-10">
                            <button form="loanDataForm" type="submit" className={"bg-green-500 button mr-2"}>Add Loan</button>
                            <button  className="bg-yellow-500 button mr-10">Undo</button>
                            <button className="bg-red-600 button">Cancel</button>
                        </div>

                        <div className="mb-25">
                            <form id="loanDataForm" onSubmit={handleSubmit}>
                                <label className="side-form-label">Borrower:</label>
                                <input
                                    id="borrower"
                                    list="borrowers"
                                    required
                                    type="text"
                                    className="side-form-input"
                                    onChange={(e) => {
                                        console.log(e.target.value);
                                        setFormData({...formData, borrower: e.target.value})
                                        console.log(formData);
                                        const borrower = borrowers.find(borrower => borrower.name === e.target.value);
                                        if (borrower) setFormData({...formData, borrowerPhone: borrower.phone, borrowerEmail: borrower.email});

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
                                    value={formData.startDate}
                                    min={today}
                                    className="side-form-input"
                                    onChange={(e) => {
                                        const selected = e.target.value;
                                        if (selected < today) return;
                                        setFormData({...formData, startDate: selected})
                                    }}
                                />
                                <label className="side-form-label">End date:</label>
                                <input
                                    type="date"
                                    required
                                    value={formData.endDate || ""}
                                    min={formData.startDate}
                                    className="side-form-input"
                                    onChange={(e) => {
                                        const selected = e.target.value;
                                        if (selected < formData.startDate) return;
                                        setFormData({...formData, endDate: e.target.value});

                                    }}
                                />
                                <label className="side-form-label">Borrower phone number:</label>
                                <input
                                    required={phoneRequired}
                                    value={formData.borrowerPhone}
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
                                    value={formData.borrowerEmail}
                                    type="email"
                                    className="side-form-input"
                                    onChange={(e) => {
                                        setFormData({...formData, borrowerEmail: e.target.value})
                                    }}
                                />
                            </form>
                        </div>
                        <span>---------------------------------------------------------------------------------------</span>
                        <h1 className="font-bold text-4xl mt-5 mb-3">Items</h1>
                        <div className="item-view">
                            <div className="mb-10">
                                {equipmentData.items.map((unit, index) => (
                                   hasActiveLoan = unit.activeLoan !== null,
                                    <div key={unit.id} className="flex items-center justify-between bg-brand-200 rounded-md p-1 mb-3">
                                        <h1 className="font-bold text-xl text-black">Unit {index + 1}</h1>
                                        { hasActiveLoan && (unit.activeLoan.status !== "Returned") && <h1 className="text-black font-bold">Borrowed</h1>}
                                        { (!hasActiveLoan || (hasActiveLoan && unit.activeLoan.status === "Returned")) && <button
                                            className="bg-white h-8 w-8 border-black border-1 rounded-full flex items-center justify-center"
                                            onClick={() => setSelectedUnit(unit)}>
                                            <div className={selectedUnit == unit ? "bg-blue-600 h-4 w-4 rounded-full" : ""}></div>
                                        </button>}

                                    </div>
                                )) }
                            </div>
                        </div>
                    </div>

                    {/* Right side of panel */}
                    <div className="flex-1 bg-brand-950 rounded-r-lg p-2">
                        <div className="flex justify-end">
                            <button onClick={() => setSideView("")} className="bg-red-600 w-11 h-11 rounded-full font-bold">X</button>
                        </div>
                        <div className="ml-7 mt-10">
                            <div className="font-bold text-2xl mb-5">
                                <h1>{equipmentData.name}</h1>
                                <h1>{equipmentData.category.name}</h1>
                                <h1>{equipmentData.items.length - loanCount(equipmentData)}/{equipmentData.items.length} Available</h1>
                            </div>
                            <span>----------------------------------------------------------------------------------</span>
                            <h1 className="font-bold text-4xl mt-5">History</h1>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}