import React from "react";
import LeftSidebar from "./components/sidebar/LeftSidebar";
import RightSidebar from "./components/sidebar/RightSidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-gray-100 min-h-screen relative overflow-hidden">
      <aside className="fixed top-[90px] left-8 w-[240px] h-[calc(100vh-90px)] overflow-y-auto scrollbar-hide ">
        <LeftSidebar />
      </aside>

      <aside className="fixed top-[90px] right-8 w-[326px] h-[calc(100vh-90px)] overflow-y-auto scrollbar-hide ">
        <RightSidebar />
      </aside>

      <main
        className="
          mx-auto py-[30px]
          ml-[calc(240px+2rem)]   
          mr-[calc(326px+2rem)]  
        "
      >
        {children}
      </main>
    </div>
  );
}
