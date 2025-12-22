import Image from 'next/image';
import { getExpertResponse } from '@/types/expert/expert.type';

interface ExpertDetailHeaderProps {
  expert: getExpertResponse;
}

const ExpertDetailHeader = ({ expert }: ExpertDetailHeaderProps) => {
  return (
    <>
      <section className="relative h-40 w-full">
        <Image
          src="/images/expert_detail.png"
          alt="전문가페이지 배너"
          priority
          fill
          sizes="100vw"
          className="object-cover"
        />
      </section>

      <div className="w-full px-[248px]">
        <div className="relative">
          <div className="absolute top-0 left-0 z-10 -translate-y-1/2">
            <div className="relative h-[100px] w-[100px] overflow-hidden rounded-full bg-gray-200">
              <Image
                src={expert.profileImageUrl || '/images/sampleImage.png'}
                alt={expert.name}
                fill
                sizes="100px"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ExpertDetailHeader;
