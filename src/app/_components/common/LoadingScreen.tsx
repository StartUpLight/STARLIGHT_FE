'use client';

import LoadingCheck from '@/assets/icons/blue_check.svg';

interface LoadingScreenProps {
  title: string;
  subtitles: string[];
  buttonTextLeft?: string;
  buttonTextRight?: string;
  onClickLeft?: () => void;
  onClickRight?: () => void;
}

const LoadingScreen = ({
  title,
  subtitles,
  buttonTextLeft,
  buttonTextRight,
  onClickLeft,
  onClickRight,
}: LoadingScreenProps) => {
  return (
    <div className="flex h-full justify-center bg-white">
      <div className="mt-[210px] flex flex-col items-center">
        <LoadingCheck />
        <div className="ds-heading mt-[22px] font-bold text-gray-900">
          {title}
        </div>
        <div className="mt-2 text-center">
          {subtitles.map((text, idx) => (
            <p key={idx} className="ds-subtitle font-medium text-gray-600">
              {text}
            </p>
          ))}
        </div>

        <div className="mt-11 flex w-full flex-row items-center justify-center gap-4">
          {buttonTextLeft && (
            <button
              className="border-primary-500 ds-text text-primary-500 hover:bg-primary-50 active:bg-primary-50 w-[200px] flex-1 cursor-pointer items-center justify-center rounded-lg border-[1.2px] bg-white px-8 py-2.5 font-medium"
              onClick={onClickLeft}
            >
              {buttonTextLeft}
            </button>
          )}
          {buttonTextRight && (
            <button
              className="bg-primary-500 ds-text hover:bg-primary-600 active:bg-primary-700 w-[200px] flex-1 cursor-pointer items-center justify-center rounded-lg px-8 py-2.5 font-medium text-white"
              onClick={onClickRight}
            >
              {buttonTextRight}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
