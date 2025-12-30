'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { checklists } from '@/lib/checklist-data';
import { useAppProgress } from '@/hooks/use-app-progress';
import { RequirementCard } from '@/components/RequirementCard';
import { ProgressCard } from '@/components/ProgressCard';

export default function ChecklistPage() {
    const { id } = useParams();
    const router = useRouter();
    const { state, isLoaded, toggleComplete, updateStatus, updateNotes } = useAppProgress();

    const checklist = checklists.find(c => c.id === id);

    if (!checklist || !isLoaded) {
        return (
            <div className="p-12 text-center">
                <p className="text-text-secondary">Loading checklist or item not found...</p>
            </div>
        );
    }

    const requirements = checklist.sections.flatMap(s => s.requirements);
    const completedCount = requirements.filter(req =>
        state.completedItems.includes(req.id)
    ).length;
    const totalCount = requirements.length;

    return (
        <div className="p-4 md:p-8 max-w-4xl mx-auto">
            <header className="mb-10 pt-4 md:pt-0">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-border/50 pb-8">
                    <div>
                        <div className="flex items-center gap-4 mb-2">
                            <span className="text-4xl">{checklist.icon}</span>
                            <h1 className="text-3xl font-bold text-text-primary">{checklist.name}</h1>
                        </div>
                        <p className="text-text-secondary">{checklist.description}</p>
                    </div>
                    <div className="text-right min-w-[200px] w-full md:w-auto">
                        <ProgressCard completed={completedCount} total={totalCount} label="Checklist Progress" />
                    </div>
                </div>
            </header>

            <div className="space-y-12">
                {checklist.sections.map((section, sIdx) => (
                    <div key={sIdx}>
                        <div className="flex items-center gap-3 mb-6">
                            <div className={`w-2 h-2 rounded-full shrink-0 ${section.color === 'error' ? 'bg-error' :
                                section.color === 'warning' ? 'bg-warning' : 'bg-blue'
                                }`} />
                            <h2 className={`text-[11px] font-bold uppercase tracking-[0.2em] ${section.color === 'error' ? 'text-error' :
                                section.color === 'warning' ? 'text-warning' : 'text-blue'
                                }`}>
                                {section.title}
                            </h2>
                        </div>
                        <div className="space-y-4">
                            {section.requirements.map((req) => (
                                <RequirementCard
                                    key={req.id}
                                    requirement={req}
                                    isComplete={state.completedItems.includes(req.id)}
                                    status={state.statuses[req.id] || 'need'}
                                    notes={state.notes[req.id] || ''}
                                    onCompleteChange={(val) => toggleComplete(req.id, val)}
                                    onStatusChange={(val) => updateStatus(req.id, val)}
                                    onNotesChange={(val) => updateNotes(req.id, val)}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {totalCount === 0 && (
                <div className="p-12 text-center bg-card-bg border border-dashed border-border rounded-xl">
                    <p className="text-text-muted">No requirements defined for this section yet.</p>
                </div>
            )}
        </div>
    );
}
