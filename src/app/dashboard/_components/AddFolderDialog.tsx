"use client";

import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { LoaderCircle, Plus } from "lucide-react";
import { useState } from "react";
import { DialogHeader } from "@/components/ui/dialog";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import useNotesStore from "@/store/notes.store";

export default function NewFolderDialog() {
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
      <DialogTrigger asChild className="mb-2">
        <Button className="flex justify-start">
          Create new <Plus />
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
}
