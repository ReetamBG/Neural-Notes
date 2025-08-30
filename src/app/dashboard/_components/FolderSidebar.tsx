"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import NewFolderDialog from "./AddFolderDialog";
import { Folder } from "@prisma/client";
import { LoaderCircle, Trash2 } from "lucide-react";
import { useFolders } from "@/hooks/notes.hooks";
import { useState } from "react";
import useNotesStore from "@/store/notes.store";
import { redirect } from "next/navigation";

export default function FolderSidebar() {
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
  const { folders, foldersLoading } = useFolders();
  const { deleteFolder } = useNotesStore();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="flex justify-between">
            Folders
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="flex flex-col gap-1">
              <NewFolderDialog />
              {foldersLoading ? (
                <div className="w-full mt-10 flex justify-center gap-2">
                  Loading <LoaderCircle className="animate-spin" />
                </div>
              ) : (
                folders.map((f: Folder) => (
                  <SidebarMenuItem key={f.id}>
                    <Button
                      className={`flex justify-between items-center w-full ${
                        selectedFolder?.id === f.id
                          ? "bg-accent text-accent-foreground"
                          : ""
                      }`}
                      variant="outline"
                      asChild
                    >
                      <Link
                        href={`/dashboard/${f.id}`}
                        className="flex justify-between items-center w-full px-2 py-1"
                        onClick={() => setSelectedFolder(f)}
                      >
                        <span className="truncate">{f.title}</span>
                        <span
                          onClick={(e) => {
                            e.stopPropagation(); // prevent Link click propagation
                            e.preventDefault(); // prevent Link click propagation
                            deleteFolder(f.id);

                            // if selected folder is deleted redirect to /dashboard
                            if (selectedFolder?.id === f.id) {
                              redirect("/dashboard");
                            }
                          }}
                          className="p-1 hover:text-accent-foreground rounded cursor-pointer"
                        >
                          <Trash2 size={16} />
                        </span>
                      </Link>
                    </Button>
                  </SidebarMenuItem>
                ))
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
