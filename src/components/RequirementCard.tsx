'use client';

import React, { useState } from 'react';
import { Requirement } from '@/lib/checklist-data';
import { StatusBadge } from './StatusBadge';

interface RequirementCardProps {
    requirement: Requirement;
    status: 'have' | 'partial' | 'need';
    notes: string;
    isComplete: boolean;
    onStatusChange: (status: 'have' | 'partial' | 'need') => void;
    onNotesChange: (notes: string) => void;
    onCompleteChange: (complete: boolean) => void;
}

export const RequirementCard: React.FC<RequirementCardProps> = ({
    requirement,
    status,
    notes,
    isComplete,
    onStatusChange,
    onNotesChange,
    onCompleteChange,
}) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'text-error';
            case 'medium': return 'text-warning';
            case 'low': return 'text-blue';
            default: return 'text-text-muted';
        }
    };

    return (
        <div className={`border rounded-lg mb-4 overflow-hidden transition-all duration-200 ${isComplete ? 'border-olive/50 bg-olive/5' : 'border-border bg-card-bg'}`}>
            <div className="p-4 flex items-start gap-4">
                <input
                    type="checkbox"
                    checked={isComplete}
                    onChange={(e) => onCompleteChange(e.target.checked)}
                    className="mt-1.5 w-5 h-5 rounded border-border bg-transparent text-olive focus:ring-olive transition-all cursor-pointer"
                />

                <div className="flex-1">
                    <div className="flex justify-between items-start gap-2">
                        <div>
                            <h3 className={`font-semibold ${isComplete ? 'text-olive' : 'text-text-primary'}`}>
                                {requirement.title}
                                <span className={`ml-2 text-[10px] uppercase font-bold tracking-wider ${getPriorityColor(requirement.priority)}`}>
                                    {requirement.priority}
                                </span>
                            </h3>
                            <p className="text-sm text-text-secondary mt-1">{requirement.subtitle}</p>
                        </div>

                        <div className="flex items-center gap-3">
                            <StatusBadge status={status} onChange={onStatusChange} />
                            <button
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="text-text-muted hover:text-text-primary transition-colors p-1"
                            >
                                {isExpanded ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6" /></svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {isExpanded && (
                <div className="px-4 pb-4 border-t border-border/50 bg-background/30 pt-4 space-y-4">
                    <div className="p-4 bg-background rounded border border-border/30">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-xs font-bold text-text-muted uppercase tracking-wider">📜 Regulatory Quote</span>
                            <a href={requirement.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue hover:underline">
                                {requirement.source} ↗
                            </a>
                        </div>
                        <p className="text-sm italic text-text-secondary leading-relaxed">
                            {requirement.regulatoryQuote}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-3 bg-success/5 rounded border border-success/20">
                            <span className="text-xs font-bold text-success uppercase tracking-wider block mb-1">✓ Compliant Example</span>
                            <p className="text-xs text-text-secondary">{requirement.compliantExample}</p>
                        </div>
                        <div className="p-3 bg-error/5 rounded border border-error/20">
                            <span className="text-xs font-bold text-error uppercase tracking-wider block mb-1">✗ Non-Compliant Example</span>
                            <p className="text-xs text-text-secondary">{requirement.nonCompliantExample}</p>
                        </div>
                    </div>

                    <div>
                        <span className="text-xs font-bold text-text-muted uppercase tracking-wider block mb-2">📋 Evidence Needed</span>
                        <ul className="space-y-1">
                            {requirement.evidenceNeeded.map((item, idx) => (
                                <li key={idx} className="text-xs text-text-secondary flex items-start gap-2">
                                    <span className="text-olive text-[10px] mt-1">•</span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <span className="text-xs font-bold text-text-muted uppercase tracking-wider block mb-1">📝 Notes</span>
                        <textarea
                            value={notes}
                            onChange={(e) => onNotesChange(e.target.value)}
                            placeholder="Add your progress notes here..."
                            className="w-full bg-background border border-border rounded p-2 text-sm text-text-primary focus:border-olive focus:ring-1 focus:ring-olive outline-none h-20 resize-none"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};
