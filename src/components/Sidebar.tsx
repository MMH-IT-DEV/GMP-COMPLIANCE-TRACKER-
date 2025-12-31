'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { checklists } from '@/lib/checklist-data';
import { useAppProgress } from '@/hooks/use-app-progress';

interface SidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
    const pathname = usePathname();
    const { state, isLoaded } = useAppProgress();

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            <aside className={`
                fixed inset-y-0 left-0 z-50 w-64 bg-card-bg border-r border-border h-screen flex flex-col transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="p-4 flex-1 overflow-y-auto">
                    <div className="pb-4">
                        <p className="px-3 text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Compliance Checklists</p>
                    </div>

                    <nav className="space-y-1">
                        {checklists.map((checklist) => {
                            const requirements = checklist.sections.flatMap(s => s.requirements);
                            const completedCount = requirements.filter(req =>
                                state.completedItems.includes(req.id)
                            ).length;
                            const totalCount = requirements.length;
                            const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

                            return (
                                <Link
                                    key={checklist.id}
                                    href={`/checklist/${checklist.id}`}
                                    onClick={onClose}
                                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all group ${pathname === `/checklist/${checklist.id}`
                                        ? 'bg-olive text-white font-medium shadow-sm'
                                        : 'text-text-secondary hover:bg-border/30 hover:text-text-primary'
                                        }`}
                                >
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <span className="text-base shrink-0">{checklist.icon}</span>
                                        <span className="truncate">{checklist.name}</span>
                                    </div>
                                    {isLoaded && percentage > 0 && (
                                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${pathname === `/checklist/${checklist.id}`
                                            ? 'bg-white/20 text-white'
                                            : 'bg-olive/10 text-olive'
                                            }`}>
                                            {percentage}%
                                        </span>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="p-4 border-t border-border mt-auto">
                    <div className="p-3 bg-background rounded-lg border border-border/50 text-center">
                        <p className="text-[10px] text-text-muted uppercase font-bold mb-1">Deadline</p>
                        <p className="text-xs font-bold text-error">March 4, 2026</p>
                    </div>
                </div>
            </aside>
        </>
    );
};
