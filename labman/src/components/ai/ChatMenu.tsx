"use client"

import {useState} from "react";
import {useChat} from "@ai-sdk/react"
import {DefaultChatTransport} from "ai";

interface ChatMenuProps {
    setIsOpen: (isOpen: boolean) => void;
}

export default function ChatMenu({ setIsOpen }: ChatMenuProps) {
    const { messages, sendMessage, status } = useChat({
        transport: new DefaultChatTransport({
            api: '/api/chat'
        }),
    });
    const [input, setInput] = useState("");

    return (
        <>
            {/* Dark backdrop */}
            <div
                className="fixed inset-0 bg-black/70 z-40"
                onClick={() => setIsOpen(false)}
            />

            <div className="fixed top-5 bottom-5 right-0 h-screen w-275 bg-brand-500 shadow-xl z-50 mr-5 rounded-lg flex flex-col ">
                <div>Hello</div>
            </div>
        </>
    )
}