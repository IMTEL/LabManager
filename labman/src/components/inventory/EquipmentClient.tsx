"use client"
import { useState, useEffect } from "react";
import Item from "@/components/inventory/Item";
import CategoryButton from "@/components/inventory/CategoryButton";
import {deleteEquipment} from "@/lib/actions";
import AddLoan from "@/components/inventory/AddLoan";

type Equipment = {
    id: number;
    name: string;
    category: {
        id: number;
        name: string;
    }
    items: {
        id: number;
    }[]
}

interface EquipmentClientProps {
    equipmentList: Equipment[]
}

export default function EquipmentClient(equipmentList: EquipmentClientProps) {
    // Equipment and category filters
    const [allEquipment, setAllEquipment] = useState(equipmentList.equipmentList);
    //const [filteredEquipment, setFilteredEquipment] = useState<Equipment[]>(equipmentList.equipmentList);
    const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
    // Equipment form
    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    const [image, setImage] = useState("");

    // Unit selection
    const [selectedUnit, setSelectedUnit] = useState<number | null>(null);
    const [loanView, setLoanView] = useState<boolean>(false);

    // Filtering equipment based on selected category
    const filteredEquipment = selectedFilter
        ? allEquipment.filter((e) => e.category.name === selectedFilter)
        : allEquipment;


    // Adding equipment to the database based on form input
    async function handleSubmit(e: React.FormEvent) {
        if (!name || !category || !image) return;
        e.preventDefault();

        const res = await fetch("/api/equipment", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                category,
                image
            })
        })
        // Adding the new equipment to the state
        const newEquipment = await res.json();

        setAllEquipment(prev => [...prev, newEquipment]);
        setName("")
        setCategory("")
        setImage("")

    }

    async function handleDeleteEquipment(name: string) {
        setAllEquipment(prev => prev.filter(e => e.name !== name));
        await deleteEquipment(name);

    }

    return(
        <>
            <div className="flex">
                <main className={`flex-1 mr-5 mt-5`}>
                    <form onSubmit={handleSubmit}>
                        <input value={name} onChange={(e) => setName(e.target.value)} type="text" name="name" placeholder="Name" className="bg-white rounded-md p-2 m-2 placeholder-black text-black" />
                        <input value={category} onChange={(e) => setCategory(e.target.value)} type="text" name="category" placeholder="Category" className="bg-white rounded-md p-2 m-2 placeholder-black text-black" />
                        <input value={image} onChange={(e) => setImage(e.target.value)} type="text" name="image" placeholder="Image" className="bg-white rounded-md p-2 m-2 placeholder-black text-black" />
                        <button type="submit">Add Equipment</button>
                    </form>

                    <CategoryButton filters={[...new Set(allEquipment.map((e) => e.category.name))]} selected={selectedFilter} onSelect={setSelectedFilter} />

                    {filteredEquipment.map((equipment) => (
                        <Item key={equipment.id} name={equipment.name} category={equipment.category.name} units={equipment.items} selectedUnit={selectedUnit} setSelectedUnit={setSelectedUnit} deleteEquipment={handleDeleteEquipment} />
                    ))}

                    <h1>Selected Unit: {selectedUnit}</h1>
                    <button disabled={!selectedUnit} onClick={() => setLoanView(true)} >New loan</button>
                </main>

                <aside>
                    {selectedUnit && loanView && <AddLoan unitId={selectedUnit} />}
                </aside>

            </div>
        </>
    )
}