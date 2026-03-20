import Image from 'next/image';
import ExpertCard from './components/ExpertCard';

const page = () => {
  return (
    <div className="flex flex-col">
      <section className="relative h-[224px] md:h-[350px] w-full overflow-hidden">
        <Image
          src="/images/expert_banner.png"
          alt="전문가페이지 배너"
          priority
          fill
          className="object-cover"
        />

        <div className="relative z-10 flex h-full items-center">
          <div className="w-full flex flex-col items-center justify-center md:items-start md:justify-start md:pl-14 lg:pl-32">
            <p className="md:text-[36px] text-[22px] font-bold text-white">
              신뢰할 수 있는 전문가의 리뷰로
            </p>
            <p className="md:text-[36px] text-[22px] font-bold text-white">
              리포트의 완성도를 한 단계 높이세요
            </p>

            <p className="ds-subtext mt-3 font-medium text-white">
              스타라이트가 직접 검증한 전문가를 연결해드립니다
            </p>
          </div>
        </div>
      </section>

      <div className="px-4 md:px-8 lg:px-[132px] w-full">
        <ExpertCard />
      </div>
    </div>
  );
};
export default page;
