'use client';
import { usePathname } from 'next/navigation';
import { PropsWithChildren } from 'react';

const MainHeader = ({ children }: PropsWithChildren) => {
  const pathname = usePathname();
  const isHome = pathname === '/';

  return (
    <main className={isHome ? '' : 'min-h-screen bg-white pt-[60px]'}>
      {children}
    </main>
  );
};

export default MainHeader;
