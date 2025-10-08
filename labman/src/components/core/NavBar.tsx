import Button from "@/components/core/Button";

export default function NavBar({ username }: { username: string | null }) {
    return(
        <div className="flex justify-between items-center border-b-white border-b-[1px] mb-6">
            <h1 className="pl-4 pt-4 pb-2 font-bold text-5xl">Users</h1>
            <div className="flex items-center">
                <div className="mr-8 pt-4">
                    < Button type="logout" />
                </div>

                <p className="pr-4 pt-7 font-bold text-2xl">{username || "Not logged in"}</p>
            </div>
        </div>
    )
}