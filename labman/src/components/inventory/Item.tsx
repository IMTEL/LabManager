"use client"

import {useState} from "react";
import Ellipsis from "@/components/core/Ellipsis";
import {Equipment} from "@/types/inventory";

type Unit = {
    id: number;
    equipmentId: number;
    status: string;
    createdAt: Date;
    notes: string[];
    errors: string[];
};

interface ItemProps {
    equipment: Equipment;
    name: string;
    category: string;
    creationDate: Date;
    units?: Unit[];
    setSelectedEquipment: (equipment: Equipment | null) => void;
    setSideView: (view: string) => void;
    deleteEquipment: (name: string) => void;
}

export default function Item({ equipment, name, category, creationDate, units, setSelectedEquipment, setSideView, deleteEquipment }: ItemProps) {
    const [unitsList] = useState<Unit[]>(units || []);

    // CreationDate is not an actual type of Date, so it needs to be converted to a Date object.
    const date = new Date(creationDate);

    return(
        <>
            <div className="pt-2 pb-2 pl-3 border-white border-b-[1px]" >
                <div className="grid grid-cols-4 grid-flow-col auto-cols-max ">
                    <h1 className="font-bold text-2xl mt-2" onClick={() => {setSelectedEquipment(equipment); setSideView("eqInfo")}}>{name}</h1>
                    <h1 className="text-2xl mt-2">{category}</h1>
                    <h1 className="text-2xl mt-2">{unitsList.length}/0</h1>
                    <h1 className="text-2xl mt-2">{date.toLocaleDateString("no")}</h1>
                    <Ellipsis
                        equipment={equipment}
                        setSelectedEquipment={setSelectedEquipment}
                        setSideView={setSideView}
                        deleteEquipment={deleteEquipment}

                    />
                </div>
            </div>
        </>
    )
}