"use client"

import useNotesStore from "@/store/notes.store";
import React from "react";

const Page = () => {
  const {folders} = useNotesStore();
  return (
    <div className="w-full h-full grid place-content-center text-muted-foreground text-lg sm:text-2xl">
      {folders.length === 0 ? (
        <p>Create a new folder to get started!</p>
      ) : (
        <p>Select a folder to continue</p>
      )}
    </div>
  );
};

export default Page;
