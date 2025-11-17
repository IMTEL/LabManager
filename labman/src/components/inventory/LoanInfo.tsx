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

interface LoanInfoProps {
    equipmentData?: Equipment;
    unitId: number;
}

export default function LoanInfo({equipmentData, unitId} : LoanInfoProps) {

    return(
        <div className="bg-brand-500 rounded-[18px] w-[293] text-white">
            <div className="border-b-white border-b-[2px]">
                <h1 className="text-3xl font-bold pl-3 pt-2.5">{equipmentData?.name}</h1>
                <h1 className="text-2xl font-bold pl-3 pt-2.5">Unit {unitId}</h1>

            </div>

            <div className="pl-3 pt-2.5 pb-2.5">
                <h1 className="text-2xl">Type: </h1>
                <h1 className="text-2xl">Start:</h1>
                <h1 className="text-2xl">Latest Activity:</h1>
            </div>
            <div className="ml-50 mb-3 mt-5">

            </div>

        </div>
    )
}