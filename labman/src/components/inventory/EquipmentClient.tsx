"use client"
import {useState} from "react";
import Item from "@/components/inventory/Item";
import CategoryButton from "@/components/inventory/CategoryButton";
import SortIcon from "@/components/inventory/sortIcon";
import EquipmentInfo from "@/components/inventory/EquipmentInfo";
import LoanView from "@/components/inventory/LoanView";
import {Equipment} from "@/types/inventory";
import {useSideView} from "@/app/sideViewContext";
import SelectionPopup from "@/components/core/SelectionPopup";
import {deleteEquipment} from "@/lib/actions/inventoryActions";
import {aiCategories} from "@/lib/actions/aiActions"


type SortDirection = "asc" | "desc" | null;
type SortColumn = "name" | "category" | "stock" | "date" | null;

interface EquipmentClientProps {
    equipmentList: Equipment[]
}

export default function EquipmentClient({equipmentList}: EquipmentClientProps) {
    // Correct date format for equipment to convert it to an actual date object.
    const datedEquipmentList = equipmentList.map(e => ({
        ...e,
        createdAt: new Date(e.createdAt)
    }));

    const [allEquipment, setAllEquipment] = useState(datedEquipmentList);
    // const [filteredEquipment, setFilteredEquipment] = useState<Equipment[]>(equipmentList.equipmentList);
    const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
    // Equipment form
    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    const [image, setImage] = useState("");

    const [selectedEquipment, setSelectedEquipment ] = useState<Equipment | null>(null);
    const { sideView, setSideView } = useSideView();

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
        if (!name || !category) return;
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
        const result = await res.json();

        if (result.type === "success") {
            const newEquipment = result.data

            setAllEquipment(prev => [...prev, newEquipment]);
            setName("")
            setCategory("")
            setImage("")

        } else {
            alert(result.message || "Failed to add equipment")
        }
    }

    async function handleDeleteEquipment(name: string) {
        const userConfirmation = confirm("Are you sure you want to delete " + name + "?");
        if (!userConfirmation) return

        setAllEquipment(prev => prev.filter(e => e.name !== name));
        await deleteEquipment(name);

    }

    function toggleSort(column: SortColumn) {
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

    async function handleAiCategories() : Promise<string | string[]> {
        if (!name) return "Please enter the equipment name first";
       const response = await aiCategories(name);
       if (response.type === "success") {
           return response.data
       } else {
           return response.message
       }
    }

    return(
        <>

            <div className="flex">

                <main className={`flex-1 mr-5`}>

                    { sideView == "eqInfo" && selectedEquipment && <EquipmentInfo
                        equipmentData={selectedEquipment}
                        allEquipment={allEquipment}
                        setAllEquipment={setAllEquipment}
                        setSelectedEquipment={setSelectedEquipment}
                        deleteEquipment={handleDeleteEquipment} />}

                    { sideView == "loanView" && selectedEquipment && <LoanView
                        equipmentData={selectedEquipment}
                        setAllEquipment={setAllEquipment}
                        setSelectedEquipment={setSelectedEquipment} />}

                    <div className={"mb-13 mt-3 p-3 w-fit rounded-md bg-brand-500  border-brand-950"}>
                        <h1 className={"text-4xl font-bold mb-3 w-fit"}>Add equipment</h1>
                        <form className={"w-fit"} onSubmit={handleSubmit}>
                            <input value={name} onChange={(e) => setName(e.target.value)} type="text" name="name" placeholder="Name" className="bg-white rounded-md p-2 m-2 placeholder-black text-black" />
                            {/* <input value={image} onChange={(e) => setImage(e.target.value)} type="text" name="image" placeholder="Image" className="bg-white rounded-md p-2 m-2 placeholder-black text-black" /> */}
                            <button type="submit" className={"button bg-green-500"}>Add Equipment</button>
                        </form>
                        <SelectionPopup categories={[...new Set(allEquipment.map((e) => e.category.name))]} currentCategory={category} updateCategory={setCategory} onAiClick={handleAiCategories} />
                    </div>


                    <div className="grid grid-cols-2 mt-10 mb-5">
                        <CategoryButton filters={[...new Set(allEquipment.map((e) => e.category.name))]} selected={selectedFilter} onSelect={setSelectedFilter} />
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
                                equipment={equipment}
                                name={equipment.name}
                                category={equipment.category.name}
                                creationDate={equipment.createdAt}
                                setSelectedEquipment={setSelectedEquipment}
                                deleteEquipment={handleDeleteEquipment}
                            />
                        );
                    })}
                </main>

                <aside>

                </aside>
            </div>
        </>
    )
}