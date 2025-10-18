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
  SidebarProvider,
} from "@/components/ui/sidebar";
import useNotesStore from "@/store/notes.store";
import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
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
import { Skeleton } from "./ui/skeleton";
import { Card, CardContent } from "./ui/card";

export default function FolderSidebar() {
  const { folders, fetchAllFolders, currentFolder, isFoldersLoading } =
    useNotesStore();

  useEffect(() => {
    fetchAllFolders();
  }, [fetchAllFolders]);

  return (
    // <Sidebar variant="inset" className="relative top-12 w-64 h-[calc(100vh-3rem)]">
    <SidebarProvider className="w-64 ">
      <Sidebar
        variant="inset"
        className="relative top-12 w-64 h-[calc(100vh-3rem)] p-0 border-r-1 bg-background"
      >
        <SidebarContent className="">
          <SidebarGroup>
            <SidebarGroupLabel className="mb-2 flex justify-between items-center">
              <span>Folders</span>
              <NewFolderDialog />
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {isFoldersLoading ? (
                  <div className="space-y-2">
                    {Array(3)
                      .fill(0)
                      .map((_, idx) => (
                        <Skeleton key={idx} className="h-8 w-full" />
                      ))}
                  </div>
                ) : (
                  <>
                    {folders.length === 0 ? (
                      <Card className="my-4 py-2">
                        <CardContent>
                          <p className="text-center text-muted-foreground">
                            No folders found.
                            <br />
                            <br /> Create a new folder to get started!
                          </p>
                        </CardContent>
                      </Card>
                    ) : (
                      <>
                        {folders.map((f) => {
                          const isSelected = currentFolder?.id === f.id;
                          return (
                            <SidebarMenuItem
                              key={f.id}
                              onClick={() => {
                                useNotesStore.setState({ currentFolder: f });
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
                                  href={`/dashboard/folder/${f.id}`}
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
                      </>
                    )}
                  </>
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  );
}

const NewFolderDialog = () => {
  const [open, setOpen] = useState(false); // control dialog
  const { addNewFolder, isActionProcessing } = useNotesStore();

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
        <Button className="rounded-lg h-6 text-xs bg-accent-foreground">
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
            <Button type="submit" disabled={isActionProcessing}>
              {isActionProcessing ? (
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
  const { currentFolder, deleteFolder } = useNotesStore();
  const router = useRouter();

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
              if (currentFolder?.id === folderId) {
                useNotesStore.setState({ currentFolder: null });
                router.push("/dashboard");
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
