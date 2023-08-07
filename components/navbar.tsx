import React from "react";

import { UserButton } from "@clerk/nextjs";

import MobileSideBar from "@/components/mobile-sidebar";

export default function NavBar() {
  return (
    <div className="flex items-center">
      <MobileSideBar />
      <div className="w-full flex justify-end  p-2">
        <UserButton afterSignOutUrl="/" />
      </div>
    </div>
  );
}
