'use client';
import React from 'react';
import { useBusinessStore } from '@/store/business.store';
import LeftSidebar from './components/sidebar/LeftSidebar';
import RightSidebar from './components/sidebar/RightSidebar';
import BusinessHeader from '../_components/common/BusinessHeader';

export default function Layout({ children }: { children: React.ReactNode }) {
  const isPreview = useBusinessStore((state) => state.isPreview);

  return (
    <>
      <BusinessHeader />
      <div className="flex h-screen overflow-hidden bg-gray-100">
        {!isPreview && (
          <>
            <aside className="fixed top-[90px] left-8 h-[calc(100vh-90px)] w-[240px] overflow-y-auto">
              <LeftSidebar />
            </aside>

            <aside className="no-scrollbar fixed top-[90px] right-8 h-[calc(100vh-90px)] w-[326px] overflow-y-auto">
              <RightSidebar />
            </aside>
          </>
        )}

        <main
          className={`fixed top-[90px] right-0 bottom-0 left-0 ${isPreview ? 'mr-0 ml-0' : 'mr-[calc(326px+2rem)] ml-[calc(240px+2rem)]'}`}
        >
          {children}
        </main>
      </div>
    </>
  );
}
