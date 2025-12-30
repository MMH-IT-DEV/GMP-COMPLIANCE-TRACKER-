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
            <div className="flex justify-between items-center mb-1">
                {label && <span className="text-sm font-medium text-text-secondary">{label}</span>}
                <span className="text-xs text-text-muted">{completed}/{total} ({percentage}%)</span>
            </div>
            <div className="w-full bg-border/30 rounded-full h-2 overflow-hidden">
                <div
                    className="bg-olive h-full transition-all duration-500 ease-out"
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
};
