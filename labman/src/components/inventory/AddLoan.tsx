"use client"
import LoanInfo from "@/components/inventory/LoanInfo";

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
    equipmentData?: Equipment;
}

export default function AddLoan({equipmentData, unitId} : AddLoanProps) {

    return(
        <div className="bg-brand-950 h-screen w-[400px]">
            <div className="border-b-white border-b-[1px]">
                <h1 className="text-3xl font-bold pt-4 pl-2 pb-5">New loan</h1>
            </div>

            <div className="mt-5 ml-5">
            < LoanInfo equipmentData={equipmentData} unitId={unitId} />
            </div>




        </div>
    )
}