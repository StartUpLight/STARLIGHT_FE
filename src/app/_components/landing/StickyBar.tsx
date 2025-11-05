'use client';

interface StickyBarProps {
  show: boolean;
  onPrimary?: () => void;
  onSecondary?: () => void;
}

const StickyBar = ({ show, onPrimary, onSecondary }: StickyBarProps) => {
  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-50 transition-all duration-300 ${show ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-full opacity-0'}`}
    >
      <div className="mx-auto max-w-[1176px] pb-6">
        <div className="flex items-center rounded-[12px] bg-black/80 px-8 py-5">
          <div className="ds-title block font-medium text-white">
            사업계획서 작성하러 가기
          </div>
          <div className="ml-auto flex gap-3">
            <button
              onClick={onPrimary}
              className="bg-primary-500 ds-text h-[50px] w-[220px] rounded-full px-8 font-medium text-white"
            >
              사업계획서 작성하기
            </button>
            <button
              onClick={onSecondary}
              className="ds-text h-[50px] rounded-full bg-white px-8 font-semibold text-gray-900"
            >
              PDF 업로드하고 채점받기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StickyBar;
