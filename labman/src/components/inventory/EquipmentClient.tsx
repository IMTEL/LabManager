"use client"
import { useState, useEffect } from "react";
import Item from "@/components/inventory/Item";
import CategoryButton from "@/components/inventory/CategoryButton";
import {deleteEquipment} from "@/lib/actions";
import AddLoan from "@/components/inventory/AddLoan";
import SortIcon from "@/components/inventory/sortIcon";

type Equipment = {
    id: number;
    name: string;
    category: {
        id: number;
        name: string;
    }
    createdAt: Date;
    items: {
        id: number;
    }[]
}

type SortDirection = "asc" | "desc" | null;
type SortColumn = "name" | "category" | "stock" | "date" | null;

interface EquipmentClientProps {
    equipmentList: Equipment[]
}

export default function EquipmentClient({equipmentList}: EquipmentClientProps) {
    // Correct date format for equipment, to convert it to an actual date object.
    const datedEquipmentList = equipmentList.map(e => ({
        ...e,
        createdAt: new Date(e.createdAt)
    }));

    const [allEquipment, setAllEquipment] = useState(datedEquipmentList);
    //const [filteredEquipment, setFilteredEquipment] = useState<Equipment[]>(equipmentList.equipmentList);
    const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
    // Equipment form
    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    const [image, setImage] = useState("");

    // Unit selection
    // The first index is the db id, the second is the index in the actual UI. This is used to identify the correct equipment while also having an index that is sensible to the user.
    const [selectedUnit, setSelectedUnit] = useState<number[] | null>([0, 0]);
    const [loanView, setLoanView] = useState<boolean>(false);

    const [sort, setSort] = useState<{ column: SortColumn, direction: SortDirection}>({
        column: null,
        direction: null
    })

    // Filtering and sorting equipment
    const filteredEquipment = (selectedFilter ? allEquipment.filter((e) => e.category.name === selectedFilter) : allEquipment)
        .sort((a, b) => {
            if (!sort.column || !sort.direction) return a.name.localeCompare(b.name)

            switch (sort.column) {
                case "name":
                    return sort.direction === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);

                case "category":
                    return sort.direction === "asc" ? a.category.name.localeCompare(b.category.name) : b.category.name.localeCompare(a.category.name);

                case "stock":
                    return sort.direction === "asc" ? a.items.length - b.items.length : b.items.length - a.items.length;

                case "date":
                    return sort.direction === "asc" ? a.createdAt.getTime() - b.createdAt.getTime() : b.createdAt.getTime() - a.createdAt.getTime();

                default: return 0;
            }
        })

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

    // Find the equipment in the state instead of using a slower database lookup
    function findEquipment(unitId: number) {
        return datedEquipmentList.find(equipment => equipment.items.some(item => item.id === unitId));
    }

    function toggleSort(column: SortColumn) {
        console.log(sort.column, sort.direction)
        setSort((prev) => {
            if (prev.column !== column) {
                return {column, direction: "asc"}
            }
            if (prev.direction === "asc") {
                return {column, direction: "desc"}
            }
            return {column: null, direction: null}
        })
    }

    return(
        <>
            <div className="flex">
                <main className={`flex-1 mr-5`}>

                    <form onSubmit={handleSubmit}>
                        <input value={name} onChange={(e) => setName(e.target.value)} type="text" name="name" placeholder="Name" className="bg-white rounded-md p-2 m-2 placeholder-black text-black" />
                        <input value={category} onChange={(e) => setCategory(e.target.value)} type="text" name="category" placeholder="Category" className="bg-white rounded-md p-2 m-2 placeholder-black text-black" />
                        <input value={image} onChange={(e) => setImage(e.target.value)} type="text" name="image" placeholder="Image" className="bg-white rounded-md p-2 m-2 placeholder-black text-black" />
                        <button type="submit">Add Equipment</button>
                    </form>

                    <div className="grid grid-cols-2 mt-10 mb-5">
                        <CategoryButton filters={[...new Set(datedEquipmentList.map((e) => e.category.name))]} selected={selectedFilter} onSelect={setSelectedFilter} />
                        <button className="filter-clear-button" onClick={() => setSelectedFilter(null)}>Clear filter</button>
                    </div>


                    <div className="bg-brand-500 pb-3 pt-3 rounded-[5px] grid grid-cols-4">
                        <button className="sorting-button pl-3" onClick={() => toggleSort("name")}>Equipment name  <SortIcon direction={sort.column === "name" ? sort.direction : null} /></button>
                        <button className="sorting-button" onClick={() => toggleSort("category")}>Category  <SortIcon direction={sort.column === "category" ? sort.direction : null} /></button>
                        <button className="sorting-button" onClick={() => toggleSort("stock")}>Stock  <SortIcon direction={sort.column === "stock" ? sort.direction : null} /></button>
                        <button className="sorting-button" onClick={() => toggleSort("date")}>Date added <SortIcon direction={sort.column === "date" ? sort.direction : null} /></button>
                    </div>

                    {filteredEquipment.map((equipment) => {

                        return (
                            <Item
                                key={equipment.id}
                                name={equipment.name}
                                category={equipment.category.name}
                                creationDate={equipment.createdAt}
                                units={equipment.items}
                                selectedUnit={selectedUnit}
                                setSelectedUnit={setSelectedUnit}
                                deleteEquipment={handleDeleteEquipment}
                            />
                        );
                    })}

                    <h1>Selected Unit: {selectedUnit?.[0]}</h1>
                    <button disabled={!selectedUnit} onClick={() => setLoanView(true)} >New loan</button>
                </main>

                <aside>
                    {selectedUnit && loanView && <AddLoan equipmentData={findEquipment(selectedUnit?.[0])} unitId={selectedUnit?.[1]} />}
                </aside>
            </div>
        </>
    )
}