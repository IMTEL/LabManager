import {JSX} from "react";
import {Equipment, Unit} from "@/types/inventory";
import {useSideView} from "@/app/sideViewContext";
import ItemList from "@/components/core/SideView/ItemList";

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
                    <div className="flex-1 rounded-l-lg p-2">
                        <h1 className="text-5xl font-bold">{title}</h1>
                        <div className="mt-7 mb-10">
                            {/*
                            <button form="loanDataForm" type="submit" className={ JSON.stringify(formData) === JSON.stringify(initialFormData) ? "bg-blue-600 mr-2 button-deactive" : "bg-blue-600 button mr-2"}>Save changes</button>
                            <button onClick={() => {setFormData(initialFormData)}} className={JSON.stringify(formData) === JSON.stringify(initialFormData) ? "bg-yellow-500 button-deactive mr-10" : "bg-yellow-500 button mr-10"}>Undo</button>
                            <button onClick={() => setSideView("")} className="bg-red-600 button">Cancel</button>*/}
                        </div>

                        <div className="mb-25">
                            {children}
                            {/*
                            <form id="loanDataForm">
                                <label className="side-form-label">Borrower:</label>
                                <input
                                    id="borrower"
                                    list="borrowers"
                                    required
                                    type="text"
                                    className="side-form-input"
                                />
                                <label className="side-form-label">Start date:</label>
                                <input
                                    id="startDate"
                                    type="date"
                                    required
                                    className="side-form-input"
                                />
                                <label className="side-form-label">End date:</label>
                                <input
                                    type="date"
                                    required
                                    className="side-form-input"
                                />
                                <label className="side-form-label">Borrower phone number:</label>
                                <input
                                    type="tel"
                                    pattern="[0-9]{8}"
                                    className="side-form-input"
                                />
                                <label className="side-form-label">Borrower email:</label>
                                <input
                                    type="email"
                                    className="side-form-input"
                                />
                            </form> */}
                        </div>
                        <span>---------------------------------------------------------------------------------------</span>
                        {/*selectedUnit && setSelectedUnit ?  <ItemList equipmentData={equipmentData} variant={"selectable"} selectedUnit={selectedUnit} setSelectedUnit={setSelectedUnit}></ItemList> :
                        <ItemList equipmentData={equipmentData} variant={"editable"} /> */}
                        {itemList}
                        {/*<h1 className="font-bold text-4xl mt-5 mb-3">Items</h1>
                        <div className="item-view">
                            <div className="mb-10">
                                {equipmentData.items.map((unit, index) => (
                                    hasActiveLoan = unit.activeLoan != null,
                                        <div key={unit.id} className="flex items-center justify-between bg-brand-200 rounded-md p-1 mb-3">
                                            <h1 className="font-bold text-xl text-black">Unit {index + 1}</h1>
                                            { unit.activeLoan && (unit.activeLoan.status !== "Returned") && <h1 className="text-black font-bold">Borrowed</h1>}
                                            { (unit.activeLoan == null || unit.activeLoan.status === "Returned") && <button
                                                className="bg-white h-8 w-8 border-black border-1 rounded-full flex items-center justify-center"
                                                onClick={() => setSelectedUnit(unit)}>
                                                <div className={selectedUnit == unit ? "bg-blue-600 h-4 w-4 rounded-full" : ""}></div>
                                            </button>}

                                        </div>
                                )) }
                            </div>
                        </div> */}
                    </div>

                    {/* Right side of panel */}
                    <div className="flex-1 bg-brand-950 rounded-r-lg p-2">
                        <div className="flex justify-end">
                            <button className="bg-red-600 w-11 h-11 rounded-full font-bold" onClick={() => setSideView("")}>X</button>
                        </div>
                        <div className="ml-7 mt-10">
                            {/*<div className="font-bold text-2xl mb-5">
                                <h1>{equipmentData.name}</h1>
                                <h1>{equipmentData.category.name}</h1>
                                <h1>{equipmentData.items.length - loanCount(equipmentData)}/{equipmentData.items.length} Available</h1>
                            </div> */}
                            <span>----------------------------------------------------------------------------------</span>
                            <h1 className="font-bold text-4xl mt-5">History</h1>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}