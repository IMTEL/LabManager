import {JSX} from "react";
import {Equipment, Unit} from "@/types/inventory";
import {useSideView} from "@/app/sideViewContext";
import ItemList from "@/components/core/SideView/ItemList";
import {loanCount} from "@/utils/inventoryUtils";

interface SideViewProps {
    children: JSX.Element;
    title: string;
    equipmentData: Equipment;
    itemList?: JSX.Element;

}

export default function SideView( { children, title, equipmentData, itemList} : SideViewProps) {
    const {sideView, setSideView} = useSideView();
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
                    <div className="flex-1 rounded-l-lg p-2 overflow-y-auto">
                        <h1 className="text-5xl font-bold">{title}</h1>
                        <div className="mt-7 mb-10">
                        </div>

                        <div className="h-150">
                            {children}
                        </div>
                        <span>---------------------------------------------------------------------------------------</span>
                        {itemList}
                    </div>

                    {/* Right side of panel */}
                    <div className="flex-1 bg-brand-950 rounded-r-lg p-2">
                        <div className="flex justify-end">

                            {(sideView === "loanView" || sideView === "eqInfo") &&
                            <button
                                onClick={() => {setSideView(sideView === "loanView" ? "eqInfo" : "loanView")}}
                                className="bg-blue-600 mr-3 button">{sideView === "loanView" ? "Edit Equipment" : "Lend Equipment"}</button>}

                            <button className="bg-red-600 w-11 h-11 rounded-full font-bold" onClick={() => setSideView("")}>X</button>

                        </div>
                        <div className="ml-7 mt-10">
                            <div className="font-bold text-2xl mb-5">
                                <h1>{equipmentData.name}</h1>
                                <h1>{equipmentData.category.name}</h1>
                                <h1>{equipmentData.items.length - loanCount(equipmentData)}/{equipmentData.items.length} Available</h1>
                            </div>
                            <span>----------------------------------------------------------------------------------</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}