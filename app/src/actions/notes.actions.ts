"use server";

import { Folder, Note } from "@/generated/prisma";
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

type ActionSuccess<T> = {
  status: true;
  data?: T;
  message?: string;
};

type ActionFailure = {
  status: false;
  message?: string;
};

type ActionResult<T = undefined> = ActionSuccess<T> | ActionFailure;

export async function createFolder(
  name: string
): Promise<ActionResult<{ folder: Folder }>> {
  try {
    if (!name.trim()) throw new Error("Folder name cannot be empty");

    const user = await currentUser();
    if (!user) throw new Error("User not authenticated");

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
    });
    if (!dbUser) throw new Error("User not found in database");

    const folder = await prisma.folder.create({
      data: {
        userId: dbUser.id,
        title: name,
      },
    });

    console.log("Folder added");
    return {
      status: true,
      data: { folder },
      message: "Folder created successfully",
    };
  } catch (error) {
    return {
      status: false,
      message: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function fetchFolders(): Promise<
  ActionResult<{ folders: Folder[] }>
> {
  try {
    const user = await currentUser();
    if (!user) throw new Error("User not authenticated");

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
    });
    if (!dbUser) throw new Error("User not found in database");

    const folders = await prisma.folder.findMany({
      where: {
        userId: dbUser.id,
      },
    });

    return { status: true, data: { folders } };
  } catch (error) {
    return {
      status: false,
      message: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function createNote(
  title: string,
  content: string,
  contentString: string,
  folderId: string
): Promise<ActionResult<{ note: Note }>> {
  try {
    const user = await currentUser();
    if (!user) throw new Error("User not authenticated");

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
    });
    if (!dbUser) throw new Error("User not found in database");

    const userId = dbUser.id;

    console.log({
      title: title,
      content: content,
      contentString: contentString,
      folderId: folderId,
    });

    const note = await prisma.note.create({
      data: {
        title,
        content,
        contentString,
        userId,
        folderId,
      },
    });

    return { status: true, data: { note }, message: "Note saved successfully" };
  } catch (error) {
    console.log("Error in create note:", error);
    return {
      status: false,
      message: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function fetchNotesByFolderId(
  folderId: string
): Promise<ActionResult<{ notes: Note[] }>> {
  try {
    const notes = await prisma.note.findMany({
      where: {
        folderId: folderId,
      },
    });

    return { status: true, data: { notes } };
  } catch (error) {
    return {
      status: false,
      message: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function fetchNoteById(
  noteId: string
): Promise<ActionResult<{ note: Note }>> {
  try {
    const note = await prisma.note.findUnique({
      where: {
        id: noteId,
      },
    });

    if (!note) {
      return {
        status: false,
        message: "Note not found",
      };
    }

    return { status: true, data: { note } };
  } catch (error) {
    return {
      status: false,
      message: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function updateNote(
  noteId: string,
  newTitle: string,
  newContent: string,
  newContentString: string
): Promise<ActionResult<{ note: Note }>> {
  try {
    const note = await prisma.note.update({
      where: {
        id: noteId,
      },
      data: {
        title: newTitle,
        content: newContent,
        contentString: newContentString,
      },
    });

    return { status: true, data: { note } };
  } catch (error) {
    console.log("Error in update note:", error);
    return {
      status: false,
      message: error instanceof Error ? error.message : String(error),
    };
  }
}

export const deleteNote = async (noteId: string) => {
  try {
    const deletedNote = await prisma.note.delete({
      where: { id: noteId },
    });

    return {
      status: true,
      data: { note: deletedNote },
      message: "Note deleted",
    };
  } catch (error) {
    return {
      status: false,
      message: error instanceof Error ? error.message : String(error),
    };
  }
};

export const deleteFolder = async (folderId: string) => {
  try {
    const deletedFolder = await prisma.folder.delete({
      where: { id: folderId },
    });

    return {
      status: true,
      data: { folder: deletedFolder },
      message: "Folder deleted",
    };
  } catch (error) {
    return {
      status: false,
      message: error instanceof Error ? error.message : String(error),
    };
  }
};
