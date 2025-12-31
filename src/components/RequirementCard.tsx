'use client';

import React, { useState, useEffect } from 'react';
import { Requirement } from '@/lib/checklist-data';
import { StatusBadge } from './StatusBadge';
import { useDiscussion } from '@/context/DiscussionContext';
import { supabase } from '@/lib/supabase';

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
    const [lastMessages, setLastMessages] = useState<any[]>([]);
    const { openDiscussion } = useDiscussion();

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'text-error';
            case 'medium': return 'text-warning';
            case 'low': return 'text-blue';
            default: return 'text-text-muted';
        }
    };

    // Fetch last 2 messages for preview
    useEffect(() => {
        if (!isExpanded) return;

        const fetchLastMessages = async () => {
            const { data, error } = await supabase
                .from('gmp_messages')
                .select('*')
                .eq('item_id', requirement.id)
                .order('created_at', { ascending: false })
                .limit(2);

            if (data && !error) {
                setLastMessages(data.reverse());
            }
        };

        fetchLastMessages();

        // Real-time update for preview
        const channel = supabase
            .channel(`preview_${requirement.id}`)
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'gmp_messages', filter: `item_id=eq.${requirement.id}` },
                (payload) => {
                    setLastMessages(prev => {
                        const next = [...prev, payload.new];
                        return next.length > 2 ? next.slice(-2) : next;
                    });
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [isExpanded, requirement.id]);

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
                    <div className="flex items-center gap-4 mb-2">
                        <div className="flex-1">
                            <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2">Implementation Status</p>
                            <div className="flex gap-2">
                                {(['have', 'partial', 'need'] as const).map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => onStatusChange(s)}
                                        className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-all border ${status === s
                                                ? s === 'have' ? 'bg-success text-white border-success' :
                                                    s === 'partial' ? 'bg-warning text-white border-warning' :
                                                        'bg-error text-white border-error'
                                                : 'bg-white text-text-muted border-border hover:border-text-muted'
                                            }`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {requirement.description && (
                        <div className="rounded-lg border border-border/50 overflow-hidden bg-white shadow-sm">
                            <div className="bg-slate-50/50 px-4 py-2 border-b border-border/50 flex items-center gap-2">
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
                        <div className="rounded-lg border border-border/50 overflow-hidden bg-white shadow-sm">
                            <div className="bg-slate-50/50 px-4 py-2 border-b border-border/50 flex justify-between items-center">
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
                            <div className="p-4 bg-slate-50/10">
                                <p className="text-sm italic text-text-secondary leading-relaxed">
                                    "{requirement.regulatoryQuote}"
                                </p>
                            </div>
                        </div>
                    )}

                    {requirement.tables && requirement.tables.map((table, tIdx) => (
                        <div key={tIdx} className="rounded-lg border border-border/50 overflow-hidden bg-white shadow-sm">
                            <div className="bg-slate-50/50 px-4 py-2 border-b border-border/50 flex items-center gap-2">
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
                            <div className="p-4 bg-success/5 rounded-lg border border-success/20 relative overflow-hidden group/example shadow-sm">
                                <div className="absolute top-0 left-0 w-0.5 h-full bg-success opacity-40" />
                                <span className="text-[10px] font-bold text-success uppercase tracking-widest block mb-1">✓ Compliant</span>
                                <p className="text-xs text-text-secondary leading-relaxed">{requirement.compliantExample}</p>
                            </div>
                        )}
                        {requirement.nonCompliantExample && (
                            <div className="p-4 bg-error/5 rounded-lg border border-error/20 relative overflow-hidden group/example shadow-sm">
                                <div className="absolute top-0 left-0 w-0.5 h-full bg-error opacity-40" />
                                <span className="text-[10px] font-bold text-error uppercase tracking-widest block mb-1">✗ Non-Compliant</span>
                                <p className="text-xs text-text-secondary leading-relaxed">{requirement.nonCompliantExample}</p>
                            </div>
                        )}
                    </div>

                    <div className="rounded-lg border border-border/50 overflow-hidden bg-white shadow-sm">
                        <div className="bg-slate-50/50 px-4 py-2 border-b border-border/50 flex items-center gap-2">
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
                        <div className="rounded-lg border border-border transition-all shadow-sm">
                            <div className="bg-slate-50/50 px-4 py-2 border-b border-border flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-0.5 h-3 bg-slate-400 rounded-full" />
                                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
                                        📝 Discussion Preview
                                    </span>
                                </div>
                                <button
                                    onClick={() => openDiscussion(requirement.id, requirement.title)}
                                    className="p-1.5 text-olive hover:bg-olive/10 transition-all rounded-md flex items-center gap-1.5 group font-bold text-[10px] uppercase tracking-wider"
                                    title="Open Full Chat"
                                >
                                    <span>Expand Discussion</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18 6-6-6-6" /><path d="M3 12h18" /></svg>
                                </button>
                            </div>
                            <div className="p-4 bg-white min-h-[100px] flex flex-col justify-center gap-4">
                                {lastMessages.length === 0 ? (
                                    <p className="text-xs text-text-muted italic text-center py-4">No recent messages. Click 'Expand Discussion' to start the conversation.</p>
                                ) : (
                                    lastMessages.map((msg, mIdx) => (
                                        <div key={mIdx} className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-[11px] text-text-primary">{msg.user_name}</span>
                                                <span className="text-[9px] text-text-muted">({new Date(msg.created_at).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })})</span>
                                            </div>
                                            <p className="text-xs text-text-secondary pl-3 border-l-2 border-border/60">{msg.message}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
