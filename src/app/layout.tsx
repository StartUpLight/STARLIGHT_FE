import localFont from 'next/font/local';
import './globals.css';
import Header from './_components/common/Header';
import Providers from './providers';
import Script from 'next/script';
import MainHeader from './_components/common/MainHeader';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'STARLIGHT',
  description:
    'AI의 분석력과 현업 전문가의 검토를 결합해, 예비·초기 창업자가 실제 심사 기준에 맞는 사업계획서를 완성하도록 돕는 플랫폼',
  metadataBase: new URL('https://www.starlight-official.co.kr/'),

  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    title: 'STARLIGHT(스타라이트)',
    description:
      '작성하기 어려운 사업계획서를 쉽고 완성도있게 만들어주는 플랫폼',
    url: 'https://www.starlight-official.co.kr/',
    siteName: 'STARLIGHT',
    images: [
      'https://kr.object.ncloudstorage.com/starlight-s3/expert/%EC%9B%B9%EC%8D%B8%EB%84%A4%EC%9D%BC.png',
    ],
  },
};

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
      <body className="flex h-screen flex-col antialiased">
        <Providers>
          <Header />
          <MainHeader>{children}</MainHeader>
        </Providers>
      </body>

      <Script id="maze-inline" strategy="afterInteractive">
        {`(function (m, a, z, e) {
        var s, t, u, v;
        try {
        t = m.sessionStorage.getItem('maze-us');
        } catch (err) {}
         
        if (!t) {
        t = new Date().getTime();
        try {
        m.sessionStorage.setItem('maze-us', t);
        } catch (err) {}
         }
        
        u = document.currentScript || (function () {
        var w = document.getElementsByTagName('script');
        return w[w.length - 1];
        })();
        v = u && u.nonce;

        s = a.createElement('script');
        s.src = z + '?apiKey=' + e;
        s.async = true;
        if (v) s.setAttribute('nonce', v);
        a.getElementsByTagName('head')[0].appendChild(s);
        m.mazeUniversalSnippetApiKey = e;
        })(window, document, 'https://snippet.maze.co/maze-universal-loader.js', '5f372884-917e-4206-acdc-870d0fe09aea');`}
      </Script>
    </html>
  );
}
