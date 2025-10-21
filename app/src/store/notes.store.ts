import {
  createFolder,
  createNote,
  deleteFolder,
  deleteNote,
  fetchFolders,
  fetchNotesByFolderId,
  fetchNoteById,
  updateNote,
} from "@/actions/notes.actions";
import { Folder, Note } from "@/generated/prisma";
import { toast } from "sonner";
import { create } from "zustand";

interface NotesState {
  notesInCurrentFolder: Note[];
  folders: Folder[];
  currentFolder: Folder | null;
  currentNote: Note | null;
  isNotesLoading: boolean; // to track if content is being fetched
  isFoldersLoading: boolean;
  isActionProcessing: boolean; // to track if an action is being processed (eg form submission)
  isNoteContentLoading: boolean; // to track if note content is being fetched

  addNewNote: (
    title: string,
    content: string,
    contentString: string,
    folderId: string
  ) => Promise<void>;

  fetchAllNotesInFolder: (folderId: string) => Promise<void>;
  fetchNoteById: (noteId: string) => Promise<Note | null>;
  updateNote: (noteId: string, title: string, content: string, contentString: string) => Promise<void>;
  deleteNote: (noteId: string) => Promise<void>;
  fetchAllFolders: () => Promise<void>;
  addNewFolder: (folderName: string) => Promise<void>;
  deleteFolder: (folderId: string) => Promise<void>
}

const useNotesStore = create<NotesState>((set) => ({
  notesInCurrentFolder: [],
  folders: [],
  currentNote: null,
  currentFolder: null,
  isNotesLoading: false,
  isFoldersLoading: false,
  isActionProcessing: false,
  isNoteContentLoading: false,

  fetchAllNotesInFolder: async (folderId: string) => {
    set({ isNotesLoading: true });

    const res = await fetchNotesByFolderId(folderId);
    if (!res.status || !res.data) {
      toast.error(res.message || "Failed to load notes");
    } else {
      const notes = res.data.notes;
      set({ notesInCurrentFolder: notes });
    }

    set({ isNotesLoading: false });
  },

  fetchNoteById: async (noteId: string) => {
    set({ isNoteContentLoading: true });
    const res = await fetchNoteById(noteId);
    if (!res.status || !res.data) {
      toast.error(res.message || "Failed to load note");
      set({ isNoteContentLoading: false });
      return null;
    } else {
      const note = res.data.note;
      set({ currentNote: note });
      set({ isNoteContentLoading: false });
      return note;
    }
  },

  addNewNote: async (title: string, content: string, contentString: string, folderId: string) => {
    if(!title.trim().length || !content.trim().length) {
      toast.error("Title and content cannot be empty");
      return;
    }

    if (!folderId) {
      toast.error("Folder ID is required to create a note");
      return;
    }

    set({ isActionProcessing: true });
    const res = await createNote(title, content, contentString, folderId);

    if (!res.status || !res.data) {
      toast.error(res.message || "Failed to save note");
    } else {
      const newNote = res.data.note;
      toast.success(res.message);
      set((state) => ({ notesInCurrentFolder: [...state.notesInCurrentFolder, newNote] }));
    }

    set({ isActionProcessing: false });
  },

  updateNote: async (noteId: string, title: string, content: string, contentString: string) => {
    set({ isActionProcessing: true });

    const res = await updateNote(noteId, title, content, contentString);
    if (!res.status || !res.data) {
      toast.error(res.message || "Something went wrong");
    } else {
      const updatedNote = res.data.note;
      set((state) => ({
        notesInCurrentFolder: state.notesInCurrentFolder.map((note) =>
          note.id === updatedNote.id ? updatedNote : note
        ),
      }));
      toast.success("Note updated successfully");
    }

    set({ isActionProcessing: false });
  },

  deleteNote: async (noteId: string) => {
    set({ isActionProcessing: true });

    const res = await deleteNote(noteId);
    if (!res.status || !res.data) {
      toast.error(res.message || "Failed to delete note");
    } else {
      toast.success(res.message);
      set((state) => ({
        notesInCurrentFolder: state.notesInCurrentFolder.filter((note) => note.id !== noteId),
      }));
    }

    set({ isActionProcessing: false });
  },

  fetchAllFolders: async () => {
    set({ isFoldersLoading: true });

    const res = await fetchFolders();
    if (!res.status || !res.data) {
      toast.error(res.message || "Failed to load folders");
    } else {
      const folders = res.data.folders;
      set({ folders });
    }

    set({ isFoldersLoading: false });
  },

  addNewFolder: async (folderName: string) => {
    set({ isActionProcessing: true });
    const res = await createFolder(folderName);
    if (res.status === true && res.data) {
      const newFolder = res.data.folder;
      set((state) => ({ folders: [...state.folders, newFolder] }));
      toast.success(res.message);
    } else {
      toast.error(res.message || "Failed to create folder");
    }
    set({ isActionProcessing: false });
  },

  deleteFolder: async (folderId: string) => {
    set({ isActionProcessing: true });

    const res = await deleteFolder(folderId);
    if (res.status === true && res.data) {
      const deletedFolder = res.data.folder;
      set((state) => ({
        folders: state.folders.filter((folder) => folder.id !== deletedFolder.id),
      }));
      toast.success(res.message);
    } else {
      toast.error(res.message || "Failed to delete folder");
    }

    set({ isActionProcessing: false });
  }
}));

export default useNotesStore;
