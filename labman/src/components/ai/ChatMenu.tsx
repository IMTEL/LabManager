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
                {messages.map(message => (
                    <div key={message.id}>
                        {message.role === 'user' ? 'User: ' : 'AI: '}
                        {message.parts.map((part, index) => {
                            switch (part.type) {
                                case 'text':
                                    return part.text

                                case "tool-getAllEquipment":
                                    const callId = part.toolCallId;
                                    console.log("Tool getAllEquipment")
                                    switch (part.state) {
                                        case "output-available":
                                            return (
                                                <div key={callId}>
                                                    List of equipment: {part.output}
                                                </div>
                                            )
                                    }
                            }
                        })}
                    </div>
                ))}

                <form
                    onSubmit={e => {
                        e.preventDefault();
                        if (input.trim()) {
                            sendMessage({ text: input });
                            setInput('');
                        }
                    }}
                >
                    <input
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        disabled={status !== 'ready'}
                        placeholder="Say something..."
                    />
                    <button type="submit" disabled={status !== 'ready'}>
                        Submit
                    </button>
                </form>
            </div>
        </>
    )
}