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
                return 'bg-success/20 text-success border-success/30';
            case 'partial':
                return 'bg-warning/20 text-warning border-warning/30';
            case 'need':
                return 'bg-error/20 text-error border-error/30';
            default:
                return 'bg-text-muted/20 text-text-muted border-text-muted/30';
        }
    };

    return (
        <select
            value={status}
            onChange={(e) => onChange(e.target.value as any)}
            className={`px-3 py-1 rounded text-xs font-medium border cursor-pointer outline-none transition-colors ${getStatusStyles()}`}
        >
            <option value="have" className="bg-card-bg text-success">Have</option>
            <option value="partial" className="bg-card-bg text-warning">Partial</option>
            <option value="need" className="bg-card-bg text-error">Need</option>
        </select>
    );
};
