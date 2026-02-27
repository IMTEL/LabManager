"use client"
import {useEffect, useState} from "react";
import {addLoan} from "@/lib/actions";
import {Equipment} from "@/types/inventory";
import {loanCount} from "@/utils/inventoryUtils";
import SideView from "@/components/core/SideView/SideView"

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
    setAllEquipment: React.Dispatch<React.SetStateAction<Equipment[]>>;
    setSelectedEquipment: (equipment: Equipment | null) => void;
}

export default function LoanView({equipmentData, setAllEquipment, setSelectedEquipment} : LoanViewProps) {
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
        <SideView title={"Add loan"} equipmentData={equipmentData}>
            <>
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
                            value={formData.startDate}
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
            </>
        </SideView>
    );
}