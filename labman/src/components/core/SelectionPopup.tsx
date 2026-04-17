import {useState, useRef} from "react";
import search from "@/utils/search"

interface SelectionPopupProps {
    categories: string[];
    currentCategory: string;
    updateCategory: (currentCategory: string) => void;
    onAiClick: () => Promise<string[] | string>;
}

export default function SelectionPopup({ categories, currentCategory, updateCategory, onAiClick} : SelectionPopupProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [filteredCategories, setFilteredCategories] = useState(categories);
    const inputRef = useRef<HTMLInputElement>(null);

    const toggle = () => setIsOpen(!isOpen);

    function searchCategories(searchTerm: string) {
        console.log(searchTerm);
        setFilteredCategories(search(categories, searchTerm));

        console.log(filteredCategories);
    }

    async function handleAiClick() {
        const aiTags = await onAiClick()
        if (aiTags instanceof Array) {
            setFilteredCategories(aiTags)
            console.log(filteredCategories);
            inputRef.current!.focus();
        } else {
            alert(aiTags);
        }
    }

    function handleButtonClick(category: string) {
        console.log("clicked");
        updateCategory(category);
        toggle();
        inputRef.current!.blur();

    }

    return(

        <div>
            <input value={currentCategory} type="text" name="category" placeholder="Category" autoComplete="off" ref={inputRef} className="bg-white rounded-md p-2 m-2 placeholder-black text-black" onFocus={toggle} onBlur={toggle}  onChange={(e) => {updateCategory(e.target.value); searchCategories(e.target.value);}} />

            {isOpen && (
                <ul className="category-dropdown">
                    {(!categories.find((category) => category === currentCategory) && currentCategory.trim() !== "") && (
                        <li className={"category-dropdown-item"} onMouseDown={(e) => { e.preventDefault(); handleButtonClick(currentCategory)}}>Create new category: {currentCategory}</li>
                    )}
                    {filteredCategories.map((category) => (
                        <li key={category} onMouseDown={(e) => { e.preventDefault(); handleButtonClick(category)}} className={`category-dropdown-item ${category === currentCategory ? "filter-dropdown-item-selected" : ""}`}>{category}</li>
                    ))}
                </ul>
            )}
            <button onClick={handleAiClick} className={"bg-blue-300 button"}>Generate Suggestions</button>

        </div>


    )
}