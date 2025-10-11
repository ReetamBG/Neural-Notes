import FoldersSidebar from "@/components/FoldersSidebar";
import NotesNavbar from "@/components/NotesNavbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <NotesNavbar />
      <SidebarProvider>
        <FoldersSidebar />
        <main className="mt-12">
          {children}
        </main>
      </SidebarProvider>
    </div>
  );
};

export default layout;
