"use client"
import { useState, useEffect } from "react";
import Item from "@/components/inventory/Item";
import CategoryButton from "@/components/inventory/CategoryButton";

type Equipment = {
    id: number;
    name: string;
    category: {
        id: number;
        name: string;
    }
}

interface EquipmentClientProps {
    equipmentList: Equipment[]
}

export default function EquipmentClient(equipmentList: EquipmentClientProps) {
    const [allEquipment, setAllEquipment] = useState(equipmentList.equipmentList);
    const [filteredEquipment, setFilteredEquipment] = useState<Equipment[]>(equipmentList.equipmentList);
    const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    const [image, setImage] = useState("");

    useEffect(() => {
        if (!selectedFilter) {
            setFilteredEquipment(allEquipment);
        } else {
            setFilteredEquipment(allEquipment.filter((e) => e.category.name === selectedFilter))
        }
    }, [selectedFilter, allEquipment]);

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

        const newEquipment = await res.json();

        setAllEquipment(prev => [...prev, newEquipment]);
        setName("")
        setCategory("")
        setImage("")

    }


    return(
        <div>
            <form onSubmit={handleSubmit}>
                <input value={name} onChange={(e) => setName(e.target.value)} type="text" name="name" placeholder="Name" className="bg-white rounded-md p-2 m-2 placeholder-black text-black" />
                <input value={category} onChange={(e) => setCategory(e.target.value)} type="text" name="category" placeholder="Category" className="bg-white rounded-md p-2 m-2 placeholder-black text-black" />
                <input value={image} onChange={(e) => setImage(e.target.value)} type="text" name="image" placeholder="Image" className="bg-white rounded-md p-2 m-2 placeholder-black text-black" />
                <button type="submit">Add User</button>

            </form>

            <CategoryButton filters={[...new Set(allEquipment.map((e) => e.category.name))]} selected={selectedFilter} onSelect={setSelectedFilter} />
            {filteredEquipment.map((equipment) => (
                <Item key={equipment.id} name={equipment.name} category={equipment.category.name} />
            ))}
        </div>
    )
}