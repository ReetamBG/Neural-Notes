import RootNavbar from "@/components/RootNavbar";
import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <RootNavbar />
      <div className="min-h-screen w-full relative">
        <BackgroundRippleEffect cellSize={70} />
        {children}
      </div>
    </>
  );
};

export default layout;
