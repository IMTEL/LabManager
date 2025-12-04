"use client";
import { useState } from "react";
import EditField from "@/components/core/EditField";
import {addUnit, deleteUnit} from "@/lib/actions";

type Equipment = {
    id: number;
    name: string;
    image: string;
    category: {
        id: number;
        name: string;
    }
    createdAt: Date;
    items: {
        id: number;
    }[]
}

type Unit = {
    id: number;
    equipmentId: number;
    status: string;
    createdAt: Date;
    notes: string[];
    errors: string[];
};

interface EquipmentInfoProps {
    equipmentData: Equipment | null;
    setEquipmentView: (view: boolean) => void;
    allEquipment: Equipment[];
    setAllEquipment: React.Dispatch<React.SetStateAction<Equipment[]>>;
    setSelectedEquipment: (equipment: Equipment | null) => void;
}

export default function EquipmentInfo({equipmentData, setEquipmentView, allEquipment, setAllEquipment, setSelectedEquipment}: EquipmentInfoProps) {

    const [units, setUnits] = useState<Unit[]>(equipmentData?.items || []);

    async function handleAddUnit(name?: string) {
        if (!name) return;
        const newUnit = await addUnit(name);
        if (!newUnit) return;
        setUnits(prev => [...prev, newUnit]);

        const updatedEquipment = {
            ...equipmentData,
            items: [...(equipmentData?.items ?? []), newUnit]
        };


        setAllEquipment(prev =>
            prev.map(eq =>
                eq.id === updatedEquipment.id ? updatedEquipment : eq
            )
        );

        setSelectedEquipment(updatedEquipment)
    }

    async function handleDeleteUnit(id: number) {
        setUnits(units.filter((unit) => unit.id !== id));

        const updatedEquipment = {
            ...equipmentData,
            items: [...(equipmentData?.items ?? [])].filter(unit => unit.id !== id)
        }

        setAllEquipment(prev =>
            prev.map(eq =>
                eq.id === updatedEquipment.id ? updatedEquipment : eq
            )
        )

        setSelectedEquipment(updatedEquipment)

        await deleteUnit(id);
    }




    return (
        <>
            {/* Dark backdrop */}
            <div
                className="fixed inset-0 bg-black/70 z-40"
                onClick={() => setEquipmentView(false)}
            />

            {/* Right-side panel */}
            <div className="fixed top-5 bottom-5 right-0 h-screen w-275 bg-brand-500 shadow-xl z-50 mr-5 rounded-lg flex flex-col ">

                {/* Vertical split */}
                <div className="flex flex-1  h-full">
                    {/* Left side of a panel */}
                    <div className="flex-1 rounded-l-lg p-2">
                        <h1 className="text-5xl font-bold">Equipment information</h1>
                        <div className="mt-7 mb-10">
                            <button className="bg-blue-600 button mr-2">Save changes</button>
                            <button className="bg-yellow-500 button mr-10">Undo</button>
                            <button className="bg-red-600 button">Delete equipment</button>
                        </div>

                        <div className="mb-25">
                            <div>
                                <h1 className="font-bold text-3xl mb-2">Name:</h1>
                                <EditField value={equipmentData?.name || "Unknown"} />
                            </div>
                            <div>
                                <h1 className="font-bold text-3xl mb-2 mt-6">Category:</h1>
                                <EditField value={equipmentData?.category?.name || "Unknown"} />
                            </div>
                            <div>
                                <h1 className="font-bold text-3xl mb-2 mt-6">Image:</h1>
                                <EditField value={equipmentData?.image || "Unknown"} />
                            </div>
                        </div>
                        <span>---------------------------------------------------------------------------------------</span>
                        <h1 className="font-bold text-4xl mt-5 mb-3">Items</h1>
                        <div className="item-view">
                            <button className="button bg-green-500 mb-10" onClick={() => handleAddUnit(equipmentData?.name)}>Add unit</button>
                            <div className="mb-10">
                                { units.map((unit, index) => (
                                    <div key={unit.id} className="flex items-center justify-between bg-brand-200 rounded-md p-1 mb-3">
                                        <h1 className="font-bold text-xl text-black">Unit {index + 1}</h1>
                                        <button className="text-black font-bold rounded-full h-7 w-7 bg-red-600" onClick={() => handleDeleteUnit(unit.id)}>-</button>
                                    </div>
                                )) }
                            </div>
                        </div>
                    </div>

                    {/* Right side of panel */}
                    <div className="flex-1 bg-brand-950 rounded-r-lg p-2">
                        <div className="flex justify-end">
                            <button onClick={() => setEquipmentView(false)} className="bg-red-600 w-11 h-11 rounded-full font-bold">X</button>
                        </div>
                        <div className="ml-7 mt-10">
                            <div className="font-bold text-2xl mb-5">
                                <h1>{equipmentData?.name}</h1>
                                <h1>{equipmentData?.category.name}</h1>
                                <h1>{units.length} in stock</h1>
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