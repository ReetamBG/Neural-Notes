"use client";

import React from "react";
import {
  Editor,
  EditorContent,
  useEditor,
  useEditorState,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyleKit } from "@tiptap/extension-text-style";
import Placeholder from "@tiptap/extension-placeholder";

// Lucide icons
import {
  Bold,
  Italic,
  Code,
  Type,
  Hash,
  List,
  ListOrdered,
  Quote,
  Terminal,
  Heading1,
  Heading2,
  Heading3,
} from "lucide-react";
import { Input } from "./ui/input";

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
const extensions = [
  StarterKit,
  TextStyleKit,
  Placeholder.configure({
    placeholder: "Start typing your notes here…",
    // showOnlyWhenEditable: true,
    // showOnlyCurrent: false,
    // includeChildren: true,
  }),
];

const buttons: {
  name: string;
  icon: React.ReactNode;
  command: string;
  type: "mark" | "node";
  level?: HeadingLevel;
}[] = [
  {
    name: "Bold",
    icon: <Bold size={16} />,
    command: "toggleBold",
    type: "mark",
  },
  {
    name: "Italic",
    icon: <Italic size={16} />,
    command: "toggleItalic",
    type: "mark",
  },
  {
    name: "Code",
    icon: <Code size={16} />,
    command: "toggleCode",
    type: "mark",
  },
  {
    name: "Paragraph",
    icon: <Type size={16} />,
    command: "setParagraph",
    type: "node",
  },
  {
    name: "H1",
    icon: <Heading1 size={16} />,
    command: "toggleHeading",
    level: 1,
    type: "node",
  },
  {
    name: "H2",
    icon: <Heading2 size={16} />,
    command: "toggleHeading",
    level: 2,
    type: "node",
  },
  {
    name: "H3",
    icon: <Heading3 size={16} />,
    command: "toggleHeading",
    level: 3,
    type: "node",
  },
  {
    name: "Bullet",
    icon: <List size={16} />,
    command: "toggleBulletList",
    type: "node",
  },
  {
    name: "Ordered",
    icon: <ListOrdered size={16} />,
    command: "toggleOrderedList",
    type: "node",
  },
  {
    name: "Code Block",
    icon: <Terminal size={16} />,
    command: "toggleCodeBlock",
    type: "node",
  },
  {
    name: "Blockquote",
    icon: <Quote size={16} />,
    command: "toggleBlockquote",
    type: "node",
  },
];

function MenuBar({ editor }: { editor: Editor | null }) {
  // Always call the hook
  const editorState = useEditorState({
    editor,
    selector: (ctx) => ({
      bold: ctx?.editor?.isActive("bold") ?? false,
      italic: ctx?.editor?.isActive("italic") ?? false,
      code: ctx?.editor?.isActive("code") ?? false,
      paragraph: ctx?.editor?.isActive("paragraph") ?? false,
      h1: ctx?.editor?.isActive("heading", { level: 1 }) ?? false,
      h2: ctx?.editor?.isActive("heading", { level: 2 }) ?? false,
      bullet: ctx?.editor?.isActive("bulletList") ?? false,
      ordered: ctx?.editor?.isActive("orderedList") ?? false,
      codeBlock: ctx?.editor?.isActive("codeBlock") ?? false,
      blockquote: ctx?.editor?.isActive("blockquote") ?? false,
    }),
  });

  if (!editor) return null; // Now safe to return early

  return (
    <div className="flex flex-wrap gap-2 p-4 border-b border-border bg-card">
      {buttons.map((btn) => {
        let isActive = false;
        if (editorState) {
          switch (btn.name) {
            case "Bold":
              isActive = editorState.bold;
              break;
            case "Italic":
              isActive = editorState.italic;
              break;
            case "Code":
              isActive = editorState.code;
              break;
            case "Paragraph":
              isActive = editorState.paragraph;
              break;
            case "H1":
              isActive = editorState.h1;
              break;
            case "H2":
              isActive = editorState.h2;
              break;
            case "Bullet":
              isActive = editorState.bullet;
              break;
            case "Ordered":
              isActive = editorState.ordered;
              break;
            case "Code Block":
              isActive = editorState.codeBlock;
              break;
            case "Blockquote":
              isActive = editorState.blockquote;
              break;
          }
        }

        const handleClick = () => {
          if (btn.command === "toggleHeading" && btn.level) {
            editor
              .chain()
              .focus()
              .toggleHeading({ level: btn.level as HeadingLevel })
              .run();
          } else {
            // @ts-expect-error dynamic command
            editor.chain().focus()[btn.command]().run();
          }
        };

        return (
          <button
            key={btn.name}
            onClick={handleClick}
            title={btn.name}
            className={`flex items-center justify-center gap-1 px-3 py-1 rounded border text-sm font-medium transition-colors ${
              isActive
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background/70 text-foreground border-border hover:bg-accent hover:text-accent-foreground"
            }`}
          >
            {btn.icon}
          </button>
        );
      })}
    </div>
  );
}

export default function TextEditor() {
  const editor = useEditor({
    immediatelyRender: false,
    extensions,
    content: "", // Ensure editor starts completely empty
    editable: true,
  });

  return (
    <div className="flex flex-col h-screen w-full">
      <MenuBar editor={editor} />
      <input
        className="focus:outline-none focus:ring-0 text-primary px-4 py-4 text-3xl sm:text-5xl font-bold bg-card"
        placeholder="Title..."
      />
      <div className="flex-1 overflow-auto px-4 bg-card editor-content text-foreground">
        <EditorContent editor={editor} className="min-h-full ProseMirror" />
      </div>
    </div>
  );
}
