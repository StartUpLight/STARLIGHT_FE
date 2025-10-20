import React from 'react';
import LeftSidebar from './components/sidebar/LeftSidebar';
import RightSidebar from './components/sidebar/RightSidebar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gray-100">
      <aside className="scrollbar-hide fixed top-[90px] left-8 h-[calc(100vh-90px)] w-[240px] overflow-y-auto">
        <LeftSidebar />
      </aside>

      <aside className="scrollbar-hide fixed top-[90px] right-8 h-[calc(100vh-90px)] w-[326px] overflow-y-auto">
        <RightSidebar />
      </aside>

      <main className="mx-auto mr-[calc(326px+2rem)] ml-[calc(240px+2rem)] py-[30px]">
        {children}
      </main>
    </div>
  );
}
