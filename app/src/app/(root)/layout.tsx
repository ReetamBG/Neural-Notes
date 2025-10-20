import RootNavbar from "@/components/RootNavbar";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen w-full relative">
      <RootNavbar />
      {children}
    </div>
  );
};

export default layout;
