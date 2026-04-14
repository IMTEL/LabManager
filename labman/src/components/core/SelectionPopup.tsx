import {useState} from "react";

interface SelectionPopupProps {
    categories: string[];
    selected: string;
    onSelect: (selected: string) => void;
}

export default function SelectionPopup({ categories, selected, onSelect} : SelectionPopupProps) {
    const [isOpen, setIsOpen] = useState(false);

    const toggle = () => setIsOpen(!isOpen);

    return(

        <div>
            <input value={selected} type="text" name="category" placeholder="Category" className="bg-white rounded-md p-2 m-2 placeholder-black text-black" onClick={toggle} />

            {isOpen && (
                <ul className="filter-dropdown">
                    {categories.map((category) => (
                        <li key={category} onClick={() => { onSelect(category); toggle(); }} className={`filter-dropdown-item ${category === selected ? "filter-dropdown-item-selected" : ""}`}>{category}</li>
                    ))}
                </ul>
            )}

        </div>


    )
}