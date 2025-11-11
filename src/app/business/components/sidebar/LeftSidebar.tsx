'use client';
import React, { useMemo } from 'react';
import { useBusinessStore } from '@/store/business.store';
import sections from '@/data/sidebar.json';
import Check from '@/assets/icons/puple_check.svg';
import { isSectionCompleted } from '@/util/checkcontent';

const LeftSidebar = () => {
  const { selectedItem, setSelectedItem, getItemContent } = useBusinessStore();

  const allItems = useMemo(() => sections.flatMap((s) => s.items), []);
  const currentNumber =
    allItems.findIndex((item) => item.number === selectedItem.number) + 1;

  return (
    <div className="flex w-full flex-col items-start gap-4">
      <div className="flex w-full flex-col rounded-[12px] bg-white">
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <span className="ds-subtitle font-semibold text-gray-900">문항</span>
          <span className="ds-caption rounded-full bg-gray-100 px-2 py-[2px] font-medium text-gray-700">
            {currentNumber} / {allItems.length}
          </span>
        </div>

        <div className="flex flex-col space-y-[10px] px-5 py-4">
          {sections.map((sec, id) => (
            <div key={id} className="flex flex-col space-y-[10px]">
              <p className="ds-caption font-medium text-gray-500">
                {sec.title}
              </p>

              {sec.items.map((item) => {
                const isActive = selectedItem.number === item.number;
                const completed = getItemContent
                  ? isSectionCompleted(getItemContent, item.number)
                  : false;

                return (
                  <div
                    key={item.number}
                    onClick={() => setSelectedItem(item)}
                    className={`ds-subtext flex cursor-pointer items-center justify-between rounded-[4px] px-2 py-[3.5px] transition ${
                      isActive
                        ? 'text-primary-500 bg-primary-50 font-semibold'
                        : 'font-medium text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <span className={completed ? 'text-gray-900' : ''}>
                      {item.name}
                    </span>
                    {completed && <Check />}
                  </div>
                );
              })}

              {id < sections.length - 1 && (
                <div className="h-[1px] w-full bg-gray-100" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LeftSidebar;
