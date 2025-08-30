import {
  Card,
  CardHeader,
  CardTitle,
  CardAction,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import React, { useState } from "react";
import { Note as NoteType } from "@prisma/client";
import { Edit, LoaderCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@radix-ui/react-dropdown-menu";
import useNotesStore from "@/store/notes.store";

const Note = ({ note }: { note: NoteType }) => {
  const { deleteNote, actionProcessing  } = useNotesStore();

  return (
    <Card className="flex flex-col min-h-[300px] h-[300px] min-w-auto">
      <CardHeader>
        <CardTitle className="text-accent-foreground text-xl">
          {note.title}
        </CardTitle>
        <div className="flex gap-4">
          <CardAction>
            <EditNoteDialog note={note} />
          </CardAction>
          <CardAction>
            <button disabled={actionProcessing} className="cursor-pointer hover:text-accent-foreground" onClick={() => deleteNote(note.id)}>
              <Trash2 size={20} />
            </button>
          </CardAction>
        </div>
      </CardHeader>
      <CardContent className="overflow-hidden">
        <p>{note.content}</p>
      </CardContent>
      <CardFooter className="mt-auto">
        <p className="text-muted-foreground text-xs">
          Last updated {formatLastUpdated(note.updatedAt)}
        </p>
      </CardFooter>
    </Card>
  );
};

export default Note;

const EditNoteDialog = ({ note }: { note: NoteType }) => {
  const { actionProcessing, updateNote } = useNotesStore();
  const [open, setOpen] = useState(false); // control dialog
  const [title, setTitle] = useState(note.title); 
  const [content, setContent] = useState(note.content); 

  // to track if anything has changed. Otherwise save button is kept disabled
  const isChanged = title !== note.title || content !== note.content

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;

    await updateNote(note.id, title, content);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="hover:text-accent-foreground cursor-pointer">
          <Edit size={20} />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit note</DialogTitle>
          <DialogDescription className="sr-only" />
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label>Title</Label>
              <Input
                onChange={(e)=>{setTitle(e.target.value)}}
                value={title}
                id="title"
                name="title"
                required
              />
            </div>
            <div className="grid gap-3">
              <Label>Content</Label>
              <Textarea
                onChange={(e)=>{setContent(e.target.value)}}
                rows={10}
                value={content || ""}
                id="content"
                name="content"
                required
              />
            </div>
          </div>
          <DialogFooter className="mt-5">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button disabled={actionProcessing || !isChanged} type="submit">
              {actionProcessing ? (
                <>
                  <LoaderCircle className="animate-spin" /> Saving...
                </>
              ) : (
                "Save changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const formatLastUpdated = (date: Date) => {
  const now = new Date();
  const diffInHours = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60),
  );

  if (diffInHours < 1) {
    return "Just now";
  } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
  } else {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  }
};
