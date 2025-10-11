import {
  createFolder,
  createNote,
  deleteFolder,
  deleteNote,
  fetchFolders,
  fetchNotesByFolderId,
  updateNote,
} from "@/actions/notes.actions";
import { Folder, Note } from "@/generated/prisma";
import { toast } from "sonner";
import { create } from "zustand";

interface NotesState {
  notes: Note[];
  folders: Folder[];
  selectedFolder: Folder | null;
  notesLoading: boolean; // to track if content is being fetched
  foldersLoading: boolean;
  actionProcessing: boolean; // to track if an action is being processed (eg form submission)

  addNewNote: (
    title: string,
    content: string,
    folderId: string
  ) => Promise<void>;

  fetchAllNotes: (folderId: string) => Promise<void>;
  updateNote: (noteId: string, title: string, content: string) => Promise<void>;
  deleteNote: (noteId: string) => Promise<void>;
  fetchAllFolders: () => Promise<void>;
  addNewFolder: (folderName: string) => Promise<void>;
  deleteFolder: (folderId: string) => Promise<void>
}

const useNotesStore = create<NotesState>((set) => ({
  notes: [],
  folders: [],
  selectedFolder: null,
  notesLoading: false,
  foldersLoading: false,
  actionProcessing: false,

  fetchAllNotes: async (folderId: string) => {
    set({ notesLoading: true });

    const res = await fetchNotesByFolderId(folderId);
    if (!res.status || !res.data) {
      toast.error(res.message || "Failed to load notes");
    } else {
      const notes = res.data.notes;
      set({ notes: notes });
    }

    set({ notesLoading: false });
  },

  addNewNote: async (title: string, content: string, folderId: string) => {
    set({ actionProcessing: true });
    const res = await createNote(title, content, folderId);

    if (!res.status || !res.data) {
      toast.error(res.message || "Failed to save note");
    } else {
      const newNote = res.data.note;
      toast.success(res.message);
      set((state) => ({ notes: [...state.notes, newNote] }));
    }

    set({ actionProcessing: false });
  },

  updateNote: async (noteId: string, title: string, content: string) => {
    set({ actionProcessing: true });

    const res = await updateNote(noteId, title, content);
    if (!res.status || !res.data) {
      toast.error(res.message || "Something went wrong");
    } else {
      const updatedNote = res.data.note;
      set((state) => ({
        notes: state.notes.map((note) =>
          note.id === updatedNote.id ? updatedNote : note
        ),
      }));
      toast.success("Note updated successfully");
    }

    set({ actionProcessing: false });
  },

  deleteNote: async (noteId: string) => {
    set({ actionProcessing: true });

    const res = await deleteNote(noteId);
    if (!res.status || !res.data) {
      toast.error(res.message || "Failed to delete note");
    } else {
      toast.success(res.message);
      set((state) => ({
        notes: state.notes.filter((note) => note.id !== noteId),
      }));
    }

    set({ actionProcessing: false });
  },

  fetchAllFolders: async () => {
    set({ foldersLoading: true });

    const res = await fetchFolders();
    if (!res.status || !res.data) {
      toast.error(res.message || "Failed to load folders");
    } else {
      const folders = res.data.folders;
      set({ folders });
    }

    set({ foldersLoading: false });
  },

  addNewFolder: async (folderName: string) => {
    set({ actionProcessing: true });
    const res = await createFolder(folderName);
    if (res.status === true && res.data) {
      const newFolder = res.data.folder;
      set((state) => ({ folders: [...state.folders, newFolder] }));
      toast.success(res.message);
    } else {
      toast.error(res.message || "Failed to create folder");
    }
    set({ actionProcessing: false });
  },

  deleteFolder: async (folderId: string) => {
    set({ actionProcessing: true });

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

    set({ actionProcessing: false });
  }
}));

export default useNotesStore;
