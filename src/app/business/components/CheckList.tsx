'use client';
import React, { useEffect, useState } from 'react';
import Button from '@/app/_components/common/Button';
import Check from '@/assets/icons/white_check.svg';
import { useBusinessStore } from '@/store/business.store';
import sections from '@/data/sidebar.json';
import { CheckListResponse, Section } from '@/types/business/checklist.type';
import { usePostCheckList } from '@/hooks/mutation/usePostChecklist';
import { getSubSectionTypeFromNumber } from '@/lib/business/mappers/getSubsection';
import { buildSubsectionRequest } from '@/lib/business/requestBuilder';

const CheckList = () => {
  const selected = useBusinessStore((s) => s.selectedItem);
  const planId = useBusinessStore((s) => s.planId);
  const saveAllItems = useBusinessStore((s) => s.saveAllItems);
  const getItemContent = useBusinessStore((s) => s.getItemContent);
  const updateItemContent = useBusinessStore((s) => s.updateItemContent);
  const { mutate: checkListConfirm, isPending } = usePostCheckList();

  const [items, setItems] = useState<
    Array<{
      title: string;
      content: string;
      userChecked: boolean;
      Checked: boolean;
    }>
  >([]);

  useEffect(() => {
    const data = sections as Section[];
    for (const section of data) {
      const found = section.items.find((it) => it.number === selected.number);
      if (found?.checklist) {
        // store에서 체크 상태 불러오기
        const itemContent = getItemContent(selected.number);
        const savedChecks = itemContent.checks || [];

        setItems(
          found.checklist.map((e, index) => ({
            title: e.title,
            content: e.content,
            userChecked: false,
            Checked: savedChecks[index] || false,
          }))
        );
        return;
      }
    }
    setItems([]);
  }, [selected.number, getItemContent]);

  const toggleCheck = (idx: number) => {
    setItems((prev) =>
      prev.map((item, i) =>
        i === idx ? { ...item, userChecked: !item.userChecked } : item
      )
    );
  };

  const handleCheck = async () => {
    if (!planId || items.length === 0) return;

    await saveAllItems(planId);

    const subSectionType = getSubSectionTypeFromNumber(selected.number);
    if (!subSectionType) {
      console.error('해당되는 subsection을 찾을 수 없습니다.', selected.number);
      return;
    }

    // 해당 서브섹션의 에디터 내용 가져오기
    const itemContent = getItemContent(selected.number);
    const subsectionRequest = buildSubsectionRequest(
      selected.number,
      selected.title,
      itemContent
    );

    // 현재 체크 상태를 checks 배열에 포함 (userChecked 또는 Checked 상태)
    const currentChecks = items.map((item) => item.userChecked || item.Checked);

    const body: CheckListResponse = {
      subSectionType,
      checks: currentChecks,
      meta: {
        author: '이호근',
        createdAt: new Date().toISOString().slice(0, 10),
      },
      blocks: subsectionRequest.blocks,
    };

    // 요청 바디 콘솔 출력
    console.log('체크리스트 요청 바디:', JSON.stringify(body, null, 2));

    checkListConfirm(
      { planId, body },
      {
        onSuccess: (res) => {
          // 서버에서 반환된 체크 상태로 업데이트
          const serverChecks = res.data || currentChecks;

          setItems((prev) =>
            prev.map((item, i) => ({
              ...item,
              userChecked: false, // 점검 완료 후 userChecked 초기화
              Checked: serverChecks[i] || false,
            }))
          );

          // store에 체크 상태 저장
          updateItemContent(selected.number, {
            checks: serverChecks,
          });
        },
      }
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
        {items.map((item, i) => {
          const isChecked = item.userChecked || item.Checked;
          const isUserCheck = item.userChecked;

          return (
            <div key={`${item.title}-${i}`}>
              <div
                className="flex cursor-pointer items-center gap-[10px]"
                onClick={() => toggleCheck(i)}
              >
                {isChecked ? (
                  <div
                    className={`flex h-[18px] w-[18px] items-center justify-center rounded-full ${isUserCheck ? 'bg-gray-900' : 'bg-primary-500'
                      }`}
                  >
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

              {i < items.length - 1 && (
                <div className="mt-[10px] h-[1px] w-full bg-gray-100" />
              )}
            </div>
          );
        })}

        <Button
          text={isPending ? '점검 중' : '점검하기'}
          className="mt-[10px] rounded-[8px]"
          disabled={isPending}
          onClick={handleCheck}
        />
      </div>
    </div>
  );
};

export default CheckList;
