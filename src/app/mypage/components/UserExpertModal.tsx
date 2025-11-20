'use client';

import { useState, useEffect, useMemo } from 'react';
import Close from '@/assets/icons/close.svg';
import Strength from '@/assets/icons/strength_graph.svg';
import Weak from '@/assets/icons/weak_graph.svg';
import UserExpertHeader from './UserExpertHeader';
import { useBusinessStore } from '@/store/business.store';
import { useUserExpertReport } from '@/hooks/queries/useExpertReport';
import Image from 'next/image';

interface ExportModalProps {
  open?: boolean;
  onClose?: () => void;
  fileName?: string;
}

const UserExpertModal = ({
  open = true,
  onClose,
  fileName,
}: ExportModalProps) => {
  const businessPlanId = useBusinessStore((s) => s.planId);

  const {
    data: userReport,
    isLoading,
    error,
  } = useUserExpertReport((businessPlanId ?? 0) as number);

  const [selectedExpert, setSelectedExpert] = useState<string>('');

  const submittedReports = useMemo(
    () => userReport?.data?.filter((item) => item.status === 'SUBMITTED') ?? [],
    [userReport]
  );

  const experts = useMemo(
    () => submittedReports.map((item) => item.expertDetailResponse.name),
    [submittedReports]
  );

  const selectedReport = useMemo(() => {
    if (experts.length === 0) return undefined;
    if (!selectedExpert) return submittedReports[0];
    return (
      submittedReports.find(
        (item) => item.expertDetailResponse.name === selectedExpert
      ) ?? submittedReports[0]
    );
  }, [selectedExpert, submittedReports, experts]);

  useEffect(() => {
    if (!selectedExpert && experts.length > 0) {
      setSelectedExpert(experts[0]);
    }
  }, [experts, selectedExpert]);

  if (!open) return null;

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
        <div className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-5">
          <div className="rounded-xl bg-white px-6 py-4 text-gray-900">
            리포트를 불러오는 중
          </div>
          <button
            aria-label="닫기"
            onClick={onClose}
            className="h-6 w-6 cursor-pointer"
          >
            <Close />
          </button>
        </div>
      </div>
    );
  }

  if (error || !userReport) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
        <div className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-5">
          <div className="rounded-xl bg-white px-6 py-4 text-gray-900">
            리포트를 불러오지 못했습니다.
          </div>
          <button
            aria-label="닫기"
            onClick={onClose}
            className="h-6 w-6 cursor-pointer"
          >
            <Close />
          </button>
        </div>
      </div>
    );
  }

  if (!selectedReport) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
        <div className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-5">
          <div className="rounded-xl bg-white px-6 py-4 text-gray-900">
            전문가가 피드백을 완료한 리포트가 없습니다.
          </div>
          <button
            aria-label="닫기"
            onClick={onClose}
            className="h-6 w-6 cursor-pointer"
          >
            <Close />
          </button>
        </div>
      </div>
    );
  }

  const profileUrl = selectedReport.expertDetailResponse.profileImageUrl;

  const strengthDetails =
    selectedReport.details?.filter((d) => d.commentType === 'STRENGTH') ?? [];

  const weaknessDetails =
    selectedReport.details?.filter((d) => d.commentType === 'WEAKNESS') ?? [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="flex h-[422px] w-[800px] flex-col overflow-hidden rounded-xl bg-white">
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
            <div className="h-[115px] w-[103px] bg-gray-100">
              {profileUrl ? (
                <Image
                  src={profileUrl}
                  alt={`${selectedReport.expertDetailResponse.name} 프로필 이미지`}
                  width={103}
                  height={115}
                  className="h-full w-full rounded-xl object-cover"
                  priority
                />
              ) : (
                <span className="ds-subtext flex h-full items-center justify-center text-gray-400">
                  전문가 이미지가 없습니다.
                </span>
              )}
            </div>

            <div className="flex w-full flex-col">
              <div className="flex w-full flex-row gap-2.5">
                <div className="ds-text font-medium text-gray-800">
                  {selectedReport.expertDetailResponse.name} 전문가_피드백
                  보고서
                </div>

                <div className="ds-caption text-primary-500 mt-[3px] flex flex-row gap-1 font-medium">
                  {selectedReport.expertDetailResponse.tags?.map((tag) => (
                    <span key={tag}>#{tag}</span>
                  ))}
                </div>
              </div>

              <div className="my-2 h-px w-full bg-gray-100" />

              <div className="flex flex-col gap-1">
                <div className="ds-subtext font-medium text-gray-600">
                  {selectedReport.expertDetailResponse.careers?.map(
                    (career, idx) => (
                      <div key={idx}>{career}</div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex w-full flex-col gap-4 rounded-xl border border-[#DADFE7] px-6 py-4">
            <div className="ds-subtitle font-semibold text-gray-900">총평</div>
            <div className="ds-text bg-primary-50 text-primary-500 rounded-xl px-2.5 py-5 text-center font-semibold">
              {`"${selectedReport.overallComment}"`}
            </div>
          </div>

          <div className="flex flex-row gap-4">
            <div className="flex w-[368px] flex-col items-start gap-5 rounded-xl border border-gray-300 px-6 py-4">
              <div className="flex flex-row items-center gap-1">
                <Strength />
                <div className="ds-subtitle text-primary-500 font-semibold">
                  강점
                </div>
              </div>

              <div className="ds-subtext font-medium text-gray-800">
                {strengthDetails.map((d, idx) => (
                  <div key={idx}>{d.content}</div>
                ))}
              </div>
            </div>

            <div className="flex w-[368px] flex-col items-start gap-5 rounded-xl border border-gray-300 px-6 py-4">
              <div className="flex flex-row items-center gap-1">
                <Weak />
                <div className="ds-subtitle text-warning-400 font-semibold">
                  약점
                </div>
              </div>

              <div className="ds-subtext font-medium text-gray-800">
                {weaknessDetails.map((d, idx) => (
                  <div key={idx}>{d.content}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserExpertModal;
