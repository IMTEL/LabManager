"use client";

import React, { createContext, useContext, useState } from "react";

type SideViewCtx = {
    sideView: string;
    setSideView: React.Dispatch<React.SetStateAction<string>>;
};

const SideViewContext = createContext<SideViewCtx | null>(null);

export function SideViewProvider({ children, initialType = "",}: { children: React.ReactNode; initialType?: string; }) {
    const [sideView, setSideView] = useState(initialType);

    return (
        <SideViewContext.Provider value={{ sideView, setSideView }}>
            {children}
        </SideViewContext.Provider>
    );
}

export function useSideView() {
    const ctx = useContext(SideViewContext);
    if (!ctx) throw new Error("useString must be used within <SideViewProvider>");
    return ctx;
}