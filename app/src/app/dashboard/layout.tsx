import AiServerStatusBanner from "@/components/AiServerStatusBanner";
import AiSidebar from "@/components/AiSidebar";
import FoldersSidebar from "@/components/FoldersSidebar";
import NotesNavbar from "@/components/NotesNavbar";
import { SidebarInset } from "@/components/ui/sidebar";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

const layout = async ({ children }: { children: React.ReactNode }) => {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  return (
    <div className="flex w-full overflow-hidden h-screen">
      <AiServerStatusBanner />
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
