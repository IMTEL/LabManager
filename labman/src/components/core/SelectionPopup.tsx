import {useState, useRef} from "react";
import search from "@/utils/search"
import {CategorySuggestion} from "@/types/inventory";


interface SelectionPopupProps {
    categories: string[];
    currentCategory: string;
    updateCategory: (currentCategory: string) => void;
    onAiClick: () => Promise<CategorySuggestion[] | string>;
}

export default function SelectionPopup({ categories, currentCategory, updateCategory, onAiClick} : SelectionPopupProps) {
    const [isOpen, setIsOpen] = useState(false);
    // filtered categories and ai suggested categories are separated into two separate arrays, this is because I want categories to be kept as a simple array of strings to be easily comptatible with stuff like searh.
    // aiSuggestions has the same content but is an array of objects that contains the name of the category and a boolean that indicates if the category already exists, which can be used to identify the status of the suggestion.
    const [filteredCategories, setFilteredCategories] = useState(categories);
    const [aiSuggestions, setAiSuggestions] = useState<CategorySuggestion[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);

    const toggle = () => setIsOpen(!isOpen);

    function searchCategories(searchTerm: string) {
        console.log(searchTerm);
        setFilteredCategories(search(categories, searchTerm));

        console.log(filteredCategories);
    }

    async function handleAiClick() {
        const response = await onAiClick()
        // If there are no suggestions onAiClick will return a string with a message instead of an array
        if (response instanceof Array) {
            setFilteredCategories(response.map(category => category.name));
            setAiSuggestions(response);
            inputRef.current!.focus();
        } else {
            alert(response);
        }
    }

    function handleButtonClick(category: string) {
        console.log("clicked");
        updateCategory(category);
        toggle();
        inputRef.current!.blur();

    }

    function checkExistence(category: string) : boolean {
        // The AI is prompted to prefer existing categories but when it suggests a new category, it will be marked as "New" in the dropdown.
        const suggestion = aiSuggestions.find((suggestion) => suggestion.name === category);
        if (suggestion) {
            return suggestion.alreadyExists;
        } else {
            return true;
        }
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
                        <li key={category} onMouseDown={(e) => { e.preventDefault(); handleButtonClick(category)}} className={`category-dropdown-item ${category === currentCategory ? "filter-dropdown-item-selected" : ""}`}>{category} {!checkExistence(category) ? "| New" : ""}</li>
                    ))}
                </ul>
            )}
            <button onClick={handleAiClick} className={"bg-blue-300 button"}>Generate Suggestions</button>

        </div>


    )
}