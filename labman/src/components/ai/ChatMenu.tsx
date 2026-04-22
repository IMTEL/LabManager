import {loanCount} from "@/utils/inventoryUtils";

interface ChatMenuProps {
    setIsOpen: (isOpen: boolean) => void;
}

export default function ChatMenu({ setIsOpen }: ChatMenuProps) {

    return (
        <>
            {/* Dark backdrop */}
            <div
                className="fixed inset-0 bg-black/70 z-40"
                onClick={() => setIsOpen(false)}
            />

            {/* Right-side panel */}
            <div className="fixed top-5 bottom-5 right-0 h-screen w-275 bg-brand-500 shadow-xl z-50 mr-5 rounded-lg flex flex-col ">
                <div>Hello</div>
            </div>
        </>
    )
}