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
      checked: boolean;
    }>
  >([]);

  useEffect(() => {
    const data = sections as Section[];

    for (const section of data) {
      const found = section.items.find((it) => it.number === selected.number);
      if (found?.checklist) {
        const itemContent = getItemContent(selected.number);
        const savedChecks = itemContent.checks || [];

        setItems(
          found.checklist.map((e, index) => ({
            title: e.title,
            content: e.content,
            checked: savedChecks[index] || false,
          }))
        );
        return;
      }
    }

    setItems([]);
  }, [selected.number, getItemContent]);

  const handleCheck = async () => {
    if (!planId || items.length === 0) return;

    await saveAllItems(planId);

    const subSectionType = getSubSectionTypeFromNumber(selected.number);
    if (!subSectionType) {
      console.error('해당되는 subsection을 찾을 수 없습니다.', selected.number);
      return;
    }

    const itemContent = getItemContent(selected.number);
    const subsectionRequest = buildSubsectionRequest(
      selected.number,
      selected.title,
      itemContent
    );

    const currentChecks = items.map((item) => item.checked);

    const body: CheckListResponse = {
      subSectionType,
      checks: currentChecks,
      meta: {
        author: '이호근',
        createdAt: new Date().toISOString().slice(0, 10),
      },
      blocks: subsectionRequest.blocks,
    };

    checkListConfirm(
      { planId, body },
      {
        onSuccess: (res) => {
          const serverChecks = res.data || currentChecks;

          setItems((prev) =>
            prev.map((item, i) => ({
              ...item,
              checked: serverChecks[i] || false,
            }))
          );

          updateItemContent(selected.number, {
            checks: serverChecks,
          });
        },
      }
    );
  };

  return (
    <div className="flex h-[439px] w-full flex-col rounded-xl bg-white">
      <div className="flex w-full items-center border-b border-gray-200 px-6 pt-4 pb-2.5">
        <span className="ds-subtitle font-semibold text-gray-900">
          체크리스트
        </span>
      </div>

      <div className="flex w-full flex-col space-y-2.5 px-6 py-5">
        {items.map((item, i) => {
          const isChecked = item.checked;

          return (
            <div key={`${item.title}-${i}`}>
              <div className="flex items-center gap-2.5">
                {isChecked ? (
                  <div className="bg-primary-500 flex h-[18px] w-[18px] items-center justify-center rounded-full">
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
                <div className="mt-2.5 h-px w-full bg-gray-100" />
              )}
            </div>
          );
        })}

        <Button
          text={isPending ? '점검 중' : '점검하기'}
          className="mt-2.5 rounded-lg"
          disabled={isPending}
          onClick={handleCheck}
        />
      </div>
    </div>
  );
};

export default CheckList;
