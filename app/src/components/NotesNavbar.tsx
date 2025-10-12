import React from "react";
import { NavbarLogo } from "./ui/resizable-navbar";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { SignOutButton } from "@clerk/nextjs";
import { Button } from "./ui/button";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { syncClerkUserToDB } from "@/actions/user.actions";

const NotesNavbar = async () => {
  const user = await currentUser();

  if(!user) redirect("/");
   
  await syncClerkUserToDB();

  return (
    <header className="z-100 bg-background absolute top-0 w-screen h-12 border-b-2 px-4 flex items-center justify-between ">
      <NavbarLogo />
      {user && (
        <div className="flex items-center gap-4">
          <div className="p-0.5 rounded-full border-2 border-primary">
            <Avatar className="size-6">
              <AvatarImage src={user?.imageUrl} />
              <AvatarFallback>
                {user?.firstName?.charAt(0)}
                {user?.lastName?.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </div>
          <SignOutButton>
            <Button variant="outline" >
              Sign Out
            </Button>
          </SignOutButton>
        </div>
      )}
    </header>
  );
};

export default NotesNavbar;
