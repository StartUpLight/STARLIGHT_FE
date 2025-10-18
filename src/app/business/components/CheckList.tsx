"use client";
import Button from "@/app/_components/common/Button";
import React, { useState } from "react";
import Check from "@/assets/icons/white_check.svg";

const CheckList = () => {
  const [checklist, setChecklist] = useState([
    { id: 1, text: "문맥에 맞게 글이 잘 쓰여져룰루루", checked: true },
    { id: 2, text: "문맥에 맞게 글이 잘 쓰여져룰루루", checked: true },
    { id: 3, text: "문맥에 맞게 글이 잘 쓰여져룰루루", checked: true },
    { id: 4, text: "문맥에 맞게 글이 잘 쓰여져룰루루", checked: false },
    { id: 5, text: "문맥에 맞게 글이 잘 쓰여져룰루루", checked: false },
  ]);

  const toggleCheck = (id: number) => {
    setChecklist((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };
  return (
    <div className="flex flex-col w-full rounded-[12px] bg-white">
      <div className="flex items-center w-full px-6 pt-4 pb-[10px] border-b border-gray-200">
        <span className="text-gray-900 font-semibold ds-subtitle">
          체크리스트
        </span>
      </div>

      <div className="flex flex-col px-6 py-5 space-y-[10px] w-full">
        {checklist.map((item, i) => (
          <div key={item.id}>
            <div
              className="flex items-center gap-[10px] cursor-pointer"
              onClick={() => toggleCheck(item.id)}
            >
              {item.checked ? (
                <div className="flex items-center justify-center w-[18px] h-[18px] rounded-full bg-primary-500">
                  <Check />
                </div>
              ) : (
                <div className="w-[18px] h-[18px] rounded-full border-2 border-gray-400" />
              )}

              <div
                className={`ds-text font-medium ${
                  item.checked ? "text-gray-800" : "text-gray-600"
                }`}
              >
                {item.text}
              </div>
            </div>

            {i < checklist.length - 1 && (
              <div className="w-full h-[1px] bg-gray-100 mt-[10px]" />
            )}
          </div>
        ))}

        <Button text="점검하기" className="mt-[10px] rounded-[8px]" />
      </div>
    </div>
  );
};

export default CheckList;
