
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
    Bold, Italic, Heading1, Heading2, List, ListOrdered,
    Link as LinkIcon, Image as ImageIcon, Code, Quote, Eye, Edit2
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
    minHeight?: string;
}

export const RichTextEditor = ({
    value,
    onChange,
    placeholder = "Write your content here...",
    className = "",
    minHeight = "min-h-[200px]"
}: RichTextEditorProps) => {
    const [view, setView] = useState<'edit' | 'preview'>('edit');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const insertTag = (tag: string, endTag?: string) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;
        const selectedText = text.substring(start, end);

        const before = text.substring(0, start);
        const after = text.substring(end);

        const newText = endTag
            ? `${before}<${tag}>${selectedText}</${endTag}>${after}`
            : `${before}<${tag}>${selectedText}</${tag}>${after}`;

        onChange(newText);

        // Restore focus and selection
        setTimeout(() => {
            textarea.focus();
            const newCursorPos = start + tag.length + 2;
            textarea.setSelectionRange(newCursorPos, newCursorPos + selectedText.length);
        }, 0);
    };

    const wrapBlock = (tag: string) => {
        insertTag(tag, tag);
    };

    const insertLink = () => {
        const url = prompt("Enter URL:");
        if (url) {
            const textarea = textareaRef.current;
            if (!textarea) return;

            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const text = textarea.value;
            const selectedText = text.substring(start, end) || "link text";

            const newText = text.substring(0, start) + `<a href="${url}" target="_blank" class="text-primary hover:underline">${selectedText}</a>` + text.substring(end);
            onChange(newText);
        }
    };

    return (
        <div className={`border rounded-md overflow-hidden bg-white ${className}`}>
            <div className="flex items-center justify-between p-2 border-b bg-gray-50">
                <div className="flex items-center gap-1 flex-wrap">
                    <Button type="button" variant="ghost" size="sm" onClick={() => wrapBlock('b')} title="Bold">
                        <Bold className="h-4 w-4" />
                    </Button>
                    <Button type="button" variant="ghost" size="sm" onClick={() => wrapBlock('i')} title="Italic">
                        <Italic className="h-4 w-4" />
                    </Button>
                    <div className="w-px h-6 bg-gray-300 mx-1" />
                    <Button type="button" variant="ghost" size="sm" onClick={() => wrapBlock('h2')} title="Heading 2">
                        <Heading2 className="h-4 w-4" />
                    </Button>
                    <Button type="button" variant="ghost" size="sm" onClick={() => wrapBlock('h3')} title="Heading 3">
                        <Heading1 className="h-3 w-3" />
                    </Button>
                    <div className="w-px h-6 bg-gray-300 mx-1" />
                    <Button type="button" variant="ghost" size="sm" onClick={() => wrapBlock('p')} title="Paragraph">
                        <span className="font-serif font-bold">P</span>
                    </Button>
                    <Button type="button" variant="ghost" size="sm" onClick={() => wrapBlock('ul')} title="Unordered List">
                        <List className="h-4 w-4" />
                    </Button>
                    <Button type="button" variant="ghost" size="sm" onClick={() => wrapBlock('ol')} title="Ordered List">
                        <ListOrdered className="h-4 w-4" />
                    </Button>
                    <Button type="button" variant="ghost" size="sm" onClick={() => wrapBlock('li')} title="List Item">
                        <span className="text-xs font-mono">•</span>
                    </Button>
                    <div className="w-px h-6 bg-gray-300 mx-1" />
                    <Button type="button" variant="ghost" size="sm" onClick={insertLink} title="Link">
                        <LinkIcon className="h-4 w-4" />
                    </Button>
                    <Button type="button" variant="ghost" size="sm" onClick={() => wrapBlock('blockquote')} title="Quote">
                        <Quote className="h-4 w-4" />
                    </Button>
                </div>

                <div className="flex items-center gap-1 bg-gray-200 rounded p-0.5">
                    <Button
                        type="button"
                        variant={view === 'edit' ? 'secondary' : 'ghost'}
                        size="sm"
                        className={`h-7 px-2 ${view === 'edit' ? 'shadow-sm' : ''}`}
                        onClick={() => setView('edit')}
                    >
                        <Edit2 className="h-3 w-3 mr-1" /> Edit
                    </Button>
                    <Button
                        type="button"
                        variant={view === 'preview' ? 'secondary' : 'ghost'}
                        size="sm"
                        className={`h-7 px-2 ${view === 'preview' ? 'shadow-sm' : ''}`}
                        onClick={() => setView('preview')}
                    >
                        <Eye className="h-3 w-3 mr-1" /> Preview
                    </Button>
                </div>
            </div>

            {view === 'edit' ? (
                <Textarea
                    ref={textareaRef}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className={`border-0 focus-visible:ring-0 rounded-none resize-y p-4 font-mono text-sm ${minHeight}`}
                />
            ) : (
                <div
                    className={`p-4 prose prose-sm max-w-none dark:prose-invert overflow-y-auto ${minHeight}`}
                    dangerouslySetInnerHTML={{ __html: value || '<p class="text-gray-400 italic">Nothing to preview</p>' }}
                />
            )}

            {view === 'edit' && (
                <div className="px-3 py-1 bg-gray-50 border-t text-xs text-gray-400 flex justify-between">
                    <span>Supports HTML tags</span>
                    <span>{value.length} chars</span>
                </div>
            )}
        </div>
    );
};
