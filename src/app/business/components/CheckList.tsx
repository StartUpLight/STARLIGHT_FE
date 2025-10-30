'use client';
import Button from '@/app/_components/common/Button';
import React, { useState } from 'react';
import Check from '@/assets/icons/white_check.svg';

const CheckList = () => {
  const [checklist, setChecklist] = useState([
    {
      id: 1,
      title: '시장 분석 객관성:',
      content: '시장 규모·수요의 데이터 기반 분석',
      checked: true,
    },
    {
      id: 2,
      title: '경쟁사 분석 명확성:',
      content: '유사 서비스 특징 및 한계점 도출',
      checked: true,
    },
    {
      id: 3,
      title: '핵심 문제 부각성:',
      content: '핵심 문제의 명확한 강조 (굵기, 수치 등)',
      checked: true,
    },
    {
      id: 4,
      title: '핵심 목적 명확성:',
      content: '문제/해결방식이 구체적으로 연결되어 제시',
      checked: false,
    },
    {
      id: 5,
      title: '경쟁사 분석 명확성:',
      content: '유사 서비스 특징 및 한계점 도출',
      checked: false,
    },
  ]);

  const toggleCheck = (id: number) => {
    setChecklist((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  return (
    <div className="flex h-[439px] w-full flex-col rounded-[12px] bg-white">
      <div className="flex w-full items-center border-b border-gray-200 px-6 pt-4 pb-[10px]">
        <span className="ds-subtitle font-semibold text-gray-900">
          체크리스트
        </span>
      </div>

      <div className="flex w-full flex-col space-y-[10px] px-6 py-5">
        {checklist.map((item, i) => (
          <div key={item.id}>
            <div
              className="flex cursor-pointer items-center gap-[10px]"
              onClick={() => toggleCheck(item.id)}
            >
              {item.checked ? (
                <div className="bg-primary-500 flex h-[18px] w-[18px] items-center justify-center rounded-full">
                  <Check />
                </div>
              ) : (
                <div className="h-[18px] w-[18px] rounded-full border-2 border-gray-400" />
              )}

              <div className="flex flex-col">
                <div className="ds-subtext font-semibold text-gray-900">
                  {item.title}
                </div>

                <div className="ds-subtext font-medium text-gray-600">
                  {item.content}
                </div>
              </div>
            </div>

            {i < checklist.length - 1 && (
              <div className="mt-[10px] h-[1px] w-full bg-gray-100" />
            )}
          </div>
        ))}

        <Button text="점검하기" className="mt-[10px] rounded-[8px]" />
      </div>
    </div>
  );
};

export default CheckList;
