import {useState} from "react";
import search from "@/utils/search"

interface SelectionPopupProps {
    categories: string[];
    selected: string;
    onSelect: (selected: string) => void;
    onAiClick: () => void;
}

export default function SelectionPopup({ categories, selected, onSelect, onAiClick} : SelectionPopupProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [filteredCategories, setFilteredCategories] = useState(categories);

    const toggle = () => setIsOpen(!isOpen);

    function searchCategories() {
        setFilteredCategories(search(categories, selected));

        console.log(filteredCategories);
    }

    return(

        <div>
            <input value={selected} type="text" name="category" placeholder="Category" autoComplete="off" className="bg-white rounded-md p-2 m-2 placeholder-black text-black" onFocus={toggle} onChange={(e) => {onSelect(e.target.value); searchCategories();}} />

            {isOpen && (
                <ul className="filter-dropdown">
                    {(!categories.find((category) => category === selected) && selected.trim() !== "") && (
                        <li className={"filter-dropdown-item"} onClick={() => {onSelect(selected); toggle();}}>Create new category: {selected}</li>
                    )}
                    {filteredCategories.map((category) => (
                        <li key={category} onClick={() => { onSelect(category); toggle(); }} className={`filter-dropdown-item ${category === selected ? "filter-dropdown-item-selected" : ""}`}>{category}</li>
                    ))}
                </ul>
            )}
            <button onClick={onAiClick} className={"bg-blue-300 w-5 h-5"}></button>

        </div>


    )
}