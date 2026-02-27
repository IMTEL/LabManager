import {Equipment} from "@/types/inventory";

interface ItemListProps {
    equipmentData: Equipment;
}

export default function ItemList({ equipmentData } : ItemListProps) {
    return(
        <div>
            <h1 className="font-bold text-4xl mt-5 mb-3">Items</h1>
            <div className="item-view">
                <div className="mb-10">
                    {equipmentData.items.map((unit, index) => (
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
            </div>
        </div>
    )
}