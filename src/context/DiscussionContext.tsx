'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface DiscussionContextType {
    activeItemId: string | null;
    isOpen: boolean;
    openDiscussion: (itemId: string, title: string) => void;
    closeDiscussion: () => void;
    activeItemTitle: string | null;
}

const DiscussionContext = createContext<DiscussionContextType | undefined>(undefined);

export function DiscussionProvider({ children }: { children: ReactNode }) {
    const [activeItemId, setActiveItemId] = useState<string | null>(null);
    const [activeItemTitle, setActiveItemTitle] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    const openDiscussion = (itemId: string, title: string) => {
        setActiveItemId(itemId);
        setActiveItemTitle(title);
        setIsOpen(true);
    };

    const closeDiscussion = () => {
        setIsOpen(false);
    };

    return (
        <DiscussionContext.Provider value={{ activeItemId, isOpen, openDiscussion, closeDiscussion, activeItemTitle }}>
            {children}
        </DiscussionContext.Provider>
    );
}

export function useDiscussion() {
    const context = useContext(DiscussionContext);
    if (context === undefined) {
        throw new Error('useDiscussion must be used within a DiscussionProvider');
    }
    return context;
}
