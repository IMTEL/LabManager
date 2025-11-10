"use client"

import Button from "@/components/core/Button";
import {useEffect, useState} from "react";
import {deleteUnit} from "@/lib/actions";

type Unit = {
    id: number;
}

interface ItemProps {
    name: string;
    category: string;
    units?: Unit[];
    selectedUnit: number | null;
    setSelectedUnit: (unit: number | null) => void;
    deleteEquipment: (name: string) => void;
}

export default function Item({ name, category, units, selectedUnit, setSelectedUnit, deleteEquipment }: ItemProps) {
    const [unitsList, setUnitsList] = useState<Unit[]>(units || []);

    useEffect(() => {
        setUnitsList(units || []);
    }, [units]);

    async function handleDeleteUnit(id: number) {

        setUnitsList(unitsList.filter((unit) => unit.id !== id));
        await deleteUnit(id);
    }

    return(
        <>
            <div className="bg-brand-950 pt-2 pb-2 pl-5 mt-5 border-white border-[1px] rounded-md">
                <div className="grid grid-cols-5">
                    <h1 className="font-bold text-2xl mt-2">{name}</h1>
                    <h1 className="text-2xl mt-2">{category}</h1>
                    <button onClick={() => deleteEquipment(name)} className="bg-red-600 flex justify-center w-11 h-11 rounded-full col-end-7 mr-5 mb-1 text-black text-5xl">-</button>
                </div>
            </div>

            { unitsList.length > 0 && unitsList.map((unit, index) => (

                <div key={unit.id} className={`bg-brand-950 pt-2 pb-2 pl-3 ${index == 0 ? "mt-10" : "mt-5"} ${index + 1 == unitsList.length ? "mb-10" : "" } border-white border-[1px] rounded-md`}>
                    <div className="grid grid-cols-30">
                        <button onClick={() => setSelectedUnit(selectedUnit === unit.id ? null : unit.id)} className="bg-white w-6 h-6 rounded-sm flex items-center justify-center mt-1">
                            <div className={`${selectedUnit === unit.id ? "bg-blue-600 w-5 h-5 rounded-sm" : ""}`}></div>
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