"use client";
import React from "react";
import { useBusinessStore } from "@/store/business.store";
import sections from "@/data/sidebar.json";

const LeftSidebar = () => {
  const { selectedItem, setSelectedItem } = useBusinessStore();
  const allItems = sections.flatMap((section) => section.items);
  const totalItems = allItems.length;
  const currentIndex = allItems.findIndex((item) => item.number === selectedItem.number);
  const currentNumber = currentIndex !== -1 ? currentIndex + 1 : 1;

  return (
    <div className="flex flex-col items-start gap-4 w-full">
      <input
        type="text"
        placeholder="제목을 입력하세요."
        className="w-full py-[10px] px-5 rounded-[12px] ds-subtitle bg-white placeholder:text-gray-400 placeholder:font-medium"
      />

      <div className="flex flex-col w-full rounded-[12px] bg-white">
        <div className="flex justify-between items-center px-5 py-4 border-b border-gray-200">
          <span className="text-gray-900 font-semibold ds-subtitle">문항</span>
          <span className="px-2 py-[2px] rounded-full bg-gray-100 text-gray-700 ds-caption font-medium">
            {currentNumber} / {totalItems}
          </span>
        </div>

        <div className="flex flex-col px-5 py-4 space-y-[10px]">
          {sections.map((sec, id) => (
            <div key={id} className="flex flex-col space-y-[10px]">
              <p className="text-gray-500 ds-caption font-medium">
                {sec.title}
              </p>

              {sec.items.map((item) => {
                const isActive = selectedItem.number === item.number;
                return (
                  <div
                    key={item.number}
                    onClick={() => setSelectedItem(item)}
                    className={`ds-subtext font-medium px-2 py-[3.5px] rounded-[4px] cursor-pointer transition
                      ${isActive
                        ? "text-primary-500 bg-primary-50 font-semibold"
                        : "text-gray-600 hover:bg-gray-100 font-medium"
                      }`}
                  >
                    {item.name}
                  </div>
                );
              })}

              {id < sections.length - 1 && (
                <div className="w-full h-[1px] bg-gray-100" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LeftSidebar;
