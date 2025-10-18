import React from "react";
import LeftSidebar from "./components/sidebar/LeftSidebar";
import RightSidebar from "./components/sidebar/RightSidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-gray-100 min-h-screen">
      <aside className="fixed top-[30px] left-8 w-[240px] h-screen">
        <LeftSidebar />
      </aside>

      <aside className="fixed top-[30px] right-8 w-[326px]">
        <RightSidebar />
      </aside>

      <main className="mx-auto py-[30px] max-w-4xl">{children}</main>
    </div>
  );
}
