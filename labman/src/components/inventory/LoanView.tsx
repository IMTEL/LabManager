"use client"
import {useEffect, useState} from "react";
import {addLoan} from "@/lib/actions";

type Equipment = {
    id: number;
    name: string;
    image: string;
    category: {
        id: number;
        name: string;
    }
    createdAt: Date;
    items: Unit[]
}

type Unit = {
    id: number;
    equipmentId: number;
    status: string;
    createdAt: Date;
    notes: string[];
    errors: string[];
};

interface LoanViewProps {
    equipmentData: Equipment;
    setSideView: (view: string) => void;
  /*  allEquipment: Equipment[];
    setAllEquipment: React.Dispatch<React.SetStateAction<Equipment[]>>;
    setSelectedEquipment: (equipment: Equipment | null) => void;
    deleteEquipment: (name: string) => void; */
}

export default function LoanView({setSideView, equipmentData} : LoanViewProps) {
    const [selectedUnit, setSelectedUnit] = useState<Unit>();

    const [formData, setFormData] = useState({borrower: "", startDate: "", endDate: "", borrowerPhone: "", borrowerEmail: ""})


    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if ( !selectedUnit || !formData.borrower?.trim() || !formData.startDate?.trim() || !formData.endDate?.trim() || (!formData.borrowerPhone?.trim() && !formData.borrowerEmail?.trim())) {
            alert("Please fill in all required fields");
            return;
        }
        console.log(formData, selectedUnit);
        const newLoan = await addLoan(formData.borrower, formData.startDate, formData.endDate, selectedUnit.id, formData.borrowerPhone, formData.borrowerEmail);
        console.log(newLoan);
    }

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
                                    type="text"
                                    className="side-form-input"
                                    onChange={(e) => setFormData({...formData, borrower: e.target.value})} />
                                <label className="side-form-label">Start date:</label>
                                <input
                                    type="text"
                                    className="side-form-input"
                                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}/>
                                <label className="side-form-label">End date:</label>
                                <input
                                    type="text"
                                    className="side-form-input"
                                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}/>
                                <label className="side-form-label">Borrower phone number:</label>
                                <input
                                    type="text"
                                    className="side-form-input"
                                    onChange={(e) => setFormData({...formData, borrowerPhone: e.target.value})}/>
                                <label className="side-form-label">Borrower email:</label>
                                <input
                                    type="text"
                                    className="side-form-input"
                                    onChange={(e) => setFormData({...formData, borrowerEmail: e.target.value})}/>
                            </form>
                        </div>
                        <span>---------------------------------------------------------------------------------------</span>
                        <h1 className="font-bold text-4xl mt-5 mb-3">Items</h1>
                        <div className="item-view">
                            <div className="mb-10">
                                {equipmentData.items.map((unit, index) => (
                                    <div key={unit.id} className="flex items-center justify-between bg-brand-200 rounded-md p-1 mb-3">
                                        <h1 className="font-bold text-xl text-black">Unit {index + 1}</h1>
                                        <button
                                            className="bg-white h-8 w-8 border-black border-1 rounded-full flex items-center justify-center"
                                            onClick={() => setSelectedUnit(unit)}>
                                            <div className={selectedUnit == unit ? "bg-blue-600 h-4 w-4 rounded-full" : ""}></div>
                                        </button>

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
                                <h1>{equipmentData.items.length} in stock</h1>
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