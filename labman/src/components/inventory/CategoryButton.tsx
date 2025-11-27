"use client"

import {useState} from "react";

interface CategoryButtonProps {
    filters: string[];
    selected: string | null;
    onSelect: (filter: string | null) => void;
}

export default function CategoryButton({ filters, selected, onSelect }: CategoryButtonProps) {
    const [isOpen, setIsOpen] = useState(false);

    const toggle = () => setIsOpen(!isOpen);

    return(

        <div>
            <button className="filter-button" onClick={toggle}>
                {selected ? selected : "Category"}
                <svg width="35" height="25" viewBox="2 6 20 20" className="">
                    <path d="M12 19L16 15H8L12 19Z" fill="currentColor" />
                </svg>
            </button>

            {isOpen && (
                <ul className="filter-dropdown">
                    {filters.map((filter) => (
                        <li key={filter} onClick={() => { onSelect(filter); toggle(); }} className={`filter-dropdown-item ${filter === selected ? "filter-dropdown-item-selected" : ""}`}>{filter}</li>
                    ))}
                </ul>
            )}

        </div>


    )
}