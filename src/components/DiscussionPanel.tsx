'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useDiscussion } from '@/context/DiscussionContext';

interface Message {
    id: string;
    item_id: string;
    user_name: string;
    message: string;
    created_at: string;
}

export const DiscussionPanel: React.FC = () => {
    const { activeItemId, activeItemTitle, isOpen, closeDiscussion } = useDiscussion();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [userName, setUserName] = useState<string>('');
    const [width, setWidth] = useState(400);
    const [isResizing, setIsResizing] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);
    const rafId = useRef<number | null>(null);

    // Initial load of user name
    useEffect(() => {
        const savedName = localStorage.getItem('gmp_user_name');
        if (savedName) setUserName(savedName);
    }, []);

    const saveUserName = (name: string) => {
        setUserName(name);
        localStorage.setItem('gmp_user_name', name);
    };

    // Resizing logic with requestAnimationFrame for smoothness
    const startResizing = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        setIsResizing(true);
        document.body.style.cursor = 'ew-resize';
        document.body.style.userSelect = 'none';
    }, []);

    const stopResizing = useCallback(() => {
        setIsResizing(false);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
        if (rafId.current) {
            cancelAnimationFrame(rafId.current);
            rafId.current = null;
        }
    }, []);

    const resize = useCallback((e: MouseEvent) => {
        if (isResizing) {
            if (rafId.current) cancelAnimationFrame(rafId.current);

            rafId.current = requestAnimationFrame(() => {
                const newWidth = window.innerWidth - e.clientX;
                if (newWidth >= 300 && newWidth <= 600) {
                    setWidth(newWidth);
                }
            });
        }
    }, [isResizing]);

    useEffect(() => {
        window.addEventListener('mousemove', resize);
        window.addEventListener('mouseup', stopResizing);
        return () => {
            window.removeEventListener('mousemove', resize);
            window.removeEventListener('mouseup', stopResizing);
        };
    }, [resize, stopResizing]);

    // Fetch messages
    useEffect(() => {
        if (!activeItemId || !isOpen) return;

        const fetchMessages = async () => {
            const { data, error } = await supabase
                .from('gmp_messages')
                .select('*')
                .eq('item_id', activeItemId)
                .order('created_at', { ascending: true });

            if (error) {
                console.error('Error fetching messages:', error);
            } else {
                setMessages(data || []);
            }
        };

        fetchMessages();

        // Subscription
        const channel = supabase
            .channel(`discussion_${activeItemId}`)
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'gmp_messages', filter: `item_id=eq.${activeItemId}` },
                (payload) => {
                    setMessages(prev => {
                        if (prev.find(m => m.id === payload.new.id)) return prev;
                        return [...prev, payload.new as Message];
                    });
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [activeItemId, isOpen]);

    // Scroll to bottom
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const handleSendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault();
        const trimmedMessage = newMessage.trim();
        if (!trimmedMessage || !activeItemId) return;

        let currentUserName = userName;
        if (!currentUserName) {
            const name = prompt('Enter your name for the discussion:');
            if (!name || !name.trim()) return;
            currentUserName = name.trim();
            saveUserName(currentUserName);
        }

        setNewMessage('');

        const { error } = await supabase
            .from('gmp_messages')
            .insert([{
                item_id: activeItemId,
                user_name: currentUserName,
                message: trimmedMessage
            }]);

        if (error) {
            console.error('Error sending message:', error);
            setNewMessage(trimmedMessage);
            alert('Failed to send message. Please try again.');
        }
    };

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    };

    const getAvatarColor = (name: string) => {
        const hash = name.split('').reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0);
        const colors = [
            'bg-olive', 'bg-blue', 'bg-terracotta', 'bg-success',
            'bg-warning', 'bg-error', 'bg-slate-500', 'bg-[#6366f1]'
        ];
        return colors[Math.abs(hash) % colors.length];
    };

    if (!isOpen) return null;

    return (
        <div
            ref={panelRef}
            className={`fixed top-0 right-0 h-full bg-card-bg border-l border-border z-50 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out`}
            style={{ width: `${width}px` }}
        >
            {/* Wider Resize handle with hover indicator */}
            <div
                className="absolute top-0 left-[-6px] w-[12px] h-full cursor-ew-resize group z-[60]"
                onMouseDown={startResizing}
            >
                <div className="w-[2px] h-full mx-auto bg-transparent group-hover:bg-olive/40 transition-colors" />
            </div>

            {/* Header - Katana Light Theme */}
            <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-card-bg">
                <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-base text-text-primary truncate pr-4">
                        {activeItemTitle || 'Discussion'}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5">
                        <div className="w-2 h-2 rounded-full bg-success"></div>
                        <button
                            onClick={() => {
                                const newName = prompt('Update your display name:', userName);
                                if (newName && newName.trim()) saveUserName(newName.trim());
                            }}
                            className="text-[11px] text-text-muted hover:text-text-primary transition-colors font-medium"
                        >
                            {userName ? `Posting as ${userName}` : 'Anonymous User'}
                        </button>
                    </div>
                </div>
                <button
                    onClick={closeDiscussion}
                    className="p-2 text-text-muted hover:text-text-primary hover:bg-background rounded-lg transition-all"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                </button>
            </div>

            {/* Messages - Katana Light Theme */}
            <div className="flex-1 overflow-y-auto bg-card-bg py-4">
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8 text-text-muted">
                        <div className="w-16 h-16 rounded-2xl bg-background flex items-center justify-center mb-4 border border-border">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                        </div>
                        <p className="text-sm font-semibold text-text-secondary">No messages yet</p>
                        <p className="text-xs mt-1">Start the conversation about this requirement</p>
                    </div>
                ) : (
                    <div className="space-y-1">
                        {messages.map((msg, idx) => {
                            const showAvatar = idx === 0 || messages[idx - 1].user_name !== msg.user_name ||
                                (new Date(msg.created_at).getTime() - new Date(messages[idx - 1].created_at).getTime() > 300000);

                            return (
                                <div
                                    key={msg.id}
                                    className={`group px-6 py-1.5 hover:bg-background transition-colors ${showAvatar ? 'mt-4' : ''}`}
                                >
                                    <div className="flex gap-4">
                                        {showAvatar ? (
                                            <div className={`w-9 h-9 rounded-lg ${getAvatarColor(msg.user_name)} flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-sm`}>
                                                {getInitials(msg.user_name)}
                                            </div>
                                        ) : (
                                            <div className="w-9 shrink-0 flex items-center justify-center">
                                                <span className="text-[9px] text-text-muted opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                                                </span>
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            {showAvatar && (
                                                <div className="flex items-baseline gap-2 mb-0.5">
                                                    <span className="font-bold text-[14px] text-text-primary hover:underline cursor-pointer">
                                                        {msg.user_name}
                                                    </span>
                                                    <span className="text-[11px] text-text-muted">
                                                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                            )}
                                            <div className="text-[14px] text-text-secondary leading-relaxed break-words">
                                                {msg.message}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>

            {/* Input area - Katana Light Theme */}
            <div className="px-6 pb-6 pt-2 bg-card-bg">
                <div className="border border-border rounded-xl bg-background overflow-hidden focus-within:border-olive/50 transition-colors group shadow-sm">
                    <div className="flex flex-col">
                        {/* Toolbar placeholder */}
                        <div className="px-3 py-2 flex gap-4 border-b border-border text-text-muted bg-slate-50/50">
                            <div className="w-5 h-5 rounded hover:bg-border/50 cursor-pointer flex items-center justify-center text-xs"><b>B</b></div>
                            <div className="w-5 h-5 rounded hover:bg-border/50 cursor-pointer flex items-center justify-center text-xs italic">I</div>
                            <div className="w-5 h-5 rounded hover:bg-border/50 cursor-pointer flex items-center justify-center text-xs line-through">S</div>
                            <div className="border-r border-border h-4 my-auto"></div>
                            <div className="w-5 h-5 rounded hover:bg-border/50 cursor-pointer flex items-center justify-center opacity-70">🔗</div>
                        </div>

                        <form onSubmit={handleSendMessage} className="relative p-1">
                            <textarea
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSendMessage();
                                    }
                                }}
                                placeholder={`Message ${activeItemTitle}...`}
                                className="w-full bg-transparent border-none px-4 py-3 text-[14px] text-text-primary placeholder:text-text-muted/60 focus:ring-0 outline-none resize-none h-24"
                            />
                            <div className="flex justify-between items-center px-3 pb-2">
                                <div className="flex gap-2">
                                    <button type="button" className="p-1.5 text-text-muted hover:text-text-secondary hover:bg-border/30 rounded transition-all">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" /></svg>
                                    </button>
                                    <button type="button" className="p-1.5 text-text-muted hover:text-text-secondary hover:bg-border/30 rounded transition-all">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" /></svg>
                                    </button>
                                </div>
                                <button
                                    type="submit"
                                    disabled={!newMessage.trim()}
                                    className={`p-2 rounded-lg transition-all ${newMessage.trim() ? 'bg-olive text-white shadow-md hover:bg-olive/90' : 'bg-background text-text-muted opacity-50'}`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};
