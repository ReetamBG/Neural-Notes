"use client";

import {
  Folder,
  FolderOpen,
  FolderPlus,
  LoaderCircle,
  Trash2,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import useNotesStore from "@/store/notes.store";
import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { redirect } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export default function FolderSidebar() {
  const { folders, fetchAllFolders, selectedFolder } = useNotesStore();

  useEffect(() => {
    fetchAllFolders();
  }, [fetchAllFolders]);

  return (
    <Sidebar className="relative top-12 w-64">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="mb-2 flex justify-between items-center">
            <span>Folders</span>
            <NewFolderDialog />
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {folders.map((f) => {
                const isSelected = selectedFolder?.id === f.id;
                return (
                  <SidebarMenuItem
                    key={f.id}
                    onClick={() => {
                      useNotesStore.setState({ selectedFolder: f });
                    }}
                    className={cn(
                      "transition-colors rounded-md",
                      isSelected
                        ? "bg-accent text-accent-foreground"
                        : "hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    <SidebarMenuButton asChild>
                      <Link
                        href={`/notes/folder/${f.id}`}
                        className="flex justify-between w-full items-center"
                      >
                        <div className="flex items-center gap-2">
                          {isSelected ? (
                            <FolderOpen size={20} />
                          ) : (
                            <Folder size={20} />
                          )}
                          <span>{f.title}</span>
                        </div>
                        <DeleteFolderDialog folderId={f.id} />
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

const NewFolderDialog = () => {
  const [open, setOpen] = useState(false); // control dialog
  const { addNewFolder, actionProcessing } = useNotesStore();

  async function handleAddFolder(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const folderName = formData.get("folderName") as string;

    await addNewFolder(folderName);
    form.reset();
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-lg h-6 text-xs">
          New
          <FolderPlus size={10} />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Folder name</DialogTitle>
          <DialogDescription className="sr-only" />
          <form onSubmit={handleAddFolder} className="flex gap-5">
            <Input name="folderName" required />
            <Button type="submit" disabled={actionProcessing}>
              {actionProcessing ? (
                <>
                  <LoaderCircle className="animate-spin" />
                </>
              ) : (
                "Add"
              )}
            </Button>
          </form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

const DeleteFolderDialog = ({ folderId }: { folderId: string }) => {
  const { selectedFolder, deleteFolder } = useNotesStore();

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <span
          // onClick={(e) => {
            // e.stopPropagation(); // prevent Link click propagation
            // e.preventDefault(); // prevent Link click propagation
          // }}
          className="p-1 hover:text-primary rounded cursor-pointer "
        >
          <Trash2 size={16} />
        </span>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            folder and remove all associated notes.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              deleteFolder(folderId);

              // if selected folder is deleted redirect to /dashboard
              if (selectedFolder?.id === folderId) {
                redirect("/notes");
                useNotesStore.setState({ selectedFolder: null });
              }
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
