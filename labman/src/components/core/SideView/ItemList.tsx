import {Equipment, Unit} from "@/types/inventory";
import {useRef} from "react";
import {useEffect} from "react";

type BaseProps = {
    equipmentData: Equipment;
}

type SelectableProps = BaseProps & {
     variant: "selectable";
     selectedUnit: Unit | undefined;
     setSelectedUnit: (unit: Unit) => void;
}

type SelectableEditProps = BaseProps & {
    variant: "selectableEdit";
    selectedUnit: Unit | undefined;
    setSelectedUnit: (unit: Unit) => void;
}

type editableProps = BaseProps & {
    variant: "editable";
    handleAddUnit: (name: string) => void;
    handleDeleteUnit: (id: number) => void;
 }

 type Props = SelectableProps | editableProps | SelectableEditProps;

export default function ItemList(props: Props) {

    // The initially selected unit has to persist between renders but uses to useEffect to update when the loan changes
    let selectedUnitRef : React.RefObject<number | undefined>;

    if (props.variant === "selectableEdit") {
        selectedUnitRef = useRef(props.selectedUnit?.id);

        useEffect(() => {
            selectedUnitRef.current = props.selectedUnit?.id;
        }, [props.equipmentData])
    }


    return(
        <div>
            <h1 className="font-bold text-4xl mt-5 mb-3">Items</h1>
            <div className="item-view">
                { props.variant === "editable" && <button className="button bg-green-500 mb-10" onClick={() => props.handleAddUnit(props.equipmentData.name)}>Add unit</button>}
                <div className="mt-2">
                    {props.equipmentData.items.map((unit, index) => (
                        <div key={unit.id} className="flex items-center justify-between bg-brand-200 rounded-md p-1 mb-3">
                                <h1 className={ props.variant === "selectableEdit" && unit.id === selectedUnitRef.current ? "font-bold text-xl text-blue-600" : "font-bold text-xl text-black"}>{unit.id}</h1>
                                {(() => {
                                    switch (props.variant) {
                                        case "editable":
                                            return (
                                                <>
                                                    { unit.activeLoan && unit.activeLoan.status !== "Returned" && <h1 className="text-black font-bold">Borrowed</h1>}
                                                    {(unit.activeLoan == null || unit.activeLoan.status === "Returned") &&
                                                        <button
                                                            className="text-black font-bold rounded-full h-7 w-7 bg-red-600 border border-black"
                                                            onClick={() => props.handleDeleteUnit(unit.id)}>-
                                                        </button>}
                                                </>

                                            )
                                        case "selectable":
                                            return (
                                                <>
                                                    { unit.activeLoan && (unit.activeLoan.status !== "Returned") && <h1 className="text-black font-bold">Borrowed</h1>}
                                                    { (unit.activeLoan == null || unit.activeLoan.status === "Returned") && <button
                                                        className="bg-white h-8 w-8 border-black border-1 rounded-full flex items-center justify-center"
                                                        onClick={() => props.setSelectedUnit(unit)}>
                                                        <div className={props.selectedUnit?.id == unit.id ? "bg-blue-600 h-4 w-4 rounded-full" : ""}></div>
                                                    </button>}
                                                </>
                                            )
                                        case "selectableEdit":
                                            return (
                                                <>
                                                    { unit.activeLoan && (unit.activeLoan.status !== "Returned" && unit.id !== selectedUnitRef.current) && <h1 className="text-black font-bold">Borrowed</h1>}
                                                    { (unit.activeLoan == null || unit.activeLoan.status === "Returned" || unit.id == selectedUnitRef.current) && <button
                                                        className="bg-white h-8 w-8 border-black border-1 rounded-full flex items-center justify-center"
                                                        onClick={() => props.setSelectedUnit(unit)}>
                                                        <div className={props.selectedUnit?.id == unit.id ? "bg-blue-600 h-4 w-4 rounded-full" : ""}></div>
                                                    </button>}
                                                </>

                                            )
                                    }
                                })()}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}