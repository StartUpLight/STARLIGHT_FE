'use client';
import React, { useState } from 'react';
import Button from '@/app/_components/common/Button';
import Arrow from '@/assets/icons/arrow_up.svg';

const SpellCheck = () => {
  const [isOpen, setIsOpen] = useState(false);

  const [results, setResults] = useState([
    {
      id: 1,
      original: '안농하세요',
      corrected: '안녕하세요',
      open: false,
      custom: '',
    },
    {
      id: 2,
      original: '안농하세요',
      corrected: '안녕하세요',
      open: false,
      custom: '',
    },
    {
      id: 3,
      original: '안농하세요',
      corrected: '안녕하세요',
      open: false,
      custom: '',
    },
    {
      id: 4,
      original: '안농하세요',
      corrected: '안녕하세요',
      open: false,
      custom: '',
    },
  ]);

  const toggleItem = (id: number) => {
    setResults((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, open: !item.open } : item
      )
    );
  };

  const handleChange = (id: number, value: string) => {
    setResults((prev) =>
      prev.map((item) => (item.id === id ? { ...item, custom: value } : item))
    );
  };

  const handleApply = (id: number) => {
    setResults((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, corrected: item.custom || item.corrected, open: false }
          : item
      )
    );
  };

  return (
    <div
      className={`flex w-full flex-col rounded-[12px] bg-white ${isOpen ? 'h-[297px]' : ''}`}
    >
      <div
        className={`flex w-full items-center justify-between border-b border-gray-200 px-6 ${isOpen ? 'pt-4 pb-[10px]' : 'py-4'}`}
      >
        <span className="ds-subtitle font-semibold text-gray-900">
          맞춤법 검사
        </span>
        <button
          type="button"
          aria-label="맞춤법검사 토글"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <Arrow
            className={`cursor-pointer ${isOpen ? 'rotate-180' : 'rotate-0'}`}
          />
        </button>
      </div>

      {isOpen && (
        <>
          <div
            id="spellcheck-panel"
            className="flex-1 space-y-4 overflow-y-auto px-6 pt-4"
          >
            {results.map((item) => (
              <div key={item.id} className="w-full">
                <div
                  className="flex w-full cursor-pointer items-center justify-between"
                  onClick={() => toggleItem(item.id)}
                >
                  <div className="flex items-center gap-[10px]">
                    <span className="ds-text font-medium text-gray-900">
                      {item.original} →
                    </span>
                    <span className="text-primary-500 bg-primary-50 ds-text rounded-[4px] px-[10px] py-[2px] font-medium">
                      {item.corrected}
                    </span>
                  </div>
                  <Arrow
                    className={`${item.open ? 'rotate-180' : 'rotate-0'}`}
                  />
                </div>

                {item.open && (
                  <div className="mt-[10px] space-y-1 rounded-[4px] bg-gray-100 px-4 py-[10px]">
                    <p className="ds-subtext font-medium text-gray-900">
                      직접 수정
                    </p>
                    <div className="flex w-full items-center gap-[6px]">
                      <input
                        type="text"
                        value={item.custom}
                        onChange={(e) => handleChange(item.id, e.target.value)}
                        placeholder={item.corrected}
                        className="ds-subtext flex-1 rounded-[4px] border border-gray-200 bg-white px-[10px] py-[2px] font-medium text-gray-900 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleApply(item.id)}
                        className="bg-primary-500 ds-subtext hover:bg-primary-700 cursor-pointer rounded-[4px] px-[10px] py-[2px] font-medium text-white"
                      >
                        적용
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="px-6 py-4">
            <Button text="모두 수정하기" className="w-full rounded-[8px]" />
          </div>
        </>
      )}
    </div>
  );
};

export default SpellCheck;
