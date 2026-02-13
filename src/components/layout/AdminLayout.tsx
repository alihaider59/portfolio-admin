import React from "react";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";

export const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex bg-[#EAEFEF] min-h-screen">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar />

        <main className="p-6 flex-1">{children}</main>
      </div>
    </div>
  );
};