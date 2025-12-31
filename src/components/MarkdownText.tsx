'use client';

import React from 'react';

interface MarkdownTextProps {
    text: string;
    className?: string;
}

export const MarkdownText: React.FC<MarkdownTextProps> = ({ text, className }) => {
    if (!text) return null;

    // Function to escape HTML to prevent XSS while allowing our specific tags
    const escapeHtml = (unsafe: string) => {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    };

    const renderContent = (content: string) => {
        let html = escapeHtml(content);

        // Bold: **text**
        html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold text-text-primary">$1</strong>');

        // Italic: *text* (avoid matching inside bold or links)
        html = html.replace(/\*([^\*]+?)\*/g, '<em class="italic text-text-secondary">$1</em>');

        // Strikethrough: ~~text~~
        html = html.replace(/~~(.+?)~~/g, '<del class="line-through text-text-muted">$1</del>');

        // Links: [text](url)
        // We handle this last to ensure link text can have bold/italic inside (if we wanted),
        // but here we just do simple link.
        html = html.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue hover:underline font-medium">$1</a>');

        return { __html: html };
    };

    return (
        <div
            className={`whitespace-pre-wrap break-words ${className}`}
            dangerouslySetInnerHTML={renderContent(text)}
        />
    );
};
