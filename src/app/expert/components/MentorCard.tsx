'use client';
import Button from '@/app/_components/common/Button';
import { MentorCardProps } from '@/types/expert/expert.props';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import MentorCardTags from './MentorCardTags';

type ExtraProps = {
  onApplied?: () => void;
};

const MentorCard = ({
  name,
  careers,
  tags,
  image,
  oneLineIntroduction,
  id,
}: MentorCardProps & ExtraProps) => {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/expert/detail?id=${id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-gray-80 flex w-full cursor-pointer flex-col md:flex-row items-start justify-between px-4 py-5 md:gap-6 rounded-xl md:px-9 md:py-[42px] transition-opacity hover:opacity-80 md:max-h-[200px]"
    >
      <div className="flex flex-row md:gap-6 gap-3">
        <Image
          src={image || '/images/sampleImage.png'}
          alt={name}
          width={80}
          height={80}
          className="md:h-20 md:w-20 h-10 w-10 rounded-full object-cover"
        />
        <div className="flex flex-col items-start">
          <div className="flex md:flex-row flex-col items-start md:items-center md:gap-2">
            <div className="md:ds-subtitle ds-text font-semibold text-gray-900">
              {name}
              <span className="md:ds-subtitle ds-text ml-1 font-semibold text-gray-700">
                전문가
              </span>
            </div>
            <div className="h-3 w-px bg-gray-300 hidden md:block" />
            <div className="ds-subtext font-medium text-gray-700">
              {oneLineIntroduction}
            </div>
          </div>
          <div className="text-[14px] md:ds-subtext mt-3 font-medium text-gray-500 md:text-gray-600 max-w-[780px] line-clamp-1 text-ellipsis">
            <span className="md:hidden">
              {careers[0]?.careerTitle}
              {careers.length > 1 && ` +${careers.length - 1}개`}
            </span>
            <span className="hidden md:inline">
              {careers.map((career) => career.careerTitle).join(' / ')}
            </span>
          </div>
          <MentorCardTags tags={tags} name={name} />
        </div>
      </div>

      <Button
          text="전문가 상세보기"
          size="M"
          className="rounded-lg px-3 py-2 w-[156px] h-[39px] hidden lg:block"
         onClick={handleCardClick}
        />
    </div>

  );
};

export default MentorCard;
