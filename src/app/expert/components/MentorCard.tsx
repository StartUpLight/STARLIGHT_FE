'use client';
import Button from '@/app/_components/common/Button';
import { MentorCardProps } from '@/types/expert/expert.props';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import WhitePlus from '@/assets/icons/white_plus.svg';

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
      className="bg-gray-80 flex w-full cursor-pointer flex-row items-start justify-between gap-6 rounded-xl px-9 py-[42px] transition-opacity hover:opacity-80 max-h-[200px]"
    >
      <div className="flex flex-row gap-6">
        <Image
          src={image || '/images/sampleImage.png'}
          alt={name}
          width={80}
          height={80}
          className="h-20 w-20 rounded-full object-cover"
        />
        <div className="flex flex-col items-start">
          <div className="flex flex-row items-center gap-2">
            <div className="ds-subtitle font-semibold text-gray-900">
              {name}
              <span className="ds-subtitle ml-1 font-semibold text-gray-700">
                전문가
              </span>
            </div>
            <div className="h-3 w-px bg-gray-300" />
            <div className="ds-subtext font-medium text-gray-700">
              {oneLineIntroduction}
            </div>
          </div>
          <div className="ds-subtext mt-3 font-medium text-gray-600 max-w-[780px] line-clamp-1 text-ellipsis">
            {careers.map((career) => career.careerTitle).join(' / ')}
          </div>
          <div className="flex w-full flex-wrap gap-1.5 mt-4">
            {tags.map((tag, i) => (
              <div
                key={`${name}-tag-${tag}-${i}`}
                className="bg-primary-50 items-center rounded-sm px-2 py-0.5"
              >
                <div className="ds-caption text-primary-500 font-medium">
                  {tag}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Button
          text="전문가 연결"
          icon={<WhitePlus />}
          iconPosition="left"
          size="M"
          className="rounded-lg gap-1 px-3 py-2 w-[156px] h-[39px]"
         onClick={handleCardClick}
        />
    </div>

  );
};

export default MentorCard;
