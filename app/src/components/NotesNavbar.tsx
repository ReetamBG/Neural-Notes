// TODO: Show the analyze button only when editor is open
// TODO: Save analysis results to the note metadata
// TODO: or maybe move the analyze button to the notes card only

"use client";

import React, { useEffect } from "react";
import { NavbarLogo } from "./ui/resizable-navbar";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { SignOutButton, useUser } from "@clerk/nextjs";
import { Button } from "./ui/button";
import { redirect } from "next/navigation";
import { syncClerkUserToDB } from "@/actions/user.actions";
import useSidebarStore from "@/store/sidebar.store";
import { useIsMobile } from "@/hooks/use-mobile";
import { Bot, Folder } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const NotesNavbar = () => {
  const { isLoaded, user } = useUser();
  const { toggleAiSidebar, toggleAiSidebarMobile, toggleFoldersSidebar } = useSidebarStore();
  const isMobile = useIsMobile();

  if (!user) redirect("/");

  useEffect(() => {
    (async () => {
      await syncClerkUserToDB();
    })();
  });

  return (
    <>
      {/* Placeholder for padding as the header is fixed*/}
      {/* <div className="h-12"></div> */}
      <header className="z-100 bg-background fixed top-0 w-screen h-12 border-b-2 px-4 flex items-center justify-between ">
        {/* Logo */}
        <NavbarLogo />

        {/* Middle buttons */}
        <div className="flex gap-4">
          {/* Only show Folders button on mobile, since desktop sidebar is always visible */}
          {isMobile && (
            <Button
              variant="outline"
              size="sm"
              className="h-8 rounded-lg flex gap-2"
              onClick={toggleFoldersSidebar}
            >
              <Folder />
              <span className="hidden sm:block">Folders</span>
            </Button>
          )}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 rounded-lg flex gap-2"
                onClick={isMobile ? toggleAiSidebarMobile : toggleAiSidebar}
              >
                <Bot />
                <span className="hidden sm:block">AI Chat</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Toggle AI Chat</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* User avatar and signout */}
        {isLoaded && user && (
          <>
            <div className="hidden sm:flex  items-center gap-4">
              <div className=" p-0.5 rounded-full border-2 border-primary">
                <Avatar className="size-6">
                  <AvatarImage src={user?.imageUrl} />
                  <AvatarFallback>
                    {user?.firstName?.charAt(0)}
                    {user?.lastName?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </div>
              <SignOutButton>
                <Button variant="outline">Sign Out</Button>
              </SignOutButton>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger className="block sm:hidden">
                <div className=" p-0.5 rounded-full border-2 border-primary">
                  <Avatar className="size-6">
                    <AvatarImage src={user?.imageUrl} />
                    <AvatarFallback>
                      {user?.firstName?.charAt(0)}
                      {user?.lastName?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <SignOutButton>
                    <Button variant="outline">Sign Out</Button>
                  </SignOutButton>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )}
      </header>
    </>
  );
};

export default NotesNavbar;
