"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarProvider,
  useSidebar,
} from "./ui/sidebar";
import useSidebarStore from "@/store/sidebar.store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { cn, isFileSizeValid } from "@/lib/utils";
import useNotesStore from "@/store/notes.store";
import { getCurrentDBUser } from "@/actions/user.actions";
import { FileUpload } from "./ui/file-upload";
import { Folder, User } from "@/generated/prisma";
import { toast } from "sonner";
import { MultiStepLoader } from "./ui/multi-step-loader";
import ChatBot from "./ChatBot";
import { Button } from "./ui/button";
import { PlusCircle, RefreshCcw } from "lucide-react";
import { motion } from "motion/react";
import {
  fetchAllNotesContent,
  getVectorDbStatus,
  uploadDocument,
  uploadNotes,
} from "@/actions/ai.actions";
import LoadingContent from "./LoadingContent";

const AiSidebar = () => {
  const { aiSidebarOpen } = useSidebarStore();
  return (
    <SidebarProvider
      className={`${
        aiSidebarOpen ? "w-80" : "w-0"
      } transition-width duration-100`}
    >
      <AiSidebarContent />
    </SidebarProvider>
  );
};

const AiSidebarContent = () => {
  const { aiSidebarOpen } = useSidebarStore();
  const { toggleSidebar, open } = useSidebar();
  const { currentFolder } = useNotesStore();

  useEffect(() => {
    // manual sync of sidebar state with store (could not figure out other way)
    if (aiSidebarOpen === !open) toggleSidebar();
  }, [aiSidebarOpen, open, toggleSidebar]);

  return (
    <Sidebar
      side="right"
      variant="inset"
      className="relative top-12 w-80 h-[calc(100vh-3rem)] p-0 border-l-1 bg-background"
    >
      <SidebarContent className="h-full">
        <SidebarGroup className="h-full">
          <SidebarGroupContent className="h-full">
            {currentFolder ? (
              <ChatTabs />
            ) : (
              <p className="text-muted-foreground text-base text-center h-full flex items-center w-full justify-center">
                Please select a <br />
                folder to chat with its
                <br /> documents or notes.
              </p>
            )}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AiSidebar;

const ChatTabs = () => {
  const { currentFolder } = useNotesStore();
  const [selectedTab, setSelectedTab] = useState<"doc-chat" | "notes-chat">(
    "doc-chat"
  );
  const [loadingUser, setLoadingUser] = useState(true);

  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    (async () => {
      setLoadingUser(true);
      const userFromDB = await getCurrentDBUser();
      setUser(userFromDB);
      setLoadingUser(false);
    })();
  }, [currentFolder]);

  return (
    <div className="flex flex-col h-full">
      <Tabs defaultValue="doc-chat" className="flex flex-col h-full">
        <TabsList className="w-full grid grid-cols-2 gap-0 p-0 flex-shrink-0">
          <Tooltip>
            <TooltipTrigger asChild>
              <TabsTrigger
                onClick={() => setSelectedTab("doc-chat")}
                value="doc-chat"
                className={cn(
                  "w-full",
                  selectedTab === "doc-chat"
                    ? "bg-accent text-accent-foreground"
                    : ""
                )}
              >
                Chat with doc
              </TabsTrigger>
            </TooltipTrigger>
            <TooltipContent className="z-100">
              <p>
                Chat with the document
                <br />
                uploaded in this folder
              </p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <TabsTrigger
                onClick={() => setSelectedTab("notes-chat")}
                value="notes-chat"
                className={cn(
                  "w-full",
                  selectedTab === "notes-chat"
                    ? "bg-accent text-accent-foreground"
                    : ""
                )}
              >
                Chat with notes
              </TabsTrigger>
            </TooltipTrigger>
            <TooltipContent className="z-100">
              <p>
                Chat with your notes
                <br /> in this folder.
              </p>
            </TooltipContent>
          </Tooltip>
        </TabsList>
        {loadingUser ? (
          <div className="flex-1 overflow-hidden">
            <LoadingContent />
          </div>
        ) : (
          <>
            <TabsContent value="doc-chat" className="flex-1 overflow-hidden mt-2">
              <DocChat userId={user!.id} currentFolder={currentFolder!} />
            </TabsContent>
            <TabsContent value="notes-chat" className="flex-1 overflow-hidden mt-2">
              <NotesChat userId={user!.id} currentFolder={currentFolder!} />
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
};

const DocChat = ({
  userId,
  currentFolder,
}: {
  userId: string;
  currentFolder: Folder;
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [docVectorDBExists, setDocVectorDBExists] = useState(false);
  const { isNotesLoading } = useNotesStore();

  useEffect(() => {
    (async () => {
      const vectorDbStatus = await getVectorDbStatus(userId, currentFolder.id)
      setDocVectorDBExists(vectorDbStatus);
    })();
  }, [userId, currentFolder]);

  const handleFileUpload = async (files: File[]) => {
    if (!currentFolder || !userId) return;

    if (!isFileSizeValid(files[0], 30)) {
      toast.error("File size exceeds the 50MB limit. Please upload a smaller file.");
      return;
    }

    setIsUploading(true);
    const res = await uploadDocument(files[0], userId, currentFolder.id);

    if (res && res.status === false) {
      toast.error("File upload failed. Please try again.");
      setIsUploading(false);
      return;
    }

    toast.success("File uploaded successfully!");
    setDocVectorDBExists(true);
    setIsUploading(false);
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const steps = [
    "Uploading file",
    "Processing file",
    "Creating vector database",
  ];

  if (isUploading) {
    return (
      <MultiStepLoader
        loading={isUploading}
        loadingStates={steps.map((step) => ({ text: step }))}
      />
    );
  }

  if (docVectorDBExists) {
    return (
      <div className="flex flex-col h-full">
        {isNotesLoading ? (
          <div className="flex-1 overflow-hidden">
            <LoadingContent />
          </div>
        ) : (
          <>
            <div className="flex-shrink-0 mb-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  fileInputRef.current?.click();
                }}
                className="w-full"
              >
                <input
                  type="file"
                  accept=".pdf,.mp4"
                  hidden
                  ref={fileInputRef}
                  onChange={async (e) => {
                    if (e.target.files?.length) {
                      await handleFileUpload(Array.from(e.target.files));
                      e.target.value = ""; // reset input so same file can be re-uploaded
                    }
                  }}
                />
                Upload New <PlusCircle />{" "}
              </Button>
            </div>

            <div className="flex-1 overflow-hidden">
              <ChatBot
                url="/api/v1/chat"
                userId={userId}
                currentFolderId={currentFolder.id}
              />
            </div>
          </>
        )}
      </div>
    );
  } else {
    return <FileUpload onChange={handleFileUpload} />;
  }
};

const NotesChat = ({
  userId,
  currentFolder,
}: {
  userId: string;
  currentFolder: Folder;
}) => {
  const [notesVectorDBExists, setNotesVectorDBExists] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { notesInCurrentFolder, isNotesLoading } = useNotesStore();

  useEffect(() => {
    (async () => {
      const vectorDbStatus = await getVectorDbStatus(userId, currentFolder.id)
      setNotesVectorDBExists(vectorDbStatus);
    })();
  }, [currentFolder, userId]);

  const handleNotesUpload = async () => {
    if (!currentFolder || !userId) return;

    if (notesInCurrentFolder.length === 0) {
      toast.error("Please make some notes first");
      return;
    }

    setIsUploading(true);
    // fetch all notes content in the current folder
    const notesContent = await fetchAllNotesContent(userId, currentFolder.id);
    if (!notesContent) {
      toast.error("Please make some notes first");
      setIsUploading(false);
      return;
    }

    // upload to create vector db
    const res = await uploadNotes(notesContent, userId, currentFolder.id);

    if (res && res.status === false) {
      toast.error("Notes upload failed. Please try again.");
      setIsUploading(false);
      return;
    }

    toast.success("Notes uploaded successfully!");
    setNotesVectorDBExists(true);
    setIsUploading(false);
  };

  const steps = [
    "Getting your notes",
    "Processing notes",
    "Understanding them hmmm...",
  ];

  if (isUploading) {
    return (
      <MultiStepLoader
        loading={isUploading}
        loadingStates={steps.map((step) => ({ text: step }))}
      />
    );
  }

  if (notesVectorDBExists) {
    return (
      <div className="flex flex-col h-full">
        {isNotesLoading ? (
          <div className="flex-1 overflow-hidden">
            <LoadingContent />
          </div>
        ) : (
          <>
            <div className="flex-shrink-0 mb-2">
              <Button variant="outline" size="sm" onClick={handleNotesUpload} className="w-full">
                Refresh Notes <RefreshCcw />
              </Button>
            </div>

            <div className="flex-1 overflow-hidden">
              <ChatBot
                url="/api/v1/chat/notes"
                userId={userId}
                currentFolderId={currentFolder.id}
              />
            </div>
          </>
        )}
      </div>
    );
  } else {
    return (
      <div className="flex w-full flex-col items-center justify-center h-full">
        {isNotesLoading ? (
          <LoadingContent />
        ) : (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNotesUpload}
              className="w-full"
            >
              Upload Notes <PlusCircle />
            </Button>
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center flex-1 text-muted-foreground space-y-3 p-4"
            >
              <p className="text-center text-lg font-medium">
                Create some notes and press the upload button to get started!
              </p>
              <div className="flex space-x-2 mt-4">
                <motion.span
                  className="w-3 h-3 bg-primary/50 rounded-full"
                  animate={{ y: [0, -2, 0] }}
                  transition={{
                    repeat: Infinity,
                    duration: 1,
                    ease: "easeInOut",
                    delay: 0,
                  }}
                />
                <motion.span
                  className="w-3 h-3 bg-primary/50 rounded-full"
                  animate={{ y: [0, -2, 0] }}
                  transition={{
                    repeat: Infinity,
                    duration: 1,
                    ease: "easeInOut",
                    delay: 0.3,
                  }}
                />
                <motion.span
                  className="w-3 h-3 bg-primary/50 rounded-full"
                  animate={{ y: [0, -2, 0] }}
                  transition={{
                    repeat: Infinity,
                    duration: 1,
                    ease: "easeInOut",
                    delay: 0.6,
                  }}
                />
              </div>
            </motion.div>
          </>
        )}
      </div>
    );
  }
};
