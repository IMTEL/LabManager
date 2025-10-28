interface ItemProps {
    name: string;
    category: string;
}

export default function Item({ name, category }: ItemProps) {
    return(
        <div className="bg-brand-950 pt-5 pb-5 pl-5 mt-5 border-white border-[1px] rounded-md">
            <div className="grid grid-cols-5">
                <h1 className="font-bold text-2xl">{name}</h1>
                <h1 className="text-2xl">{category}</h1>
            </div>

        </div>
    )
}