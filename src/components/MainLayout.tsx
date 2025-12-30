'use client';

import React, { useState } from 'react';
import { Sidebar } from "@/components/Sidebar";

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen relative">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <main className="flex-1 overflow-x-hidden">
                {/* Mobile Header */}
                <div className="lg:hidden sticky top-0 left-0 right-0 h-14 bg-card-bg/80 backdrop-blur-md border-b border-border z-30 flex items-center px-4">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 text-text-muted hover:text-olive transition-colors"
                        aria-label="Open menu"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" /></svg>
                    </button>
                    <div className="ml-2 font-black text-[10px] text-text-muted uppercase tracking-[0.2em]">Compliance Checklists</div>
                </div>

                <div className="min-h-screen">
                    {children}
                </div>
            </main>
        </div>
    );
};
