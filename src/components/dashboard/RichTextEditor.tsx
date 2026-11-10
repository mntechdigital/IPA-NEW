'use client';

import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import {
  Bold,
  Italic,
  Strikethrough,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Link as LinkIcon,
  Code,
  RemoveFormatting,
} from 'lucide-react';

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  label?: string;
  placeholder?: string;
  minHeight?: string;
}

export function RichTextEditor({
  content,
  onChange,
  label,
  placeholder = 'Write or paste formatted content...',
  minHeight = '180px',
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3, 4],
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-[#0C57A5] underline font-medium hover:text-[#0B2A4A]',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: content || '',
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: `prose prose-sm max-w-none p-3.5 text-[#1E293B] focus:outline-none leading-relaxed min-h-[${minHeight}]`,
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      // If editor is empty paragraph, send empty string
      const clean = html === '<p></p>' ? '' : html;
      onChange(clean);
    },
  });

  // Sync editor content when external content changes (e.g. on modal open)
  useEffect(() => {
    if (editor && content !== undefined) {
      const currentHtml = editor.getHTML();
      const normalizedCurrent = currentHtml === '<p></p>' ? '' : currentHtml;
      const normalizedProp = content || '';
      if (normalizedCurrent !== normalizedProp) {
        editor.commands.setContent(normalizedProp);
      }
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Enter link URL:', previousUrl);

    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  return (
    <div className="space-y-1.5 text-left">
      {label && (
        <label className="block text-xs font-semibold text-[#1E293B] uppercase tracking-wider">
          {label}
        </label>
      )}

      <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] overflow-hidden focus-within:border-[#0C57A5] focus-within:ring-2 focus-within:ring-[#0C57A5]/20 transition-all shadow-2xs">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-1 p-2 bg-white border-b border-[#E2E8F0]">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run()}
            className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
              editor.isActive('bold')
                ? 'bg-[#0C57A5] text-white'
                : 'text-[#64748B] hover:bg-slate-100 hover:text-[#0B2A4A]'
            }`}
            title="Bold (Ctrl+B)"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
              editor.isActive('italic')
                ? 'bg-[#0C57A5] text-white'
                : 'text-[#64748B] hover:bg-slate-100 hover:text-[#0B2A4A]'
            }`}
            title="Italic (Ctrl+I)"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            disabled={!editor.can().chain().focus().toggleStrike().run()}
            className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
              editor.isActive('strike')
                ? 'bg-[#0C57A5] text-white'
                : 'text-[#64748B] hover:bg-slate-100 hover:text-[#0B2A4A]'
            }`}
            title="Strikethrough"
          >
            <Strikethrough className="w-3.5 h-3.5" />
          </button>

          <div className="w-px h-4 bg-[#E2E8F0] mx-1" />

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`p-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              editor.isActive('heading', { level: 2 })
                ? 'bg-[#0C57A5] text-white'
                : 'text-[#64748B] hover:bg-slate-100 hover:text-[#0B2A4A]'
            }`}
            title="Heading 2"
          >
            <Heading2 className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`p-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              editor.isActive('heading', { level: 3 })
                ? 'bg-[#0C57A5] text-white'
                : 'text-[#64748B] hover:bg-slate-100 hover:text-[#0B2A4A]'
            }`}
            title="Heading 3"
          >
            <Heading3 className="w-3.5 h-3.5" />
          </button>

          <div className="w-px h-4 bg-[#E2E8F0] mx-1" />

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
              editor.isActive('bulletList')
                ? 'bg-[#0C57A5] text-white'
                : 'text-[#64748B] hover:bg-slate-100 hover:text-[#0B2A4A]'
            }`}
            title="Bullet List"
          >
            <List className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
              editor.isActive('orderedList')
                ? 'bg-[#0C57A5] text-white'
                : 'text-[#64748B] hover:bg-slate-100 hover:text-[#0B2A4A]'
            }`}
            title="Numbered List"
          >
            <ListOrdered className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
              editor.isActive('blockquote')
                ? 'bg-[#0C57A5] text-white'
                : 'text-[#64748B] hover:bg-slate-100 hover:text-[#0B2A4A]'
            }`}
            title="Blockquote"
          >
            <Quote className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleCode().run()}
            className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
              editor.isActive('code')
                ? 'bg-[#0C57A5] text-white'
                : 'text-[#64748B] hover:bg-slate-100 hover:text-[#0B2A4A]'
            }`}
            title="Inline Code"
          >
            <Code className="w-3.5 h-3.5" />
          </button>

          <div className="w-px h-4 bg-[#E2E8F0] mx-1" />

          <button
            type="button"
            onClick={setLink}
            className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
              editor.isActive('link')
                ? 'bg-[#0C57A5] text-white'
                : 'text-[#64748B] hover:bg-slate-100 hover:text-[#0B2A4A]'
            }`}
            title="Insert Link"
          >
            <LinkIcon className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
            className="p-1.5 rounded-lg text-xs text-[#64748B] hover:bg-slate-100 hover:text-[#0B2A4A] transition-colors cursor-pointer"
            title="Clear Formatting"
          >
            <RemoveFormatting className="w-3.5 h-3.5" />
          </button>

          <div className="w-px h-4 bg-[#E2E8F0] mx-1" />

          <button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().chain().focus().undo().run()}
            className="p-1.5 rounded-lg text-xs text-[#64748B] hover:bg-slate-100 hover:text-[#0B2A4A] disabled:opacity-40 transition-colors cursor-pointer"
            title="Undo (Ctrl+Z)"
          >
            <Undo className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().chain().focus().redo().run()}
            className="p-1.5 rounded-lg text-xs text-[#64748B] hover:bg-slate-100 hover:text-[#0B2A4A] disabled:opacity-40 transition-colors cursor-pointer"
            title="Redo (Ctrl+Y)"
          >
            <Redo className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Content Area */}
        <div style={{ minHeight }}>
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
}
