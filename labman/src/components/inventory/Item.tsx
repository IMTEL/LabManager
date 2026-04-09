"use client"

import Ellipsis from "@/components/core/Ellipsis";
import {Equipment} from "@/types/inventory";
import {loanCount} from "@/utils/inventoryUtils";
import {useSideView} from "@/app/sideViewContext";

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
    deleteEquipment: (name: string) => void;
}

export default function Item({ equipment, name, category, creationDate, setSelectedEquipment, deleteEquipment }: ItemProps) {

    // CreationDate is not an actual type of Date, so it needs to be converted to a Date object.
    const date = new Date(creationDate);
    const {sideView, setSideView} = useSideView();


    return(
        <>
            <div className="pt-2 pb-2 pl-3 border-white border-b-[1px]" >
                <div className="grid grid-cols-4 grid-flow-col auto-cols-max ">
                    <h1 className="font-bold text-2xl mt-2" onClick={() => {setSelectedEquipment(equipment); setSideView("loanView")}}>{name}</h1>
                    <h1 className="text-2xl mt-2">{category}</h1>
                    <h1 className="text-2xl mt-2">{equipment.items.length - loanCount(equipment)}/{equipment.items.length}</h1>
                    <h1 className="text-2xl mt-2">{date.toLocaleDateString("no")}</h1>
                    <div className={"grid grid-cols-3"}>
                        <button className={"rounded-button h-9 w-9 bg-green-600 mt-2 mr-2"} onClick={() => {setSelectedEquipment(equipment); setSideView("loanView")}}>
                            <img
                                className={"ml-1.5"}
                                width="25"
                                height="25"
                                src="https://img.icons8.com/ios-filled/50/give.png" alt="give"
                            />
                        </button>
                        <button className={"rounded-button h-9 w-9 bg-blue-600 mt-2"} onClick={() => {setSelectedEquipment(equipment); setSideView("eqInfo")}}>
                            <img
                                className={"ml-1.5"}
                                width="25"
                                height="25"
                                src="https://img.icons8.com/ios-filled/50/create-new.png"
                                alt="create-new"
                            />
                        </button>
                        <div className={"mt-1"}>
                            <Ellipsis
                                equipment={equipment}
                                setSelectedEquipment={setSelectedEquipment}
                                deleteEquipment={deleteEquipment}/>
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}