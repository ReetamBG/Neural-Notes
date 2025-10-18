"use client";

import React, { useEffect, useState } from "react";
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
  useSidebar,
} from "./ui/sidebar";
import {
  Calendar,
  ClipboardCheck,
  Home,
  Inbox,
  Search,
  Settings,
} from "lucide-react";
import useSidebarStore from "@/store/sidebar.store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

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
  const items = [
    {
      title: "Home",
      url: "#",
      icon: Home,
    },
    {
      title: "Inbox",
      url: "#",
      icon: Inbox,
    },
    {
      title: "Calendar",
      url: "#",
      icon: Calendar,
    },
    {
      title: "Search",
      url: "#",
      icon: Search,
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings,
    },
  ];

  const { aiSidebarOpen } = useSidebarStore();
  const { toggleSidebar, open } = useSidebar();

  useEffect(() => {
    // manual sync of sidebar state with store (could not figure out other way)
    if (aiSidebarOpen === !open) toggleSidebar();
  }, [aiSidebarOpen, open, toggleSidebar]);

  const [selectedTab, setSelectedTab] = useState<"doc-chat" | "notes-chat">(
    "doc-chat"
  );

  return (
    <Sidebar
      side="right"
      variant="inset"
      className="relative top-12 w-80 h-[calc(100vh-3rem)] p-0 border-l-1 bg-background"
    >
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <Tabs defaultValue="doc-chat" className="w-full">
              <TabsList className="w-full grid grid-cols-2 gap-0 p-0">
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
              <TabsContent value="doc-chat">
                {}
                Make changes to your document here. yada yada yada
              </TabsContent>
              <TabsContent value="notes-chat">
                Change your password here.
              </TabsContent>
            </Tabs>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AiSidebar;
