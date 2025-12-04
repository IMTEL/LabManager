interface EditFieldProps {
    type? : string;
    value : string;
}

export default function EditField({ value}: EditFieldProps) {


    return (
        <div className="bg-brand-950 rounded-md p-2 flex items-center justify-between">
            <h1 className="text-2xl font-bold">{value}</h1>
            <button className="bg-blue-600 font-bold text-black h-8 w-8 rounded-full p-1">|</button>
        </div>
    )

}