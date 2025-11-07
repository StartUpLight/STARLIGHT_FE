'use client';
import { usePathname } from 'next/navigation';
import { PropsWithChildren } from 'react';

const MainHeader = ({ children }: PropsWithChildren) => {
  const pathname = usePathname();
  const isHome = pathname === '/';

  return <main className={isHome ? '' : 'pt-[60px]'}>{children}</main>;
};

export default MainHeader;
