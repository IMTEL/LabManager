type Category = {
    id: number;
    name: string;
}

interface CategoryButtonProps {
    filters: string[];
    selected: string | null;
    onSelect: (filter: string | null) => void;
}

export default function CategoryButton({ filters, selected, onSelect }: CategoryButtonProps) {
    return(
        <div className={`bg-brand-200 rounded-md flex gap-1`}>
            { filters.map((filter, index) => (
                <button key={filter} onClick={() => onSelect(selected === filter ? null : filter)} className={`bg-brand-950 flex-1 pt-2 pb-2 ${selected === filter ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800 hover:bg-gray-200" }`}>{filter}</button>
            ))}

        </div>
    )
}