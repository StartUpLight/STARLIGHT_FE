'use client';
import React from 'react';
import Close from '@/assets/icons/close.svg';
import { useGetOrders } from '@/hooks/queries/useMy';

interface PayHistoryModalProps {
  onClose?: () => void;
}

const PayHistoryModal = ({ onClose }: PayHistoryModalProps) => {
  const { data: orders } = useGetOrders();

  if (!orders) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="h-[422px] w-[800px] overflow-hidden rounded-xl bg-white">
        <div className="sticky top-0 z-20 flex w-full items-center justify-between border-b border-gray-200 bg-white px-6 py-5">
          <div className="ds-title font-semibold text-gray-900">결제 내역</div>
          <button
            aria-label="닫기"
            onClick={onClose}
            className="h-6 w-6 cursor-pointer"
          >
            <Close />
          </button>
        </div>

        <div className="relative max-h-[360px] overflow-auto pb-3">
          <table className="w-full table-fixed">
            <colgroup>
              <col className="w-[80px]" />
              <col className="w-[120px]" />
              <col className="w-[120px]" />
              <col className="w-[120px]" />
              <col className="w-[124px]" />
              <col className="w-[120px]" />
            </colgroup>

            <thead className="ds-subtext sticky top-0 z-10 bg-gray-100 font-semibold text-gray-900">
              <tr>
                <th className="py-[10px]">NO</th>
                <th>구매상품명</th>
                <th>결제 수단</th>
                <th>결제 금액</th>
                <th>결제일자</th>
                <th>상세보기</th>
              </tr>
            </thead>

            <tbody className="ds-body text-gray-900">
              {orders.map((order, index) => (
                <tr
                  key={index}
                  className="ds-subtext h-[45px] border-t border-gray-100 py-3 text-gray-700"
                >
                  <td className="py-2 text-center">{index + 1}</td>
                  <td className="text-center">{order.productName}</td>
                  <td className="text-center">{order.paymentMethod}</td>
                  <td className="text-center">{order.price}원</td>
                  <td className="text-center">
                    {new Date(order.paidAt * 1000).toLocaleDateString('ko-KR')}
                  </td>
                  <td className="cursor-pointer text-center font-medium underline">
                    <a
                      href={order.receiptUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      상세보기
                    </a>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="ds-subtext py-8 text-center text-gray-600"
                  >
                    결제 내역이 없어요.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PayHistoryModal;
