'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { checklists } from '@/lib/checklist-data';

export const Sidebar: React.FC = () => {
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path;

    return (
        <aside className="w-64 bg-card-bg border-r border-border h-screen sticky top-0 flex flex-col">
            <div className="p-6 border-b border-border">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-olive rounded-lg flex items-center justify-center text-white font-bold">
                        G
                    </div>
                    <div>
                        <h1 className="font-bold text-sm leading-tight">GMP Tracker</h1>
                        <p className="text-[10px] text-text-muted uppercase tracking-widest font-bold">Compliance</p>
                    </div>
                </div>
            </div>

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                <Link
                    href="/"
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${pathname === '/'
                            ? 'bg-olive text-white font-medium'
                            : 'text-text-secondary hover:bg-border/30 hover:text-text-primary'
                        }`}
                >
                    <span>🏠</span>
                    Dashboard
                </Link>

                <div className="pt-4 pb-2">
                    <p className="px-3 text-[10px] font-bold text-text-muted uppercase tracking-widest">Checklists</p>
                </div>

                {checklists.map((checklist) => (
                    <Link
                        key={checklist.id}
                        href={`/checklist/${checklist.id}`}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${pathname === `/checklist/${checklist.id}`
                                ? 'bg-olive text-white font-medium'
                                : 'text-text-secondary hover:bg-border/30 hover:text-text-primary'
                            }`}
                    >
                        <span className="text-base">{checklist.icon}</span>
                        <span className="truncate">{checklist.name}</span>
                    </Link>
                ))}
            </nav>

            <div className="p-4 border-t border-border mt-auto">
                <div className="p-3 bg-background rounded-lg border border-border/50 text-center">
                    <p className="text-[10px] text-text-muted uppercase font-bold mb-1">Deadline</p>
                    <p className="text-xs font-bold text-error">March 4, 2026</p>
                </div>
            </div>
        </aside>
    );
};
