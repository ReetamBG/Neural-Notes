import AiSidebar from "@/components/AiSidebar";
import FoldersSidebar from "@/components/FoldersSidebar";
import NotesNavbar from "@/components/NotesNavbar";
import { SidebarInset } from "@/components/ui/sidebar";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex w-full overflow-hidden h-screen">
      <NotesNavbar />
      <FoldersSidebar />
      <SidebarInset>
        <main className="mt-12 flex flex-1 flex-col">{children}</main>
      </SidebarInset>
      <AiSidebar />
    </div>
  );
};

export default layout;
