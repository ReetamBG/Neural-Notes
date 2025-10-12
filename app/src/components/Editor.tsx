"use client";

import React, { useState } from "react";
import {
  Editor,
  EditorContent,
  useEditor,
  useEditorState,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyleKit } from "@tiptap/extension-text-style";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  Code,
  Type,
  List,
  ListOrdered,
  Quote,
  Terminal,
  Heading1,
  Heading2,
  Heading3,
  ArrowLeftCircle,
  Download,
  Trash2,
  LoaderCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import useNotesStore from "@/store/notes.store";
import { toast } from "sonner";
import { Skeleton } from "./ui/skeleton";

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

const extensions = [
  StarterKit,
  TextStyleKit,
  Placeholder.configure({
    placeholder: "Start typing your notes here…",
  }),
];

const buttons = [
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

function MenuBar({
  editor,
  title,
  isNewNote,
  folderId,
  noteId,
}: {
  editor: Editor | null;
  title: string;
  isNewNote?: boolean;
  folderId?: string;
  noteId?: string;
}) {
  const router = useRouter();
  const { isActionProcessing, addNewNote, updateNote, deleteNote } =
    useNotesStore();

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

  if (!editor) return null;

  // TODO: SAVE ONLY IF NOT PRESENT IN DB ELSE UPDATE
  // TODO: REMOVE DELETE IF NOTE NOT IN DB AND SHOW DELETE AFTER SAVED ONCE
  // TODO: SAVE ONLY IF EDITED
  const handleSave = async () => {
    const contentJSON = editor.getJSON();
    const contentText = editor.getText();

    if (!title.trim().length || !contentText.trim().length) {
      toast.error("Title and content cannot be empty");
      return;
    }

    console.log("Saving note:", title, contentJSON);
    console.log(
      "Note details:",
      title,
      JSON.stringify(contentJSON),
      contentText,
      folderId
    );

    if (isNewNote) {
      // Create new note
      await addNewNote(
        title,
        JSON.stringify(contentJSON),
        contentText,
        folderId || ""
      );

      // Navigate back to folder after creating new note
      if (folderId) {
        router.push(`/dashboard/folder/${folderId}`);
      }
    } else if (noteId) {
      // Update existing note
      await updateNote(noteId, title, JSON.stringify(contentJSON), contentText);
    }
  };

  const handleDelete = async () => {
    if (isNewNote) {
      // For new notes that haven't been saved, just navigate back
      router.back();
    } else if (noteId) {
      // For existing notes, delete from database
      await deleteNote(noteId);
      if (folderId) {
        router.push(`/dashboard/folder/${folderId}`);
      }
    }
  };

  return (
    <div className="flex flex-wrap gap-2 p-4 border-b border-border bg-card items-center">
      <button onClick={() => router.back()}>
        <ArrowLeftCircle className="text-accent-foreground cursor-pointer me-4 hover:text-primary" />
      </button>
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
            className={`cursor-pointer flex items-center justify-center gap-1 px-3 py-1 rounded border text-sm font-medium transition-colors ${
              isActive
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background/70 text-foreground border-border hover:bg-accent hover:text-accent-foreground"
            }`}
          >
            {btn.icon}
          </button>
        );
      })}
      <div className="flex gap-4 ms-auto">
        <Button onClick={handleSave} className="bg-accent-foreground">
          {isActionProcessing ? (
            <>
              <LoaderCircle className="animate-spin" />
              Saving...
            </>
          ) : (
            <>
              Save <Download />
            </>
          )}
        </Button>

        {/* TODO: MAYBE HAVE A BETTER LOGIC TO SHOW DELETE DYNAMICALLY BASED ON IF SAVED AND IN DB */}
        {(isNewNote || noteId) && (
          <Button onClick={handleDelete} variant="secondary">
            {isNewNote ? "Cancel" : "Delete"} <Trash2 />
          </Button>
        )}
      </div>
    </div>
  );
}

export default function TextEditor({
  isNewNote = false,
  folderId,
  noteId,
}: {
  isNewNote?: boolean;
  folderId?: string;
  noteId?: string;
}) {
  const [title, setTitle] = useState("");
  const { fetchNoteById, isNoteContentLoading } = useNotesStore();
  const editor = useEditor({
    immediatelyRender: false,
    extensions,
    content: "",
    editable: true,
  });

  // Load existing note data when editing
  React.useEffect(() => {
    const loadNote = async () => {
      if (!isNewNote && noteId) {
        useNotesStore.setState({ isNoteContentLoading: true });
        const note = await fetchNoteById(noteId);
        if (note) {
          setTitle(note.title);
          if (editor && note.content) {
            try {
              const parsedContent = JSON.parse(note.content);
              editor.commands.setContent(parsedContent);
            } catch (error) {
              toast.error("Error parsing note content");
              console.error("Error parsing note content:", error);
              // Fallback to plain text
              editor.commands.setContent(note.content);
            }
          }
        }
        useNotesStore.setState({ isNoteContentLoading: false });
      }
    };

    loadNote();
  }, [isNewNote, noteId, editor, fetchNoteById]);

  return (
    <div className="flex flex-col h-screen w-full bg-card">
      <MenuBar
        editor={editor}
        title={title}
        isNewNote={isNewNote}
        folderId={folderId}
        noteId={noteId}
      />
      {isNoteContentLoading ? (
        <div className="space-y-2 my-4 px-4">
              <Skeleton className="h-20 w-full mb-8" />
          {Array(6)
            .fill(0)
            .map((_, idx) => (
              <Skeleton key={idx} className="h-8 w-full" />
            ))}
        </div>
      ) : (
        <>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="focus:outline-none focus:ring-0 text-primary px-4 py-4 text-3xl sm:text-5xl font-bold bg-card"
            placeholder="Title..."
          />
          <div className="flex-1 overflow-auto px-4 bg-card editor-content text-foreground">
            <EditorContent editor={editor} className="min-h-full ProseMirror" />
          </div>
        </>
      )}
    </div>
  );
}
