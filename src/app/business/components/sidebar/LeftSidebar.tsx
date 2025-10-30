'use client';
import React from 'react';
import { useBusinessStore } from '@/store/business.store';
import sections from '@/data/sidebar.json';

const LeftSidebar = () => {
  const { selectedItem, setSelectedItem } = useBusinessStore();
  const allItems = sections.flatMap((section) => section.items);
  const totalItems = allItems.length;
  const currentIndex = allItems.findIndex(
    (item) => item.number === selectedItem.number
  );
  const currentNumber = currentIndex !== -1 ? currentIndex + 1 : 1;

  return (
    <div className="flex w-full flex-col items-start gap-4">
      <div className="flex w-full flex-col rounded-[12px] bg-white">
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <span className="ds-subtitle font-semibold text-gray-900">문항</span>
          <span className="ds-caption rounded-full bg-gray-100 px-2 py-[2px] font-medium text-gray-700">
            {currentNumber} / {totalItems}
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
                return (
                  <div
                    key={item.number}
                    onClick={() => setSelectedItem(item)}
                    className={`ds-subtext cursor-pointer rounded-[4px] px-2 py-[3.5px] font-medium transition ${
                      isActive
                        ? 'text-primary-500 bg-primary-50 font-semibold'
                        : 'font-medium text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {item.name}
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
