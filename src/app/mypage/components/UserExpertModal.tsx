import React, { useState } from 'react';
import Close from '@/assets/icons/close.svg';
import Strength from '@/assets/icons/strength_graph.svg';
import Weak from '@/assets/icons/weak_graph.svg';
import UserExpertHeader from './UserExpertHeader';

interface ExportModalProps {
  open?: boolean;
  onClose?: () => void;
  experts?: string[];
  fileName?: string;
}

const UserExpertModal = ({
  open = true,
  onClose,
  experts = ['홍길동', '호성정'],
  fileName = '파일명',
}: ExportModalProps) => {
  if (!open) return null;

  const [selectedExpert, setSelectedExpert] = useState(experts[0] ?? '');

  const historyItems = [
    `${selectedExpert}님의 이력`,
    '최근 활동',
    '포인트 내역',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="flex h-[422px] w-[800px] flex-col overflow-hidden rounded-[12px] bg-white">
        <div className="flex w-full items-center justify-between border-b border-gray-200 bg-white px-6 py-5">
          <div className="flex items-center">
            <UserExpertHeader
              experts={experts}
              value={selectedExpert}
              onChange={setSelectedExpert}
            />
            <div className="ds-title font-semibold text-gray-900">
              의 [{fileName}] 사업계획서 평가 리포트
            </div>
          </div>

          <button
            aria-label="닫기"
            onClick={onClose}
            className="h-6 w-6 cursor-pointer"
          >
            <Close />
          </button>
        </div>

        <div className="relative flex flex-1 flex-col gap-6 overflow-auto p-6">
          <div className="flex w-full flex-row gap-4">
            <div className="h-[115px] w-[103px] rounded-[12px] bg-gray-100" />

            <div className="flex w-full flex-col">
              <div className="flex w-full flex-row gap-[10px]">
                <div className="ds-text font-medium text-gray-800">
                  {selectedExpert} 전문가_ 피드백 보고서
                </div>

                <div className="ds-caption text-primary-500 mt-[3px] flex flex-row gap-1 font-medium">
                  <div>#BM</div>
                  <div>#문제정의</div>
                </div>
              </div>

              <div className="my-2 h-px w-full bg-gray-100" />

              <div className="flex flex-col gap-1">
                {historyItems.map((text, i) => (
                  <div key={i} className="ds-subtext font-medium text-gray-600">
                    {text}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex w-full flex-col gap-4 rounded-[12px] border border-[#DADFE7] px-6 py-4">
            <div className="ds-subtitle font-semibold text-gray-900">총평</div>
            <div className="ds-text bg-primary-50 text-primary-500 rounded-[12px] px-[10px] py-5 text-center font-semibold">
              “전체적으로 밸런스가 잘 잡힌 사업계획서이지만, 수익성 부분 보완이
              필요해보입니다.”
            </div>
          </div>

          <div className="flex flex-row gap-4">
            <div className="flex w-[368px] flex-col items-start gap-5 rounded-[12px] border border-gray-300 px-6 py-4">
              <div className="flex flex-row items-center gap-1">
                <Strength />
                <div className="ds-subtitle text-primary-500 font-semibold">
                  강점
                </div>
              </div>

              <div className="ds-subtext font-medium text-gray-800">
                2030세대의 자기 투영 욕구를 기반으로 한 통찰력이 매우 날카롭고
                설득력 있음. 2030세대의 자기 투영 욕구를 기반으로 한 통찰력이
                매우 날카롭고 설득력 있음.2030세대의 자기 투영 욕구를 기반으로
                한 통찰력이 매우 날카롭고 설득력 있음.2030세대의 자기 투영
                욕구를 기반으로 한 통찰력이 매우 날카롭고 설득력 있음.2030세대의
                자기 투영 욕구를 기반으로 한 통찰력이 매우 날카롭고 설득력
                있음.2030세대의 자기 투영 욕구를 기반으로 한 통찰력이 매우
                날카롭고 설득력 있음.2030세대의 자기 투영 욕구를 기반으로 한
                통찰력이 매우 날카롭고 설득력 있음.2030세대의 자기 투영 욕구를
                기반으로 한 통찰력이 매우 날카롭고 설득력 있음.
              </div>
            </div>

            <div className="flex w-[368px] flex-col items-start gap-5 rounded-[12px] border border-gray-300 px-6 py-4">
              <div className="flex flex-row items-center gap-1">
                <Weak />
                <div className="ds-subtitle text-warning-400 font-semibold">
                  약점
                </div>
              </div>

              <div className="ds-subtext font-medium text-gray-800">
                2030세대의 자기 투영 욕구를 기반으로 한 통찰력이 매우 날카롭고
                설득력 있음. 2030세대의 자기 투영 욕구를 기반으로 한 통찰력이
                매우 날카롭고 설득력 있음.2030세대의 자기 투영 욕구를 기반으로
                한 통찰력이 매우 날카롭고 설득력 있음.2030세대의 자기 투영
                욕구를 기반으로 한 통찰력이 매우 날카롭고 설득력 있음.2030세대의
                자기 투영 욕구를 기반으로 한 통찰력이 매우 날카롭고 설득력
                있음.2030세대의 자기 투영 욕구를 기반으로 한 통찰력이 매우
                날카롭고 설득력 있음.2030세대의 자기 투영 욕구를 기반으로 한
                통찰력이 매우 날카롭고 설득력 있음.2030세대의 자기 투영 욕구를
                기반으로 한 통찰력이 매우 날카롭고 설득력 있음.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserExpertModal;
