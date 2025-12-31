'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useDiscussion } from '@/context/DiscussionContext';
import { MarkdownText } from './MarkdownText';
import { Bold, Italic, Strikethrough, Link as LinkIcon, Send, X, User, Smile, Paperclip } from 'lucide-react';

interface Message {
    id: string;
    item_id: string;
    user_name: string;
    message: string;
    created_at: string;
    is_edited?: boolean;
    is_deleted?: boolean;
}

export const DiscussionPanel: React.FC = () => {
    const { activeItemId, activeItemTitle, isOpen, closeDiscussion } = useDiscussion();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [userName, setUserName] = useState<string>('');
    const [width, setWidth] = useState(400);
    const [isResizing, setIsResizing] = useState(false);
    const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
    const [editContent, setEditContent] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);
    const rafId = useRef<number | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Initial load of user name
    useEffect(() => {
        const savedName = localStorage.getItem('gmp_user_name');
        if (savedName) setUserName(savedName);
    }, []);

    const saveUserName = (name: string) => {
        setUserName(name);
        localStorage.setItem('gmp_user_name', name);
    };

    // Resizing logic
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
                { event: '*', schema: 'public', table: 'gmp_messages', filter: `item_id=eq.${activeItemId}` },
                (payload) => {
                    if (payload.eventType === 'INSERT') {
                        setMessages(prev => {
                            if (prev.find(m => m.id === payload.new.id)) return prev;
                            return [...prev, payload.new as Message];
                        });
                    } else if (payload.eventType === 'UPDATE') {
                        setMessages(prev => prev.map(m => m.id === payload.new.id ? payload.new as Message : m));
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [activeItemId, isOpen]);

    // Scroll to bottom
    useEffect(() => {
        if (messagesEndRef.current && !editingMessageId) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, editingMessageId]);

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
            alert('Failed to send message.');
        }
    };

    const handleEditMessage = async (msgId: string) => {
        const trimmed = editContent.trim();
        if (!trimmed) return;

        const { error } = await supabase
            .from('gmp_messages')
            .update({ message: trimmed, is_edited: true })
            .eq('id', msgId);

        if (error) {
            console.error('Error editing message:', error);
            alert('Failed to edit message.');
        } else {
            setEditingMessageId(null);
            setEditContent('');
        }
    };

    const handleDeleteMessage = async (msgId: string) => {
        if (!confirm('Are you sure you want to delete this message?')) return;

        const { error } = await supabase
            .from('gmp_messages')
            .update({ is_deleted: true, message: 'Message deleted' })
            .eq('id', msgId);

        if (error) {
            console.error('Error deleting message:', error);
            alert('Failed to delete message.');
        }
    };

    const insertFormatting = (prefix: string, suffix: string = prefix) => {
        if (!textareaRef.current) return;
        const start = textareaRef.current.selectionStart;
        const end = textareaRef.current.selectionEnd;
        const text = newMessage;
        const selectedText = text.substring(start, end);
        const before = text.substring(0, start);
        const after = text.substring(end);

        const newText = before + prefix + selectedText + suffix + after;
        setNewMessage(newText);

        setTimeout(() => {
            if (!textareaRef.current) return;
            textareaRef.current.focus();
            if (start === end) {
                const newPos = start + prefix.length;
                textareaRef.current.setSelectionRange(newPos, newPos);
            } else {
                const newPos = before.length + prefix.length + selectedText.length + suffix.length;
                textareaRef.current.setSelectionRange(newPos, newPos);
            }
        }, 0);
    };

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    };

    const getAvatarColor = (name: string) => {
        const hash = name.split('').reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0);
        const colors = ['bg-olive', 'bg-blue', 'bg-terracotta', 'bg-success', 'bg-warning', 'bg-error', 'bg-slate-500', 'bg-[#6366f1]'];
        return colors[Math.abs(hash) % colors.length];
    };

    if (!isOpen) return null;

    return (
        <div
            ref={panelRef}
            className="fixed top-0 right-0 h-full bg-card-bg border-l border-border z-50 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out font-sans"
            style={{ width: `${width}px` }}
        >
            <div className="absolute top-0 left-[-6px] w-[12px] h-full cursor-ew-resize group z-[60]" onMouseDown={startResizing}>
                <div className="w-[2px] h-full mx-auto bg-transparent group-hover:bg-olive/40 transition-colors" />
            </div>

            {/* Header */}
            <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-card-bg">
                <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-base text-text-primary truncate pr-4">{activeItemTitle || 'Discussion'}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-success"></div>
                        <button onClick={() => {
                            const newName = prompt('Update your display name:', userName);
                            if (newName && newName.trim()) saveUserName(newName.trim());
                        }} className="text-[11px] text-text-muted hover:text-text-primary transition-colors font-medium flex items-center gap-1">
                            <User size={10} />
                            {userName ? `Posting as ${userName}` : 'Anonymous User'}
                        </button>
                    </div>
                </div>
                <button onClick={closeDiscussion} className="p-2 text-text-muted hover:text-text-primary hover:bg-background rounded-lg transition-all">
                    <X size={20} />
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto bg-card-bg py-4 scroll-smooth">
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8 text-text-muted">
                        <div className="w-16 h-16 rounded-2xl bg-background flex items-center justify-center mb-4 border border-border">
                            <Smile size={32} strokeWidth={1.5} />
                        </div>
                        <p className="text-sm font-semibold text-text-secondary">No messages yet</p>
                    </div>
                ) : (
                    <div className="space-y-1">
                        {messages.map((msg, idx) => {
                            const showAvatar = idx === 0 || messages[idx - 1].user_name !== msg.user_name || (new Date(msg.created_at).getTime() - new Date(messages[idx - 1].created_at).getTime() > 300000);
                            const isOwnMessage = msg.user_name === userName;

                            return (
                                <div key={msg.id} className={`group px-6 py-1.5 hover:bg-slate-50 relative transition-colors ${showAvatar ? 'mt-4' : ''}`}>
                                    <div className="flex gap-4">
                                        {showAvatar ? (
                                            <div className={`w-9 h-9 rounded-lg ${getAvatarColor(msg.user_name)} flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-sm transition-transform active:scale-95 cursor-pointer`}>
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
                                                    <span className="font-bold text-[14px] text-text-primary hover:underline cursor-pointer">{msg.user_name}</span>
                                                    <span className="text-[11px] text-text-muted">
                                                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                            )}

                                            {editingMessageId === msg.id ? (
                                                <div className="mt-2 space-y-2">
                                                    <textarea
                                                        value={editContent}
                                                        onChange={(e) => setEditContent(e.target.value)}
                                                        className="w-full p-2 text-sm border border-olive rounded-md focus:ring-1 focus:ring-olive outline-none"
                                                        rows={3}
                                                    />
                                                    <div className="flex gap-2">
                                                        <button onClick={() => handleEditMessage(msg.id)} className="px-3 py-1 bg-olive text-white text-xs font-bold rounded hover:bg-olive/90">Save</button>
                                                        <button onClick={() => setEditingMessageId(null)} className="px-3 py-1 bg-slate-200 text-text-secondary text-xs font-bold rounded hover:bg-slate-300">Cancel</button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className={`text-[14px] leading-relaxed break-words ${msg.is_deleted ? 'text-text-muted italic' : 'text-text-secondary'}`}>
                                                    {msg.is_deleted ? (
                                                        'Message deleted'
                                                    ) : (
                                                        <div className="inline">
                                                            <MarkdownText text={msg.message} className="inline" />
                                                            {msg.is_edited && <span className="text-[10px] text-text-muted ml-1">(edited)</span>}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {isOwnMessage && !msg.is_deleted && editingMessageId !== msg.id && (
                                        <div className="absolute top-1 right-6 opacity-0 group-hover:opacity-100 transition-opacity flex gap-0.5 bg-white border border-border shadow-sm rounded p-0.5 z-10">
                                            <button
                                                onClick={() => { setEditingMessageId(msg.id); setEditContent(msg.message); }}
                                                className="p-1.5 hover:bg-slate-100 rounded text-text-muted hover:text-olive transition-colors"
                                                title="Edit"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" /></svg>
                                            </button>
                                            <button
                                                onClick={() => handleDeleteMessage(msg.id)}
                                                className="p-1.5 hover:bg-slate-100 rounded text-text-muted hover:text-error transition-colors"
                                                title="Delete"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>

            {/* Input area */}
            <div className="px-6 pb-6 pt-2 bg-card-bg border-t border-border/50">
                <div className="border border-border rounded-xl bg-background overflow-hidden focus-within:border-olive/50 focus-within:shadow-md transition-all group">
                    <div className="flex flex-col">
                        {/* Styled Formatting Toolbar - Lucide Icons */}
                        <div className="px-2 py-1 flex gap-0.5 border-b border-border bg-slate-50/50">
                            <button
                                onClick={() => insertFormatting('**')}
                                className="w-8 h-8 rounded hover:bg-slate-200/60 flex items-center justify-center text-text-muted hover:text-text-primary transition-colors"
                                title="Bold"
                            >
                                <Bold size={16} strokeWidth={2.5} />
                            </button>
                            <button
                                onClick={() => insertFormatting('*')}
                                className="w-8 h-8 rounded hover:bg-slate-200/60 flex items-center justify-center text-text-muted hover:text-text-primary transition-colors"
                                title="Italic"
                            >
                                <Italic size={16} strokeWidth={2.5} />
                            </button>
                            <button
                                onClick={() => insertFormatting('~~')}
                                className="w-8 h-8 rounded hover:bg-slate-200/60 flex items-center justify-center text-text-muted hover:text-text-primary transition-colors"
                                title="Strikethrough"
                            >
                                <Strikethrough size={16} strokeWidth={2.5} />
                            </button>
                            <div className="border-r border-border h-4 my-auto mx-1"></div>
                            <button
                                onClick={() => insertFormatting('[', '](url)')}
                                className="w-8 h-8 rounded hover:bg-slate-200/60 flex items-center justify-center text-text-muted hover:text-text-primary transition-colors"
                                title="Link"
                            >
                                <LinkIcon size={16} strokeWidth={2.5} />
                            </button>
                            <div className="flex-1"></div>
                            <button className="w-8 h-8 rounded hover:bg-slate-200/60 flex items-center justify-center text-text-muted hover:text-text-primary transition-colors" title="Emoji">
                                <Smile size={16} strokeWidth={2} />
                            </button>
                            <button className="w-8 h-8 rounded hover:bg-slate-200/60 flex items-center justify-center text-text-muted hover:text-text-primary transition-colors" title="Attach">
                                <Paperclip size={16} strokeWidth={2} />
                            </button>
                        </div>

                        <form onSubmit={handleSendMessage} className="relative p-1">
                            <textarea
                                ref={textareaRef}
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
                            <div className="flex justify-between items-center px-4 pb-2">
                                <div className="text-[10px] text-text-muted/60 font-medium">
                                    Press <kbd className="font-sans border border-border px-1 rounded bg-slate-50">Enter</kbd> to send
                                </div>
                                <button
                                    type="submit"
                                    disabled={!newMessage.trim()}
                                    className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg font-bold text-xs transition-all ${newMessage.trim()
                                            ? 'bg-olive text-white shadow-sm hover:shadow-md hover:translate-y-[-1px] active:translate-y-[0px]'
                                            : 'bg-slate-100 text-text-muted/40 cursor-not-allowed'
                                        }`}
                                >
                                    <span>Send</span>
                                    <Send size={14} fill={newMessage.trim() ? "currentColor" : "none"} />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};
