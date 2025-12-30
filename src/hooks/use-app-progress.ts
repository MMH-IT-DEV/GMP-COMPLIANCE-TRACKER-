'use client';

import { useState, useEffect } from 'react';

export interface AppState {
    completedItems: string[];
    statuses: Record<string, 'have' | 'partial' | 'need'>;
    notes: Record<string, string>;
}

const STORAGE_KEY = 'gmp-compliance-tracker';

const defaultState: AppState = {
    completedItems: [],
    statuses: {},
    notes: {},
};

export function useAppProgress() {
    const [state, setState] = useState<AppState>(defaultState);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setState(JSON.parse(saved));
            } catch (err) {
                console.error('Failed to parse progress', err);
            }
        }
        setIsLoaded(true);
    }, []);

    const saveState = (newState: AppState) => {
        setState(newState);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
    };

    const toggleComplete = (id: string, completed: boolean) => {
        const newCompleted = completed
            ? [...state.completedItems, id]
            : state.completedItems.filter(item => item !== id);

        saveState({
            ...state,
            completedItems: Array.from(new Set(newCompleted)),
        });
    };

    const updateStatus = (id: string, status: 'have' | 'partial' | 'need') => {
        saveState({
            ...state,
            statuses: { ...state.statuses, [id]: status },
        });
    };

    const updateNotes = (id: string, notes: string) => {
        saveState({
            ...state,
            notes: { ...state.notes, [id]: notes },
        });
    };

    const resetAll = () => {
        if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
            saveState(defaultState);
        }
    };

    const exportData = () => {
        const data = JSON.stringify(state, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const date = new Date().toISOString().split('T')[0];
        a.href = url;
        a.download = `gmp-compliance-progress-${date}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const importData = (file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target?.result as string);
                saveState(data);
                window.location.reload();
            } catch {
                alert('Invalid backup file');
            }
        };
        reader.readAsText(file);
    };

    return {
        state,
        isLoaded,
        toggleComplete,
        updateStatus,
        updateNotes,
        resetAll,
        exportData,
        importData,
    };
}
