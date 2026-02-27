"use client";
import {useEffect, useState} from "react";
import {addUnit, deleteUnit, updateEquipment} from "@/lib/actions";
import {Equipment} from "@/types/inventory";
import {loanCount} from "@/utils/inventoryUtils";
import SideView from "@/components/core/SideView/SideView";

type Unit = {
    id: number;
    equipmentId: number;
    status: string;
    createdAt: Date;
    notes: string[];
    errors: string[];
    loanId: number | null;
};

interface EquipmentInfoProps {
    equipmentData: Equipment;
    allEquipment: Equipment[];
    setAllEquipment: React.Dispatch<React.SetStateAction<Equipment[]>>;
    setSelectedEquipment: (equipment: Equipment | null) => void;
    deleteEquipment: (name: string) => void;
}

export default function EquipmentInfo({equipmentData, setAllEquipment, setSelectedEquipment, deleteEquipment}: EquipmentInfoProps) {


    const [initialFormData, setInitialFormData] = useState({name: equipmentData?.name, category: equipmentData?.category.name, image: equipmentData?.image})
    const [formData, setFormData] = useState(initialFormData);

    // The initial data has to be updated when the equipmentData changes
    // TODO: Possible optimization? Unnecessary use of useEffect
    useEffect(() => {
        if (!equipmentData) return;

        setInitialFormData({name: equipmentData.name, category: equipmentData.category.name, image: equipmentData.image})
    }, [equipmentData]);

    async function handleAddUnit(name?: string) {
        if (!name) return;
        const newUnit = await addUnit(name);
        if (!newUnit) return;

        const updatedEquipment = {
            ...equipmentData,
            items: [...(equipmentData.items ?? []), newUnit]
        };


        setAllEquipment(prev =>
            prev.map(eq =>
                eq.id === updatedEquipment.id ? updatedEquipment : eq
            )
        );

        setSelectedEquipment(updatedEquipment)
    }

    async function handleDeleteUnit(id: number) {
       // setUnits(units.filter((unit) => unit.id !== id));

        const updatedEquipment = {
            ...equipmentData,
            items: [...(equipmentData.items ?? [])].filter(unit => unit.id !== id)
        }

        setAllEquipment(prev =>
            prev.map(eq =>
                eq.id === updatedEquipment.id ? updatedEquipment : eq
            )
        )

        setSelectedEquipment(updatedEquipment)

        await deleteUnit(id);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        // Check so required fields are not empty (image is optional)
        if (!formData.name?.trim() || !formData.category?.trim()) {
            alert("Please fill in all fields");
            setFormData(initialFormData);
            return;
        }

        if (JSON.stringify(formData) === JSON.stringify(initialFormData)) return;


      const updatedEq = await updateEquipment(equipmentData!.id, formData.name!, formData.category!, formData.image!)

      const updatedEquipment = {
          ...equipmentData,
          name: updatedEq.name,
          category: {
              id: updatedEq.category.id,
              name: updatedEq.category.name
          },
          image: updatedEq.image,
          categoryId: updatedEq.categoryId

      }

      setAllEquipment(prev =>
        prev.map(eq => eq.id === updatedEquipment.id ? updatedEquipment : eq))

      setSelectedEquipment(updatedEquipment);
    }

    let hasActiveLoan = false;

    return (
        <SideView title={"Equipment info"} equipmentData={equipmentData}>
            <>
                <div className="mt-7 mb-10">
                    <button form="equipmentDataForm" type="submit" className={ JSON.stringify(formData) === JSON.stringify(initialFormData) ? " bg-blue-600 mr-2 button-deactive" : "bg-blue-600 button mr-2"}>Save changes</button>
                    <button onClick={() => {setFormData(initialFormData)}} className={JSON.stringify(formData) === JSON.stringify(initialFormData) ? "bg-yellow-500 button-deactive mr-10" : "bg-yellow-500 button mr-10"}>Undo</button>
                    <button className="bg-red-600 button">Delete equipment</button>
                </div>

                <div className="mb-25">
                    <form id="equipmentDataForm" onSubmit={handleSubmit}>
                        <label className="side-form-label">Name:</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="side-form-input" />
                        <label className="side-form-label">Category:</label>
                        <input
                            type="text"
                            value={formData.category}
                            onChange={(e) => setFormData({...formData, category: e.target.value})}
                            className="side-form-input" />
                        {/*<label className="side-form-label">Image:</label>
                                <input
                                   type="text"
                                   value={formData.image}
                                   onChange={(e) => setFormData({...formData, image: e.target.value})}
                                   className="side-form-input" /> */}
                    </form>
                </div>
            </>
        </SideView>
    );
}