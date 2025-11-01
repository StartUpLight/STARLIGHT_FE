import { MentorProps } from '@/types/expert/expert.props';
import Image from 'next/image';
import Check from '@/assets/icons/gray_check.svg';
import Plus from '@/assets/icons/white_plus.svg';

const MentorCard = ({
  name,
  careers,
  status,
  tags,
  image,
  workingperiod,
}: MentorProps) => {
  const isDone = status === 'done';
  return (
    <div className="bg-gray-80 flex w-full flex-row items-start justify-between gap-6 rounded-[12px] p-9">
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
                멘토
              </span>
            </div>

            <div className="h-3 w-px bg-gray-300" />

            <div className="ds-subtext font-medium text-gray-700">
              {workingperiod}년 경력 개발자
            </div>
          </div>

          <div className="ds-subtext my-3 font-medium text-gray-600">
            {careers.join(' / ')}
          </div>
          <div className="flex w-full flex-wrap gap-[6px]">
            {tags.map((tag, i) => (
              <div
                key={`${name}-tag-${tag}-${i}`}
                className="bg-primary-50 items-center rounded-[4px] px-2 py-[2px]"
              >
                <div className="ds-caption text-primary-500 font-medium">
                  {tag}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <button
        disabled={isDone}
        className={[
          'ds-text flex w-[156px] items-center justify-center gap-1 rounded-[8px] px-3 py-2 font-medium',
          isDone
            ? 'bg-gray-200 text-gray-500'
            : 'bg-primary-500 hover:bg-primary-700 cursor-pointer text-white',
        ].join(' ')}
      >
        {isDone ? <Check className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
        {isDone ? '신청 완료' : '비대면 평가'}
      </button>
    </div>
  );
};

export default MentorCard;
