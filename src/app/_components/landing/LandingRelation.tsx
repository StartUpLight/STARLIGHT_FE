import Image from 'next/image';
import React from 'react';

const LandingRelation = () => {
  type Logo = { src: string; alt: string; href: string };

  const logos: Logo[] = [
    {
      src: '/images/landing/company/company1.svg',
      alt: '중소벤처기업부',
      href: 'https://www.mss.go.kr',
    },
    {
      src: '/images/landing/company/company2.svg',
      alt: '창업진흥원',
      href: 'https://www.kised.or.kr',
    },
    {
      src: '/images/landing/company/company3.svg',
      alt: '한국산업기술진흥원',
      href: 'https://www.kiat.or.kr',
    },
    {
      src: '/images/landing/company/company4.png',
      alt: 'K-STARTUP',
      href: 'https://www.k-startup.go.kr',
    },
    {
      src: '/images/landing/company/company5.png',
      alt: '한국청년기업가정신재단',
      href: 'http://www.koef.or.kr',
    },
    {
      src: '/images/landing/company/company6.svg',
      alt: '과학기술정보통신부',
      href: 'https://www.msit.go.kr',
    },
  ];

  return (
    <div>
      <div className="mt-[119px] flex w-full flex-col bg-white px-[132px] pb-[235px]">
        <div className="text-[42px] leading-[150%] font-bold tracking-[-0.84px] text-gray-900">
          관련 기관
        </div>

        <ul className="mt-[60px] grid w-full grid-cols-1 items-center justify-center gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {logos.map((logo) => (
            <li key={logo.alt} className="mx-auto w-full max-w-[376px]">
              <a
                href={logo.href}
                target="_blank"
                rel="noopener noreferrer"
                title={logo.alt}
                aria-label={`${logo.alt} 공식 사이트로 이동 (새 창)`}
                className="block"
              >
                <div className="bg-gray-80 flex h-52 w-full items-center justify-center rounded-xl px-14">
                  <Image
                    src={logo.src}
                    alt={logo.alt}
                    width={260}
                    height={60}
                    className="h-auto max-h-[60px] w-auto object-contain"
                    priority
                  />
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>

      <Image
        src="/images/landing/landing_final.png"
        alt="랜딩 관련기관"
        width={1440}
        height={420}
        className="w-full"
        priority
      />
    </div>
  );
};

export default LandingRelation;
