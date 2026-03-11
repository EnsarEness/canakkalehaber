"use client";

import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import {
    Bold,
    Italic,
    UnderlineIcon,
    Strikethrough,
    Heading1,
    Heading2,
    Heading3,
    List,
    ListOrdered,
    Quote,
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
    ImageIcon,
    Link2,
    Undo,
    Redo,
    Minus,
    Code2,
} from "lucide-react";
import { useCallback } from "react";

interface ToolbarButtonProps {
    onClick: () => void;
    active?: boolean;
    title: string;
    children: React.ReactNode;
}

function ToolbarButton({ onClick, active, title, children }: ToolbarButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            title={title}
            className={`p-1.5 rounded-lg transition-colors ${active
                    ? "bg-red-700 text-white"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
        >
            {children}
        </button>
    );
}

function Divider() {
    return <div className="w-px h-5 bg-gray-200 mx-1" />;
}

interface ToolbarProps {
    editor: Editor | null;
}

function RichTextToolbar({ editor }: ToolbarProps) {
    const addImage = useCallback(() => {
        const url = window.prompt("Fotoğraf URL girin:");
        if (url && editor) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    }, [editor]);

    const addLink = useCallback(() => {
        const url = window.prompt("URL girin:");
        if (url && editor) {
            editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
        }
    }, [editor]);

    if (!editor) return null;

    return (
        <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 border-b border-gray-200 bg-gray-50 rounded-t-xl sticky top-0 z-10">
            {/* Undo / Redo */}
            <ToolbarButton onClick={() => editor.chain().focus().undo().run()} title="Geri Al">
                <Undo size={15} />
            </ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().redo().run()} title="İleri Al">
                <Redo size={15} />
            </ToolbarButton>
            <Divider />

            {/* Headings */}
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                active={editor.isActive("heading", { level: 1 })}
                title="Başlık 1"
            >
                <Heading1 size={15} />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                active={editor.isActive("heading", { level: 2 })}
                title="Başlık 2"
            >
                <Heading2 size={15} />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                active={editor.isActive("heading", { level: 3 })}
                title="Başlık 3"
            >
                <Heading3 size={15} />
            </ToolbarButton>
            <Divider />

            {/* Text formatting */}
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleBold().run()}
                active={editor.isActive("bold")}
                title="Kalın"
            >
                <Bold size={15} />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleItalic().run()}
                active={editor.isActive("italic")}
                title="İtalik"
            >
                <Italic size={15} />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                active={editor.isActive("underline")}
                title="Altı Çizili"
            >
                <UnderlineIcon size={15} />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleStrike().run()}
                active={editor.isActive("strike")}
                title="Üstü Çizili"
            >
                <Strikethrough size={15} />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleCode().run()}
                active={editor.isActive("code")}
                title="Kod"
            >
                <Code2 size={15} />
            </ToolbarButton>
            <Divider />

            {/* Alignment */}
            <ToolbarButton
                onClick={() => editor.chain().focus().setTextAlign("left").run()}
                active={editor.isActive({ textAlign: "left" })}
                title="Sola Hizala"
            >
                <AlignLeft size={15} />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().setTextAlign("center").run()}
                active={editor.isActive({ textAlign: "center" })}
                title="Ortala"
            >
                <AlignCenter size={15} />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().setTextAlign("right").run()}
                active={editor.isActive({ textAlign: "right" })}
                title="Sağa Hizala"
            >
                <AlignRight size={15} />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().setTextAlign("justify").run()}
                active={editor.isActive({ textAlign: "justify" })}
                title="İki Yana Yasla"
            >
                <AlignJustify size={15} />
            </ToolbarButton>
            <Divider />

            {/* Lists */}
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                active={editor.isActive("bulletList")}
                title="Madde İmleri"
            >
                <List size={15} />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                active={editor.isActive("orderedList")}
                title="Numaralı Liste"
            >
                <ListOrdered size={15} />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                active={editor.isActive("blockquote")}
                title="Alıntı"
            >
                <Quote size={15} />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().setHorizontalRule().run()}
                title="Yatay Çizgi"
            >
                <Minus size={15} />
            </ToolbarButton>
            <Divider />

            {/* Media */}
            <ToolbarButton onClick={addImage} title="Fotoğraf Ekle">
                <ImageIcon size={15} />
            </ToolbarButton>
            <ToolbarButton
                onClick={addLink}
                active={editor.isActive("link")}
                title="Bağlantı Ekle"
            >
                <Link2 size={15} />
            </ToolbarButton>
        </div>
    );
}

interface RichTextEditorProps {
    value: string;
    onChange: (html: string) => void;
    placeholder?: string;
}

export function RichTextEditor({
    value,
    onChange,
    placeholder = "Haber içeriğini buraya yazın...",
}: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
            Underline,
            TextAlign.configure({ types: ["heading", "paragraph"] }),
            Image.configure({ inline: false, allowBase64: false }),
            Link.configure({ openOnClick: false }),
            Placeholder.configure({
                placeholder,
                emptyEditorClass: "is-editor-empty",
            }),
        ],
        content: value,
        editorProps: {
            attributes: {
                class:
                    "min-h-[400px] px-6 py-5 focus:outline-none prose prose-sm max-w-none",
            },
        },
        onUpdate({ editor }) {
            onChange(editor.getHTML());
        },
        immediatelyRender: false,
    });

    return (
        <div className="border border-gray-200 rounded-xl overflow-hidden bg-white focus-within:ring-2 focus-within:ring-red-500 focus-within:border-transparent transition-all">
            <RichTextToolbar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    );
}
