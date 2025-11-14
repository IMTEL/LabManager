"use client"
import { useState, useEffect} from "react";

type Equipment = {
    id: number;
    name: string;
    category: {
        id: number;
        name: string;
    }
    items: {
        id: number;
    }[]
}

interface AddLoanProps {
    unitId: number;
}

export default function AddLoan({unitId} : AddLoanProps) {
    const [equipmentData, setEquipmentData] = useState<Equipment>(null);

    // Fetch equipment data based on unitId
    useEffect(() => {
        console.log(unitId);
        fetch(`/api/equipment/loan?id=${unitId}`)
        .then(res => res.json())
        .then(data => setEquipmentData(data))
        .catch(err => console.error(err));
    }, [unitId]);

    // Render loading state while equipment data is being fetched
    if (!equipmentData) return <div>Loading...</div>;

    return(
        <div className="bg-brand-950 h-screen w-[400px]">
            <div className="border-b-white border-b-[1px]">
                <h1 className="text-3xl font-bold pt-4 pl-2 pb-5">New loan</h1>
            </div>



        </div>
    )
}