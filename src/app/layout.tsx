import localFont from 'next/font/local';
import './globals.css';
import Header from './_components/common/Header';
import Providers from './providers';
import Script from 'next/script';

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
