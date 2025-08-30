"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Folder, Note } from "@prisma/client";

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

    const session = await auth();
    if (!session?.user || !session.user.id)
      throw new Error("User not authenticated");
    const userId = session.user.id;

    const folder = await prisma.folder.create({
      data: {
        userId: userId,
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
    const session = await auth();
    if (!session?.user || !session.user.id)
      throw new Error("User not authenticated");
    const userId = session.user.id;

    const folders = await prisma.folder.findMany({
      where: {
        userId: userId,
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
  folderId: string
): Promise<ActionResult<{ note: Note }>> {
  try {
    const session = await auth();
    if (!session?.user || !session.user.id)
      throw new Error("User not authenticated");
    const userId = session.user.id;

    const note = await prisma.note.create({
      data: {
        title,
        content,
        userId,
        folderId,
      },
    });

    return { status: true, data: { note }, message: "Note saved successfully" };
  } catch (error) {
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

export async function updateNote(
  noteId: string,
  newTitle: string,
  newContent: string
): Promise<ActionResult<{ note: Note }>> {
  try {
    const note = await prisma.note.update({
      where: {
        id: noteId,
      },
      data: {
        title: newTitle,
        content: newContent,
      },
    });

    return { status: true, data: { note } };
  } catch (error) {
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

    return { status: true, data: { note: deletedNote } , message: "Note deleted"};
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

    return { status: true, data: { folder: deletedFolder }, message: "Folder deleted" };
  } catch (error) {
    return {
      status: false,
      message: error instanceof Error ? error.message : String(error),
    };
  }
}