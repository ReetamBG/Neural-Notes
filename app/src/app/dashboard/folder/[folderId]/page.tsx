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
import useNotesStore from "@/store/notes.store";
import { Edit, FilePlus2, Trash2 } from "lucide-react";
import Link from "next/link";
import React, { useEffect } from "react";

const Page = () => {
  const {
    currentFolder,
    fetchAllNotesInFolder,
    notesInCurrentFolder,
    isNotesLoading,
    deleteNote,
  } = useNotesStore();

  useEffect(() => {
    if (!currentFolder?.id) return;

    fetchAllNotesInFolder(currentFolder.id);
  }, [currentFolder?.id, fetchAllNotesInFolder]);

  return (
    <>
      <BackgroundRippleEffect
        cellSize={70}
        className="-z-10 
         dark:[--cell-border-color:var(--color-neutral-800)]!
         dark:[--cell-fill-color:var(--color-neutral-950)]!
         dark:[--cell-shadow-color:var(--color-neutral-900)]!"
      />
      <div className="p-4 overflow-y-auto h-[calc(100vh-3rem)]">
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
                {notesInCurrentFolder.map((note) => (
                  <Card key={note.id} className="my-4 py-2">
                    <CardHeader>
                      <CardTitle className="text-accent-foreground text-lg sm:text-2xl">
                        {note.title}
                      </CardTitle>
                      <CardDescription className="text-foreground text-base">
                        {note.contentString?.slice(0, 100)}...
                      </CardDescription>
                      <CardAction className="flex gap-2 flex-col lg:flex-row">
                        <Link
                          href={`/dashboard/folder/${currentFolder?.id}/note/${note.id}/editor`}
                        >
                          <Button className="flex gap-2 bg-accent-foreground">
                            <Edit size={20} /> Edit
                          </Button>
                        </Link>
                        <Button
                          onClick={async () => await deleteNote(note.id)}
                          className="flex gap-2 bg-muted-foreground"
                        >
                          <Trash2 size={20} /> Delete
                        </Button>
                      </CardAction>
                    </CardHeader>
                    <CardFooter className="text-xs text-muted-foreground">
                      <p>
                        Last updated:{" "}
                        {new Date(note.updatedAt).toLocaleString()}
                      </p>
                    </CardFooter>
                  </Card>
                ))}
              </>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default Page;
