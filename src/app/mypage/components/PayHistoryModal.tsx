'use client';
import React from 'react';
import Close from '@/assets/icons/close.svg';

const sampleRows = Array.from({ length: 12 }).map((_, i) => ({
  id: '02',
  productName: '라이트',
  method: '신용카드',
  amount: 4900,
  paidAt: '25.10.07',
}));

const KRW = (n: number) => n.toLocaleString('ko-KR');

interface PayHistoryModalProps {
  open?: boolean;
  onClose?: () => void;
  rows?: {
    id: string | number;
    productName: string;
    method: string;
    amount: number;
    paidAt: string;
  }[];
}

const PayHistoryModal = ({
  open = true,
  onClose,
  rows = sampleRows,
}: PayHistoryModalProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="h-[422px] w-[800px] overflow-hidden rounded-[12px] bg-white">
        <div className="sticky top-0 z-20 flex w-full items-center justify-between border-b border-gray-200 bg-white px-6 py-5">
          <div className="ds-title font-semibold text-gray-900">
            이용권 구매 내역
          </div>
          <button aria-label="닫기" onClick={onClose} className="h-6 w-6">
            <Close />
          </button>
        </div>

        <div className="relative overflow-auto">
          <table className="h-[41px] w-full table-fixed py-[10px] pl-8">
            <colgroup>
              <col className="w-[80px]" />
              <col className="w-[120px]" />
              <col className="w-[120px]" />
              <col className="w-[120px]" />
              <col className="w-[124px]" />
              <col className="w-[120px]" />
            </colgroup>

            <thead className="ds-subtext sticky top-0 z-10 w-full bg-gray-100 py-[10px] pl-8 font-semibold text-gray-900">
              <tr className="border-b">
                <th>NO</th>
                <th>구매상품평</th>
                <th>결제 수단</th>
                <th>결제 금액</th>
                <th>결제일자</th>
                <th>상세보기</th>
              </tr>
            </thead>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PayHistoryModal;
