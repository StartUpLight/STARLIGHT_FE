'use client';
import { MentorCardProps } from '@/types/expert/expert.props';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

type ExtraProps = {
  onApplied?: () => void;
};

const MentorCard = ({
  name,
  careers,
  tags,
  image,
  workingperiod,
  id,
}: MentorCardProps & ExtraProps) => {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/expert/detail?id=${id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-gray-80 flex w-full cursor-pointer flex-row items-start justify-between gap-6 rounded-xl p-9 transition-opacity hover:opacity-80"
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
              {workingperiod}년 경력
            </div>
          </div>
          <div className="ds-subtext my-3 font-medium text-gray-600">
            {careers.map((career) => career.careerTitle).join(' / ')}
          </div>
          <div className="flex w-full flex-wrap gap-1.5">
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
    </div>
  );
};

export default MentorCard;
