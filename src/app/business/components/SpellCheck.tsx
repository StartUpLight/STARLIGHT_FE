"use client";
import React, { useState } from "react";
import Button from "@/app/_components/common/Button";
import Arrow from "@/assets/icons/arrow_up.svg";

const SpellCheck = () => {
  const [isOpen, setIsOpen] = useState(true);

  const [results, setResults] = useState([
    {
      id: 1,
      original: "안농하세요",
      corrected: "안녕하세요",
      open: false,
      custom: "",
    },
    {
      id: 2,
      original: "안농하세요",
      corrected: "안녕하세요",
      open: false,
      custom: "",
    },
    {
      id: 3,
      original: "안농하세요",
      corrected: "안녕하세요",
      open: false,
      custom: "",
    },
    {
      id: 4,
      original: "안농하세요",
      corrected: "안녕하세요",
      open: false,
      custom: "",
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
    <div className="flex flex-col w-full rounded-[12px] bg-white">
      <div
        className="flex justify-between items-center w-full px-6 py-4 border-b border-gray-200 cursor-pointer"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span className="text-gray-800 font-semibold ds-subtitle">
          맞춤법 검사
        </span>
        <Arrow className={`w-[13px] h-[8px] transition-transform duration-200 ${isOpen ? "rotate-180" : "rotate-0"}`}/>

      </div>

      {isOpen && (
        <>
          <div className="flex-1 px-6 pt-4 space-y-4 max-h-[176px] overflow-y-auto">
            {results.map((item) => (
              <div key={item.id} className="w-full">
                <div
                  className="flex justify-between items-center w-full cursor-pointer"
                  onClick={() => toggleItem(item.id)}
                >
                  <div className="flex items-center gap-[10px]">
                    <span className="text-gray-800 ds-text font-medium">
                      {item.original} →
                    </span>

                    <span className="text-primary-500 bg-primary-50 px-[10px] py-[2px] rounded-[4px] ds-text font-medium">
                      {item.corrected}
                    </span>
                  </div>

                  <Arrow className={`w-[13px] h-[8px] ${item.open ? "rotate-180" : "rotate-90"}`}/>

            
                </div>

                {item.open && (
                  <div className="mt-[10px] px-4 py-[10px] bg-gray-100 rounded-[4px] space-y-1">
                    <p className="text-gray-900 ds-subtext font-medium">
                      직접 수정
                    </p>
                    <div className="flex items-center gap-[6px] w-full">
                      <input
                        type="text"
                        value={item.custom}
                        onChange={(e) => handleChange(item.id, e.target.value)}
                        placeholder={item.corrected}
                        className="flex-1 px-[10px] py-[3.5px] border border-gray-200 rounded-[4px] text-gray-900 ds-subtext focus:outline-none bg-white"
                      />
                      <button
                        onClick={() => handleApply(item.id)}
                        className="bg-primary-500 text-white cursor-pointer px-[10px] py-[2px] rounded-[4px] ds-subtext font-medium hover:bg-primary-700 transition"
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
            <Button text="모두 수정하기" className="rounded-[8px] w-full" />
          </div>
        </>
      )}
    </div>
  );
};

export default SpellCheck;
