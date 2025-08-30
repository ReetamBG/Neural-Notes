import { Note as NoteType } from "@prisma/client";
import Note from "./Note";
import { useNotes } from "@/hooks/notes.hooks";
import { LoaderCircle } from "lucide-react";

const AllNotes = ({ folderId }: { folderId: string }) => {
  const { notes, notesLoading } = useNotes(folderId);

  if (notesLoading) {
    return (
      <div className="w-full mt-10 flex justify-center gap-2">
        Loading <LoaderCircle className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full grid sm:grid-cols-2 lg:grid-cols-4 gap-5 my-5">
      {notes.map((note: NoteType) => (
        <Note key={note.id} note={note} />
      ))}
    </div>
  );
};

export default AllNotes;
