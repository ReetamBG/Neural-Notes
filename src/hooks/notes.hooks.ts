import useNotesStore from "@/store/notes.store";
import { useEffect } from "react";

export const useNotes = (folderId: string) => {
  const { notesLoading, notes, fetchAllNotes } = useNotesStore();
  useEffect(() => {
    (async () => {
      await fetchAllNotes(folderId);
    })();
  }, [fetchAllNotes, folderId]);

  return {notesLoading, notes };
};

export const useFolders = () =>  {
  const { foldersLoading, folders, fetchAllFolders } = useNotesStore();
  useEffect(() => {
    (async () => {
      await fetchAllFolders();
    })();
  }, [fetchAllFolders]);

  return { foldersLoading, folders};
};
