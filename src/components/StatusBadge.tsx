'use client';

import React from 'react';

interface StatusBadgeProps {
    status: 'have' | 'partial' | 'need';
    onChange: (status: 'have' | 'partial' | 'need') => void;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, onChange }) => {
    const getStatusStyles = () => {
        switch (status) {
            case 'have':
                return 'bg-success/15 text-success border-success/20';
            case 'partial':
                return 'bg-warning/15 text-warning border-warning/20';
            case 'need':
                return 'bg-error/15 text-error border-error/20';
            default:
                return 'bg-slate-100 text-slate-500 border-slate-200';
        }
    };

    return (
        <div className="relative group/status">
            <select
                value={status}
                onChange={(e) => onChange(e.target.value as 'have' | 'partial' | 'need')}
                className={`appearance-none pl-4 pr-10 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider border cursor-pointer outline-none transition-all ${getStatusStyles()}`}
            >
                <option value="have" className="bg-white text-success">Have</option>
                <option value="partial" className="bg-white text-warning">Partial</option>
                <option value="need" className="bg-white text-error">Need</option>
            </select>
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-current opacity-60">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
            </div>
        </div>
    );
};
