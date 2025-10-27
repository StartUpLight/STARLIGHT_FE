"use client";
import React from "react";
import { useBusinessStore } from "@/store/business.store";

const sections = [
  {
    title: "0. 개요",
    items: [
      {
        name: "개요",
        number: "0",
        title: "개요",
        subtitle: "구성원의 담당업무, 사업화와 관련하여 보유한 전문성(기술력, 노하우) 위주로 작성.",
      },
    ],
  },
  {
    title: "1. 문제 인식",
    items: [
      {
        name: "창업 배경 및 필요성",
        number: "1-1",
        title: "창업 배경 및 필요성",
        subtitle: "창업을 시작하게 된 배경과 왜 이 아이템이 필요한지에 대해 작성해주세요.",
      },
      {
        name: "창업 아이템의 목적 및 필요성",
        number: "1-2",
        title: "창업 아이템의 목적 및 필요성",
        subtitle: "해결하려는 문제와 이 아이템이 필요한 이유를 명확히 설명해주세요.",
      },
      {
        name: "창업 아이템의 목표시장 분석",
        number: "1-3",
        title: "창업 아이템의 목표시장 분석",
        subtitle: "타겟 고객과 시장 규모에 대해 분석하여 작성해주세요.",
      },
    ],
  },
  {
    title: "2. 실현 가능성",
    items: [
      {
        name: "사업화 전략",
        number: "2-1",
        title: "사업화 전략",
        subtitle: "아이템을 사업화하기 위한 구체적인 전략과 계획을 작성해주세요.",
      },
      {
        name: "시장분석 및 경쟁력 확보 방안",
        number: "2-2",
        title: "시장분석 및 경쟁력 확보 방안",
        subtitle: "경쟁사의 현황과 본 아이템의 경쟁 우위를 확보할 수 있는 방안을 작성해주세요.",
      },
    ],
  },
  {
    title: "3. 성장 전략",
    items: [
      {
        name: "비즈니스 모델",
        number: "3-1",
        title: "비즈니스 모델",
        subtitle: "수익 모델과 비즈니스 운영 방식을 설명해주세요.",
      },
      {
        name: "자금조달 계획",
        number: "3-2",
        title: "자금조달 계획",
        subtitle: "필요한 자금 규모와 조달 방안에 대해 작성해주세요.",
      },
      {
        name: "시장진입 및 성과창출 전략",
        number: "3-3",
        title: "시장진입 및 성과창출 전략",
        subtitle: "시장 진입 전략과 예상 성과에 대해 구체적으로 작성해주세요.",
      },
    ],
  },
  {
    title: "4. 팀 역량",
    items: [
      {
        name: "창업자의 역량",
        number: "4-1",
        title: "창업자의 역량",
        subtitle: "창업자가 보유한 전문성, 경험, 리더십에 대해 작성해주세요.",
      },
      {
        name: "팀 구성원 소개 및 역량",
        number: "4-2",
        title: "팀 구성원 소개 및 역량",
        subtitle: "팀 구성원의 역할과 전문성을 상세히 작성해주세요.",
      },
    ],
  },
];

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
