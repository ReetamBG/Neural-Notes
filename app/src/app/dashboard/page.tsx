"use client";

import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect";
import useNotesStore from "@/store/notes.store";
import React from "react";

const Page = () => {
  const { folders } = useNotesStore();
  return (
    <div className="w-full h-full grid place-content-center text-muted-foreground text-lg sm:text-2xl">
      <BackgroundRippleEffect
        cellSize={70}
        className="-z-10 
         dark:[--cell-border-color:var(--color-neutral-800)]!
         dark:[--cell-fill-color:var(--color-neutral-950)]!
         dark:[--cell-shadow-color:var(--color-neutral-900)]!"
      />
      {folders.length === 0 ? (
        <p>Create a new folder to get started!</p>
      ) : (
        <p>Select a folder to continue</p>
      )}
    </div>
  );
};

export default Page;
