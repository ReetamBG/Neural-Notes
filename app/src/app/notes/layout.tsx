import FoldersSidebar from "@/components/FoldersSidebar";
import NotesNavbar from "@/components/NotesNavbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="max-w-screen overflow-x-auto">
      <NotesNavbar />
      <SidebarProvider>
        <FoldersSidebar />
        <main className="mt-12 w-full">
          {children}
        </main>
      </SidebarProvider>
    </div>
  );
};

export default layout;
