'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface AppState {
    completedItems: string[];
    statuses: Record<string, 'have' | 'partial' | 'need'>;
    notes: Record<string, string>;
}

const STORAGE_KEY = 'gmp-compliance-tracker-v2';

const defaultState: AppState = {
    completedItems: [],
    statuses: {},
    notes: {},
};

export function useAppProgress() {
    const [state, setState] = useState<AppState>(defaultState);
    const [isLoaded, setIsLoaded] = useState(false);

    // Initial Fetch from Supabase
    useEffect(() => {
        const fetchRemote = async () => {
            try {
                const { data, error } = await supabase
                    .from('gmp_progress')
                    .select('*');

                if (error) {
                    console.warn('Could not fetch from Supabase. Using localStorage.', error);
                    // Fallback to local
                    const saved = localStorage.getItem(STORAGE_KEY);
                    if (saved) setState(JSON.parse(saved));
                } else if (data) {
                    const remoteState: AppState = {
                        completedItems: data.filter(item => item.is_complete).map(item => item.item_id),
                        statuses: data.reduce((acc, item) => ({ ...acc, [item.item_id]: item.status }), {}),
                        notes: data.reduce((acc, item) => ({ ...acc, [item.item_id]: item.notes }), {}),
                    };
                    setState(remoteState);
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(remoteState));
                }
            } catch (err) {
                console.error('Supabase fetch error:', err);
            } finally {
                setIsLoaded(true);
            }
        };

        fetchRemote();

        // Real-time Subscription
        const channel = supabase
            .channel('gmp_changes')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'gmp_progress' },
                (payload) => {
                    const p = payload.new as any;
                    const oldP = payload.old as any;

                    if (payload.event === 'DELETE') {
                        const itemId = (payload.old as any).item_id;
                        setState(prev => ({
                            ...prev,
                            completedItems: prev.completedItems.filter(id => id !== itemId),
                        }));
                        return;
                    }

                    setState(prev => {
                        const newState = { ...prev };
                        if (p.is_complete) {
                            if (!newState.completedItems.includes(p.item_id)) {
                                newState.completedItems = [...newState.completedItems, p.item_id];
                            }
                        } else {
                            newState.completedItems = newState.completedItems.filter(id => id !== p.item_id);
                        }
                        newState.statuses = { ...newState.statuses, [p.item_id]: p.status };
                        newState.notes = { ...newState.notes, [p.item_id]: p.notes };
                        return newState;
                    });
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const saveItem = async (id: string, updates: Partial<{ is_complete: boolean; status: string; notes: string }>) => {
        // Optimistic UI Update is handled by setState in the individual functions

        try {
            // For notes, we might want to debounce in the UI, but here we at least handle the upsert
            const { error } = await supabase
                .from('gmp_progress')
                .upsert({
                    item_id: id,
                    ...updates,
                    updated_at: new Date().toISOString()
                }, {
                    onConflict: 'item_id'
                });

            if (error) throw error;
        } catch (err) {
            console.error('Failed to sync with cloud:', err);
        }
    };

    const toggleComplete = (id: string, completed: boolean) => {
        setState(prev => {
            const newCompleted = completed
                ? Array.from(new Set([...prev.completedItems, id]))
                : prev.completedItems.filter(item => item !== id);

            const newState = { ...prev, completedItems: newCompleted };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
            return newState;
        });
        saveItem(id, { is_complete: completed });
    };

    const updateStatus = (id: string, status: 'have' | 'partial' | 'need') => {
        setState(prev => {
            const newState = { ...prev, statuses: { ...prev.statuses, [id]: status } };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
            return newState;
        });
        saveItem(id, { status });
    };

    // Use a ref to track the latest notes to avoid closure issues with debounce
    const [pendingNotes, setPendingNotes] = useState<Record<string, string>>({});

    useEffect(() => {
        const timer = setTimeout(() => {
            Object.entries(pendingNotes).forEach(([id, notes]) => {
                saveItem(id, { notes });
            });
            setPendingNotes({});
        }, 1000); // 1 second debounce

        return () => clearTimeout(timer);
    }, [pendingNotes]);

    const updateNotes = (id: string, notes: string) => {
        // Immediate UI Update
        setState(prev => {
            const newState = { ...prev, notes: { ...prev.notes, [id]: notes } };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
            return newState;
        });
        // Queue for debounced save
        setPendingNotes(prev => ({ ...prev, [id]: notes }));
    };

    const resetAll = async () => {
        if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
            try {
                const { error } = await supabase
                    .from('gmp_progress')
                    .delete()
                    .neq('item_id', 'placeholder'); // Delete all

                if (error) throw error;
                setState(defaultState);
                localStorage.removeItem(STORAGE_KEY);
            } catch (err) {
                alert('Reset failed. Please try again.');
            }
        }
    };

    return {
        state,
        isLoaded,
        toggleComplete,
        updateStatus,
        updateNotes,
        resetAll,
    };
}
