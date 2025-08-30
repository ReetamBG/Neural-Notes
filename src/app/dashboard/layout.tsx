import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import React from "react";
import FolderSidebar from "./_components/FolderSidebar";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="w-screen mt-5">
      <SidebarProvider>
        <FolderSidebar />
        <SidebarTrigger />
        {children}
      </SidebarProvider>
    </main>
  );
};

export default layout;
