'use client';

import React from 'react';

interface ProgressCardProps {
    completed: number;
    total: number;
    label?: string;
    className?: string;
}

export const ProgressCard: React.FC<ProgressCardProps> = ({ completed, total, label, className = '' }) => {
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return (
        <div className={`w-full ${className}`}>
            <div className="flex justify-between items-end mb-1.5 gap-4">
                {label && <span className="text-base font-semibold text-text-primary tracking-tight whitespace-nowrap truncate">{label}</span>}
                <span className="text-sm font-medium text-text-muted/80 whitespace-nowrap shrink-0">{completed}/{total} ({percentage}%)</span>
            </div>
            <div className="w-full bg-border/40 rounded-full h-2 overflow-hidden border border-border/10">
                <div
                    className="bg-blue h-full transition-all duration-700 ease-out"
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
};
