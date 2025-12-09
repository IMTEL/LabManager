import {useState} from "react";

type Equipment = {
    id: number;
    name: string;
    image: string;
    category: {
        id: number;
        name: string;
    }
    createdAt: Date;
    items: {
        id: number;
    }[]
}

interface EllipsisProps {
    equipment: Equipment;
    setSelectedEquipment: (equipment: Equipment | null) => void;
    setSideView: (view: string) => void;
    deleteEquipment: (name: string) => void;
}

export default function Ellipsis({equipment, setSelectedEquipment, setSideView, deleteEquipment}: EllipsisProps) {
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(!isOpen);
// TODO: Find a way to ensure that only one dropdown is open at a time


    return (
        <div>
            <button className="hover:cursor-pointer" onClick={toggle}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                     stroke="currentColor" className="size-10">
                    <path strokeLinecap="round" strokeLinejoin="round"
                          d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"/>
                </svg>
            </button>
            {isOpen && (
                <div className="bg-white rounded-md absolute right-5 text-black">
                    <p onClick={() => {setSideView("loanView"); setSelectedEquipment(equipment)}} className="filter-dropdown-item">New Loan</p>
                    <p onClick={() => {setSelectedEquipment(equipment); setSideView("eqInfo"); toggle()}} className="filter-dropdown-item">Edit</p>
                    <p onClick={() => {deleteEquipment(equipment.name); toggle()}} className="filter-dropdown-item">Delete</p>
                </div>
            )}
        </div>



    )
}