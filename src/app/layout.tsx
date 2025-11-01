import localFont from 'next/font/local';
import './globals.css';
import Header from './_components/common/Header';
import Providers from './providers';

const pretendard = localFont({
  src: '../fonts/PretendardVariable.ttf',
  weight: '100 900',
  variable: '--font-pretendard',
  display: 'swap',
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" className={pretendard.variable}>
      <body className="antialiased">
        <Providers>
          <Header />
          <main className="pt-[60px]">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
