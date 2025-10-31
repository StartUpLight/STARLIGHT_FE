'use client';
import React, { useEffect, useMemo, useState } from 'react';
import Button from '@/app/_components/common/Button';
import Check from '@/assets/icons/white_check.svg';
import { useBusinessStore } from '@/store/business.store';
import sections from '@/data/sidebar.json';
import { ChecklistProps, Section } from '@/types/business/checklist.type';

const CheckList = () => {
  const selected = useBusinessStore((s) => s.selectedItem);

  const sectionTemplate = useMemo<ChecklistProps[]>(() => {
    const data = sections as Section[];
    for (const sec of data) {
      const found = sec.items.find((it) => it.number === selected.number);
      if (found?.checklist) return found.checklist;
    }
    return [];
  }, [selected.number]);

  const [checklist, setChecklist] = useState<ChecklistProps[]>([]);
  useEffect(() => {
    setChecklist(
      sectionTemplate.map((e) => ({
        title: e.title,
        content: e.content,
        checked: !!e.checked,
      }))
    );
  }, [sectionTemplate]);

  const toggleCheck = (id: number) => {
    setChecklist((prev) =>
      prev.map((it, i) => (i === id ? { ...it, checked: !it.checked } : it))
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
          <div key={`${item.title}-${i}`}>
            <div
              className="flex cursor-pointer items-center gap-[10px]"
              onClick={() => toggleCheck(i)}
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
                  {item.title}:
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
