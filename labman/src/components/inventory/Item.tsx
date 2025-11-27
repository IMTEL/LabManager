"use client"

import Button from "@/components/core/Button";
import {useEffect, useState} from "react";
import {addUnit, deleteUnit} from "@/lib/actions";

type Unit = {
    id: number;
    equipmentId: number;
    status: string;
    createdAt: Date;
    notes: string[];
    errors: string[];
};

interface ItemProps {
    name: string;
    category: string;
    creationDate: Date;
    units?: Unit[];
    selectedUnit: number[] | null;
    setSelectedUnit: (unit: number[] | null) => void;
    deleteEquipment: (name: string) => void;
}

export default function Item({ name, category, creationDate, units, selectedUnit, setSelectedUnit, deleteEquipment }: ItemProps) {
    const [unitsList, setUnitsList] = useState<Unit[]>(units || []);

    // CreationDate is not an actual type of Date, so it needs to be converted to a Date object.
    const date = new Date(creationDate);

    useEffect(() => {
        setUnitsList(units || []);
    }, [units]);

    async function handleDeleteUnit(id: number) {

        setUnitsList(unitsList.filter((unit) => unit.id !== id));
        await deleteUnit(id);
    }

    async function handleAddUnit(name: string) {
       const newUnit  = await addUnit(name);
       if (!newUnit) return;
       setUnitsList(prev => [...prev, newUnit]);

    }

    return(
        <>
            <div className="pt-2 pb-2 pl-3 border-white border-b-[1px]">
                <div className="grid grid-cols-4">
                    <h1 className="font-bold text-2xl mt-2">{name}</h1>
                    <h1 className="text-2xl mt-2">{category}</h1>
                    <h1 className="text-2xl mt-2">{unitsList.length}/0</h1>
                    <h1 className="text-2xl mt-2">{date.toLocaleDateString("no")}</h1>

                    {/*
                    <button onClick={() => deleteEquipment(name)} className="bg-red-600 flex justify-center w-11 h-11 rounded-full col-span-1 justify-self-end mb-1 mr-3 text-black text-5xl">-</button>
                    <button onClick={() => handleAddUnit(name)} className="bg-green-600 flex justify-center w-11 h-11 rounded-full col-span-1 justify-self-end mr-5 mb-1 text-black text-5xl">+</button> */}
                </div>
            </div>

            { unitsList.length < 0 && unitsList.map((unit, index) => (

                <div key={unit.id} className={`bg-brand-950 pt-2 pb-2 pl-3 ${index == 0 ? "mt-8" : "mt-5"} ${index + 1 == unitsList.length ? "mb-10" : "" } border-white border-[1px] rounded-md`}>
                    <div className="grid grid-cols-3">
                        <button onClick={() => setSelectedUnit(selectedUnit?.[0] === unit.id ? null : [unit.id, index + 1])} className="bg-white w-6 h-6 rounded-sm flex items-center justify-center mt-1 col-span-1">
                            <div className={`${selectedUnit?.[0] === unit.id ? "bg-blue-600 w-5 h-5 rounded-sm" : ""}`}></div>
                        </button>
                        <h1 className="mt-1">Unit {index + 1}</h1>
                        <button
                            onClick={() => handleDeleteUnit(unit.id)}
                            className="bg-red-600 flex justify-center w-8 h-8 rounded-full col-end-31"
                        >
                            <p className="text-4xl text-black">-</p>
                        </button>
                    </div>

                </div>
            ))}
        </>
    )
}