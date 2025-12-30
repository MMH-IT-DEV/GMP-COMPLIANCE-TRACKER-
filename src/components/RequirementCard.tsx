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
        <div className={`border rounded-lg mb-4 overflow-hidden transition-all duration-300 ${isComplete
            ? 'border-success/30 bg-success/[0.02]'
            : 'border-border bg-card-bg'
            }`}>
            <div className="p-4 flex items-start gap-4">
                <div className="relative mt-1.5 shrink-0">
                    <input
                        type="checkbox"
                        checked={isComplete}
                        onChange={(e) => onCompleteChange(e.target.checked)}
                        className="peer appearance-none w-5 h-5 rounded-[4px] border border-border bg-card-bg checked:bg-success checked:border-success transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-success/50"
                    />
                    <svg
                        className="absolute top-1 left-1 w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                </div>

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
                            <button
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="text-text-muted hover:text-text-primary transition-colors p-1"
                            >
                                {isExpanded ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6" /></svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {isExpanded && (
                <div className="px-6 pb-6 border-t border-border/50 bg-slate-50/5 pt-6 space-y-6">
                    {requirement.description && (
                        <div className="rounded-lg border border-border/50 overflow-hidden bg-white">
                            <div className="bg-slate-50 px-4 py-2 border-b border-border/50 flex items-center gap-2">
                                <div className="w-0.5 h-3 bg-blue rounded-full" />
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                    💡 What This Means
                                </span>
                            </div>
                            <div className="p-4">
                                <p className="text-sm text-text-secondary leading-relaxed">
                                    {requirement.description}
                                </p>
                            </div>
                        </div>
                    )}

                    {requirement.regulatoryQuote && (
                        <div className="rounded-lg border border-border/50 overflow-hidden bg-white">
                            <div className="bg-slate-50 px-4 py-2 border-b border-border/50 flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <div className="w-0.5 h-3 bg-terracotta rounded-full" />
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                        📜 Regulatory Quote
                                    </span>
                                </div>
                                <a href={requirement.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] font-bold text-blue hover:text-blue/80 uppercase tracking-widest bg-blue/5 px-2 py-0.5 rounded transition-colors">
                                    {requirement.source} ↗
                                </a>
                            </div>
                            <div className="p-4 bg-slate-50/20">
                                <p className="text-sm italic text-text-secondary leading-relaxed">
                                    "{requirement.regulatoryQuote}"
                                </p>
                            </div>
                        </div>
                    )}

                    {requirement.tables && requirement.tables.map((table, tIdx) => (
                        <div key={tIdx} className="rounded-lg border border-border/50 overflow-hidden bg-white">
                            <div className="bg-slate-50 px-4 py-2 border-b border-border/50 flex items-center gap-2">
                                <div className="w-0.5 h-3 bg-olive rounded-full" />
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{table.title}</span>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs">
                                    <thead>
                                        <tr className="bg-slate-50/30">
                                            {table.headers.map((header, hIdx) => (
                                                <th key={hIdx} className="px-4 py-2.5 font-bold text-slate-500 border-b border-border/50 uppercase text-[9px] tracking-wider">{header}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/40">
                                        {table.rows.map((row, rIdx) => (
                                            <tr key={rIdx} className="hover:bg-slate-50/30 transition-colors">
                                                {row.map((cell, cIdx) => (
                                                    <td key={cIdx} className="px-4 py-3 text-text-secondary whitespace-pre-wrap leading-relaxed">{cell}</td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ))}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {requirement.compliantExample && (
                            <div className="p-4 bg-success/5 rounded-lg border border-success/20 relative overflow-hidden group/example">
                                <div className="absolute top-0 left-0 w-0.5 h-full bg-success opacity-40" />
                                <span className="text-[10px] font-bold text-success uppercase tracking-widest block mb-1">✓ Compliant</span>
                                <p className="text-xs text-text-secondary leading-relaxed">{requirement.compliantExample}</p>
                            </div>
                        )}
                        {requirement.nonCompliantExample && (
                            <div className="p-4 bg-error/5 rounded-lg border border-error/20 relative overflow-hidden group/example">
                                <div className="absolute top-0 left-0 w-0.5 h-full bg-error opacity-40" />
                                <span className="text-[10px] font-bold text-error uppercase tracking-widest block mb-1">✗ Non-Compliant</span>
                                <p className="text-xs text-text-secondary leading-relaxed">{requirement.nonCompliantExample}</p>
                            </div>
                        )}
                    </div>

                    <div className="rounded-lg border border-border/50 overflow-hidden bg-white">
                        <div className="bg-slate-50 px-4 py-2 border-b border-border/50 flex items-center gap-2">
                            <div className="w-0.5 h-3 bg-warning rounded-full" />
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                📋 Evidence Needed
                            </span>
                        </div>
                        <div className="p-4">
                            <ul className="space-y-2">
                                {requirement.evidenceNeeded.map((item, idx) => (
                                    <li key={idx} className="text-xs text-text-secondary flex items-start gap-3">
                                        <div className="mt-1.5 w-1 h-1 rounded-full bg-slate-300 shrink-0" />
                                        <span className="leading-relaxed">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="pt-2">
                        <div className="rounded-lg border border-border/50 overflow-hidden bg-white focus-within:ring-1 focus-within:ring-olive/20 transition-all">
                            <div className="bg-slate-50 px-4 py-2 border-b border-border/50 flex items-center gap-2">
                                <div className="w-0.5 h-3 bg-slate-300 rounded-full" />
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                    📝 Notes
                                </span>
                            </div>
                            <textarea
                                value={notes}
                                onChange={(e) => onNotesChange(e.target.value)}
                                placeholder="Add your progress notes here..."
                                className="w-full bg-white border-none p-4 text-sm text-text-primary focus:ring-0 outline-none h-32 resize-none transition-all placeholder:text-text-muted/40"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
