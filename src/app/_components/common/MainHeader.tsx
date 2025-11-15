'use client';
import { usePathname } from 'next/navigation';
import { PropsWithChildren } from 'react';

const MainHeader = ({ children }: PropsWithChildren) => {
  const pathname = usePathname();
  const isHome = pathname === '/';

  return (
    <main
      className={
        isHome
          ? 'no-scrollbar flex-1 overflow-y-auto'
          : 'flex-1 overflow-y-auto bg-white'
      }
    >
      {children}
    </main>
  );
};

export default MainHeader;
