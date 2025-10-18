"use client";
import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Note } from "@/generated/prisma/wasm";
import useNotesStore from "@/store/notes.store";
import { ClipboardCheck, Edit, FilePlus2, Trash2 } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const Page = () => {
  const {
    currentFolder,
    fetchAllNotesInFolder,
    notesInCurrentFolder,
    isNotesLoading,
  } = useNotesStore();

  useEffect(() => {
    if (!currentFolder?.id) return;

    fetchAllNotesInFolder(currentFolder.id);
  }, [currentFolder?.id, fetchAllNotesInFolder]);

  return (
    <div className="relative w-full h-[calc(100vh-3rem)]">
      {/* Background ripple effect positioned behind content */}
      <BackgroundRippleEffect
        cellSize={70}
        className="absolute inset-0 w-full h-full
         dark:[--cell-border-color:var(--color-neutral-800)]!
         dark:[--cell-fill-color:var(--color-neutral-950)]!
         dark:[--cell-shadow-color:var(--color-neutral-900)]!"
      />

      {/* Main content with relative positioning to ensure it's above background */}
      <div className="relative z-10 p-4 overflow-y-auto h-full">
        <Link href={`/dashboard/folder/${currentFolder?.id}/new-note/editor`}>
          <Button className="bg-accent-foreground">
            New Note <FilePlus2 />
          </Button>
        </Link>
        {isNotesLoading ? (
          <div className="space-y-2 my-4">
            {Array(3)
              .fill(0)
              .map((_, idx) => (
                <Skeleton key={idx} className="h-24 w-full" />
              ))}
          </div>
        ) : (
          <>
            {notesInCurrentFolder.length === 0 ? (
              <Card className="my-4 py-2">
                <CardContent>
                  <p className="text-center text-muted-foreground">
                    No notes found in this folder.
                    <br />
                    <br /> Create a new note to get started!
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                {notesInCurrentFolder.map((note) => {
                  return <NoteCard key={note.id} note={note} />;
                })}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const NoteCard = ({ note }: { note: Note }) => {
  const { currentFolder, deleteNote } = useNotesStore();
  const [isDeleting, setIsDeleting] = useState(false);
  return (
    <Card key={note.id} className="my-4 py-2">
      <CardHeader>
        <CardTitle className="text-accent-foreground text-lg sm:text-2xl">
          {note.title}
        </CardTitle>
        <CardDescription className="text-foreground text-base">
          {note.contentString?.slice(0, 100)}...
        </CardDescription>
        <CardAction className="flex gap-2 flex-col lg:flex-row">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="sm" className="h-8 rounded-lg flex gap-2">
                <ClipboardCheck />
                Analyze
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                Analyze the <br />
                accuracy of <br /> your note
              </p>
            </TooltipContent>
          </Tooltip>
          <div className="flex gap-2 md:gap-4 items-center">
            <Link
              href={`/dashboard/folder/${currentFolder?.id}/note/${note.id}/editor`}
            >
              <Button className="flex h-8 gap-2 bg-accent-foreground">
                <Edit size={20} /> Edit
              </Button>
            </Link>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={async () => {
                    setIsDeleting(true);
                    await deleteNote(note.id);
                    setIsDeleting(false);
                  }}
                  className="gap-2 h-8 text-accent-foreground hover:text-foreground cursor-pointer"
                >
                  {isDeleting ? (
                    <Spinner className="size-5" />
                  ) : (
                    <Trash2 size={20} />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete note</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </CardAction>
      </CardHeader>
      <CardFooter className="text-xs text-muted-foreground">
        <p>Last updated: {new Date(note.updatedAt).toLocaleString()}</p>
      </CardFooter>
    </Card>
  );
};

export default Page;
