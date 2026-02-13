import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";

export const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex bg-[#EAEFEF] min-h-screen">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0 w-full">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="p-3 sm:p-6 flex-1 overflow-x-hidden w-full min-w-0 max-w-full">{children}</main>
      </div>
    </div>
  );
};