import localFont from "next/font/local";
import "./globals.css";
import Header from "./_components/common/Header";

const pretendard = localFont({
  src: "../fonts/PretendardVariable.ttf",
  weight: "100 900",
  variable: "--font-pretendard",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" className={pretendard.variable}>
      <body className="antialiased pt-[60px]">
        <Header />
        {children}
      </body>
    </html>
  );
}