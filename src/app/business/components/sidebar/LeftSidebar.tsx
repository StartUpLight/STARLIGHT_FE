"use client";
import React, { useState } from "react";

const sections = [
  {
    title: "0. 개요",
    items: ["개요"],
  },
  {
    title: "1. 문제 인식",
    items: [
      "창업 배경 및 필요성",
      "창업 아이템의 목적 및 필요성",
      "창업 아이템의 목표시장 분석",
    ],
  },
  {
    title: "2. 실현 가능성",
    items: ["사업화 전략", "시장분석 및 경쟁력 확보 방안"],
  },
  {
    title: "3. 성장 전략",
    items: ["비즈니스 모델", "자금조달 계획", "시장진입 및 성과창출 전략"],
  },
  {
    title: "4. 팀 역량",
    items: ["창업자의 역량", "팀 구성원 소개 및 역량"],
  },
];

const LeftSidebar = () => {
  const [selected, setSelected] = useState("개요");

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
            1 / 11
          </span>
        </div>

        <div className="flex flex-col px-5 py-4 space-y-[10px]">
          {sections.map((sec, id) => (
            <div key={id} className="flex flex-col space-y-[10px]">
              <p className="text-gray-500 ds-caption font-medium">
                {sec.title}
              </p>

              {sec.items.map((item) => {
                const isActive = selected === item;
                return (
                  <div
                    key={item}
                    onClick={() => setSelected(item)}
                    className={`ds-subtext font-medium px-2 py-[3.5px] rounded-[4px] cursor-pointer transition
                      ${
                        isActive
                          ? "text-primary-500 bg-primary-50 font-semibold"
                          : "text-gray-600 hover:bg-gray-100 font-medium"
                      }`}
                  >
                    {item}
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
