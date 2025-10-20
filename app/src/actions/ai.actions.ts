"use server";

import axios from "@/lib/axios";
import prisma from "@/lib/prisma";

export const uploadDocument = async (
  file: File,
  userId: string,
  folderId: string
) => {
  try {
    const data = new FormData();
    data.append("file", file);
    data.append("folder_id", folderId);
    data.append("user_id", userId);

    let url;
    if (file.type === "application/pdf") {
      url = "/api/v1/upload/pdf";
    } else if (file.type === "video/mp4") {
      url = "/api/v1/upload/video";
    } else {
      throw new Error(
        "Unsupported file type. Please upload a PDF or MP4 file."
      );
    }

    await axios.post(url, data);
    return { status: true };
  } catch (error) {
    console.log(error);
    return { status: false };
  }
};

// takes in all notes content in the folder as one string and uploads it
export const uploadNotes = async (
  notesContent: string,
  userId: string,
  folderId: string
) => {
  console.log("userId:", userId);
  console.log("folderId:", folderId);
  console.log("notesContent:", notesContent);
  try {
    const data = {
      notes: notesContent,
      user_id: userId,
      folder_id: folderId,
    };

    const url = "/api/v1/upload/notes";

    await axios.post(url, data);
    return { status: true };
  } catch (error) {
    console.log(error);
    return { status: false };
  }
};

export const fetchAllNotesContent = async (
  userId: string,
  folderId: string
) => {
  try {
    const data = await prisma.note.findMany({
      where: {
        userId,
        folderId,
      },
      select: {
        contentString: true,
      },
    });

    const allContent = data.map((note) => note.contentString).join("\n");
    return allContent;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export interface NoteAnalysisResult {
  accuracy: number;   // accuracy of the note compared to the reference material
  llm_note: string;   // a note from llm
  missing_info: string[];
  missing_keywords: string[];
  roadmap: string[]
}
// analyze a single note
export const analyzeNote = async (
  noteTitle: string,
  noteContent: string,
  userId: string,
  folderId: string
) => {
  try {
    const data = {
      title: noteTitle,
      text: noteContent,
      user_id: userId,
      folder_id: folderId,
    };

    const url = "/api/v1/analysis/";

    const response = await axios.post(url, data);
    return response.data as NoteAnalysisResult;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getVectorDbStatus = async (userId: string, folderId: string): Promise<boolean> => {
  try {
    const docVecDbStatus = await axios.post(
      "/api/v1/chat/doc-vector-db-exist",
      {
        user_id: userId,
        folder_id: folderId,
      }
    );

    console.log(docVecDbStatus.data.status);
    return docVecDbStatus.data.status;
  } catch (error) {
    console.log(error);
    return false;
  }
};
