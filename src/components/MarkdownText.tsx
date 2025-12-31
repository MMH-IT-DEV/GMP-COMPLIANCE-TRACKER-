'use client';

import React from 'react';

interface MarkdownTextProps {
    text: string;
    className?: string;
}

export const MarkdownText: React.FC<MarkdownTextProps> = ({ text, className }) => {
    if (!text) return null;

    // If the text looks like HTML (starts with < and ends with >), render as HTML
    // Otherwise try to render as our legacy markdown
    const isHtml = text.trim().startsWith('<') || text.includes('</');

    if (isHtml) {
        return (
            <div
                className={`rich-text-content whitespace-pre-wrap break-words ${className}`}
                dangerouslySetInnerHTML={{ __html: text }}
            />
        );
    }

    // Legacy Markdown Fallback
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
        html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold text-text-primary">$1</strong>');
        html = html.replace(/\*([^\*]+?)\*/g, '<em class="italic text-text-secondary">$1</em>');
        html = html.replace(/~~(.+?)~~/g, '<del class="line-through text-text-muted">$1</del>');
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
