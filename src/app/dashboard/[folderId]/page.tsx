"use client";

import React, { use } from "react";
import NewNoteDialog from "./_components/NewNotesDialog";
import Notes from "./_components/AllNotes";

const Page = ({ params }: { params: Promise<{ folderId: string }> }) => {
  const { folderId } = use(params);
  

  return (
    <div className="w-full px-5 sm:px-10"> 
      <NewNoteDialog folderId={folderId} />
      <Notes folderId={folderId} />
    </div>
  );
};

export default Page;
