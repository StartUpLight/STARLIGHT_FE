import Image from 'next/image';
import ExpertCard from './components/ExpertCard';

const page = () => {
  return (
    <div className="flex flex-col">
      <section className="relative h-[350px] w-full overflow-hidden">
        <Image
          src="/images/expert_banner.png"
          alt="전문가페이지 배너"
          priority
          fill
          className="object-cover"
        />

        <div className="relative z-10 flex h-full items-center">
          <div className="w-full pl-32">
            <p className="text-[36px] font-bold text-white">
              믿을 수 있는 실력있는 전문가와 함께
            </p>
            <p className="text-[36px] font-bold text-white">
              당신의 리포트 후랄랄리옹 해보세요
            </p>

            <p className="ds-subtext mt-3 font-medium text-white">
              어쩌구저쩌구에서 검증했습니다
            </p>
          </div>
        </div>
      </section>

      <div className="px-[132px]">
        <ExpertCard />
      </div>
    </div>
  );
};
export default page;
