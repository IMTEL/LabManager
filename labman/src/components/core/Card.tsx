import Button from "./Button"

interface CardProps {
    type: string;
    name: string;
    start: string,
    latestActivity: string;
}

export default function Card({ type, name, start, latestActivity}: CardProps) {

    return(
        <div className="bg-brand-950 border-white border-[1px] rounded-[18px] w-[293]">
            <div className="border-b-white border-b-[1px]">
                <h1 className="text-4xl font-bold pl-3 pt-2.5">{name}</h1>
            </div>

            <div className="pl-3 pt-2.5 pb-2.5">
                <h1 className="text-2xl">Type: </h1>
                <h1 className="text-2xl">Start: {start}</h1>
                <h1 className="text-2xl">Latest Activity: {latestActivity}</h1>
            </div>
            <div className="ml-50 mb-3 mt-5">
                < Button type="deleteUser" username={name} />
            </div>

        </div>
    )
}