type Unit = {
    id: number;
}

interface ItemProps {
    name: string;
    category: string;
    units: Unit[];
    selectedUnit: number | null;
    setSelectedUnit: (unit: number | null) => void;
}

export default function Item({ name, category, units, selectedUnit, setSelectedUnit }: ItemProps) {
    return(
        <>
            <div className="bg-brand-950 pt-5 pb-5 pl-5 mt-5 border-white border-[1px] rounded-md">
                <div className="grid grid-cols-5">
                    <h1 className="font-bold text-2xl">{name}</h1>
                    <h1 className="text-2xl">{category}</h1>
                </div>
            </div>

            {units.map((unit, index) => (
                console.log(unit, index, units.length),
                <div key={unit.id} className={`bg-brand-950 pt-3 pb-3 pl-3 ${index == 0 ? "mt-10" : "mt-5"} ${index + 1 == units.length ? "mb-10" : "" } border-white border-[1px] rounded-md`}>
                    <div className="grid grid-cols-30">
                        <button onClick={() => setSelectedUnit(selectedUnit === unit.id ? null : unit.id)} className="bg-white w-6 h-6 rounded-sm flex items-center justify-center">
                            <div className={`${selectedUnit === unit.id ? "bg-blue-600 w-5 h-5 rounded-sm" : ""}`}></div>
                        </button>
                        <h1 className="">Unit {index + 1}</h1>
                    </div>

                </div>
            ))}
        </>
    )
}