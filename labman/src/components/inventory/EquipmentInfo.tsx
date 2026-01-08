"use client";
import {useEffect, useState} from "react";
import {addUnit, deleteUnit, updateEquipment} from "@/lib/actions";
import {Equipment} from "@/types/inventory";
import {loanCount} from "@/utils/inventoryUtils";

type Unit = {
    id: number;
    equipmentId: number;
    status: string;
    createdAt: Date;
    notes: string[];
    errors: string[];
    loanId: number | null;
};

interface EquipmentInfoProps {
    equipmentData: Equipment;
    setSideView: (view: string) => void;
    allEquipment: Equipment[];
    setAllEquipment: React.Dispatch<React.SetStateAction<Equipment[]>>;
    setSelectedEquipment: (equipment: Equipment | null) => void;
    deleteEquipment: (name: string) => void;
}

export default function EquipmentInfo({equipmentData, setSideView, setAllEquipment, setSelectedEquipment, deleteEquipment}: EquipmentInfoProps) {


    const [initialFormData, setInitialFormData] = useState({name: equipmentData?.name, category: equipmentData?.category.name, image: equipmentData?.image})
    const [formData, setFormData] = useState(initialFormData);

    // The initial data has to be updated when the equipmentData changes
    // TODO: Possible optimization? Unnecessary use of useEffect
    useEffect(() => {
        if (!equipmentData) return;

        setInitialFormData({name: equipmentData.name, category: equipmentData.category.name, image: equipmentData.image})
    }, [equipmentData]);

    async function handleAddUnit(name?: string) {
        if (!name) return;
        const newUnit = await addUnit(name);
        if (!newUnit) return;

        const updatedEquipment = {
            ...equipmentData,
            items: [...(equipmentData.items ?? []), newUnit]
        };


        setAllEquipment(prev =>
            prev.map(eq =>
                eq.id === updatedEquipment.id ? updatedEquipment : eq
            )
        );

        setSelectedEquipment(updatedEquipment)
    }

    async function handleDeleteUnit(id: number) {
       // setUnits(units.filter((unit) => unit.id !== id));

        const updatedEquipment = {
            ...equipmentData,
            items: [...(equipmentData.items ?? [])].filter(unit => unit.id !== id)
        }

        setAllEquipment(prev =>
            prev.map(eq =>
                eq.id === updatedEquipment.id ? updatedEquipment : eq
            )
        )

        setSelectedEquipment(updatedEquipment)

        await deleteUnit(id);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        // Check so no fields are empty
        if (!formData.name?.trim() || !formData.category?.trim() || !formData.image?.trim()) {
            alert("Please fill in all fields");
            setFormData(initialFormData);
            return;
        }

        if (JSON.stringify(formData) === JSON.stringify(initialFormData)) return;


      const updatedEq = await updateEquipment(equipmentData!.id, formData.name!, formData.category!, formData.image!)

      const updatedEquipment = {
          ...equipmentData!,
          name: updatedEq.name,
          category: {
              id: updatedEq.category.id,
              name: updatedEq.category.name
          },
          image: updatedEq.image,
          categoryId: updatedEq.categoryId

      }

      setAllEquipment(prev =>
        prev.map(eq => eq.id === updatedEquipment.id ? updatedEquipment : eq))

      setSelectedEquipment(updatedEquipment);
    }

    let hasActiveLoan = false;

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
                        <h1 className="text-5xl font-bold">Equipment information</h1>
                        <div className="mt-7 mb-10">
                            <button form="equipmentDataForm" type="submit" className={ JSON.stringify(formData) === JSON.stringify(initialFormData) ? " bg-blue-600 mr-2 button-deactive" : "bg-blue-600 button mr-2"}>Save changes</button>
                            <button onClick={() => {setFormData(initialFormData)}} className="bg-yellow-500 button mr-10">Undo</button>
                            <button onClick={() => {deleteEquipment(equipmentData!.name); setSideView("")}} className="bg-red-600 button">Delete equipment</button>
                        </div>

                        <div className="mb-25">
                           <form id="equipmentDataForm" onSubmit={handleSubmit}>
                               <label className="side-form-label">Name:</label>
                               <input
                                   type="text"
                                   value={formData.name}
                                   onChange={(e) => setFormData({...formData, name: e.target.value})}
                                   className="side-form-input" />
                               <label className="side-form-label">Category:</label>
                               <input
                                   type="text"
                                   value={formData.category}
                                   onChange={(e) => setFormData({...formData, category: e.target.value})}
                                   className="side-form-input" />
                               <label className="side-form-label">Image:</label>
                               <input
                                   type="text"
                                   value={formData.image}
                                   onChange={(e) => setFormData({...formData, image: e.target.value})}
                                   className="side-form-input" />
                           </form>
                        </div>
                        <span>---------------------------------------------------------------------------------------</span>
                        <h1 className="font-bold text-4xl mt-5 mb-3">Items</h1>
                        <div className="item-view">
                            <button className="button bg-green-500 mb-10" onClick={() => handleAddUnit(equipmentData?.name)}>Add unit</button>
                            <div className="mb-10">
                                { equipmentData.items.map((unit, index) => (
                                    // TODO: Figure out why it requires the code to be so explicit here.
                                    hasActiveLoan = unit.activeLoan != null,
                                    <div key={unit.id} className="flex items-center justify-between bg-brand-200 rounded-md p-1 mb-3">
                                        <h1 className="font-bold text-xl text-black">Unit {index + 1}</h1>
                                        { hasActiveLoan && (unit.activeLoan.status !== "Returned") && <h1 className="text-black font-bold">Borrowed</h1>}
                                        { (!hasActiveLoan || (hasActiveLoan && unit.activeLoan.status === "Returned")) && <button className="text-black font-bold rounded-full h-7 w-7 bg-red-600 border border-black" onClick={() => handleDeleteUnit(unit.id)}>-</button>}
                                    </div>
                                )) }
                            </div>
                        </div>
                    </div>

                    {/* Right side of panel */}
                    <div className="flex-1 bg-brand-950 rounded-r-lg p-2">
                        <div className="flex justify-end">
                            <button onClick={() => {setSideView("loanView")}} className="bg-blue-600 mr-3 button">Lend equipment</button>
                            <button onClick={() => setSideView("")} className="bg-red-600 w-11 h-11 rounded-full font-bold">X</button>
                        </div>
                        <div className="ml-7 mt-10">
                            <div className="font-bold text-2xl mb-5">
                                <h1>{equipmentData?.name}</h1>
                                <h1>{equipmentData?.category.name}</h1>
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