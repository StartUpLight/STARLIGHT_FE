'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { postTossConfirm } from '@/api/payment';
import {
  OrderConfirmRequestPayload,
  OrderConfirmResponseDto,
} from '@/types/payment/payment.type';
import LoadingCheck from '@/assets/icons/blue_check.svg';

type ViewState = 'LOADING' | 'SUCCESS' | 'FAIL';

function PayComplete() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [state, setState] = useState<ViewState>('LOADING');
  const [data, setData] = useState<OrderConfirmResponseDto | null>(null);

  useEffect(() => {
    const paymentKey = searchParams.get('paymentKey');
    const orderId = searchParams.get('orderId');
    const code = searchParams.get('code');

    if (paymentKey && orderId) {
      const payload: OrderConfirmRequestPayload = {
        orderCode: orderId,
        paymentKey: paymentKey,
      };

      setState('LOADING');

      postTossConfirm(payload)
        .then((result) => {
          setData(result);
          setState('SUCCESS');
        })
        .catch((error: unknown) => {
          error instanceof Error
            ? error.message
            : '결제 승인 처리 중 오류가 발생했습니다.';

          setState('FAIL');
        });

      return;
    }

    if (code) {
      setState('FAIL');
      return;
    }

    setState('FAIL');
  }, [searchParams]);

  return (
    <main className="flex h-full items-center justify-center bg-white px-4">
      <div className="w-full max-w-xl rounded-2xl px-8 py-10 text-center">
        {state === 'LOADING' && (
          <>
            <h1 className="mb-2 text-xl font-semibold">결제 처리 중...</h1>
            <p className="text-sm text-gray-700">
              결제 승인 상태를 확인하고 있습니다. 잠시만 기다려 주세요.
            </p>
          </>
        )}

        {state === 'SUCCESS' && data && (
          <>
            <main className="flex h-full items-center justify-center bg-white px-4">
              <div className="w-full max-w-xl rounded-2xl px-8 py-10 text-center">
                <div className="mb-6">
                  <LoadingCheck />

                  <h1 className="ds-title mb-2 font-bold text-gray-900">
                    결제가 정상적으로 완료되었습니다.
                  </h1>
                  <p className="ds-subtext font-medium text-gray-700">
                    주문하신 내역을 확인해 주세요.
                  </p>
                </div>

                <div className="mb-5 rounded-lg bg-gray-100 p-6 text-left">
                  <div className="ds-subtext mb-4 flex justify-between">
                    <span className="min-w-20 font-medium text-gray-700">
                      주문번호
                    </span>
                    <span className="text-right font-semibold text-gray-900">
                      {data.orderId}
                    </span>
                  </div>

                  <div className="ds-subtext mb-4 flex justify-between">
                    <span className="min-w-20 font-medium text-gray-700">
                      상태
                    </span>
                    <span className="bg-primary-50 text-primary-500 inline-block rounded px-2 py-1 text-xs font-semibold">
                      {data.status}
                    </span>
                  </div>

                  <div className="mb-4 flex justify-between text-sm">
                    <span className="min-w-20 font-medium text-gray-700">
                      결제수단
                    </span>
                    <span className="text-right font-semibold text-gray-900">
                      {data.method}
                    </span>
                  </div>

                  <div className="mb-4 flex justify-between text-sm">
                    <span className="min-w-20 font-medium text-gray-700">
                      간편결제
                    </span>
                    <span className="text-right font-semibold text-gray-900">
                      {data.provider}
                    </span>
                  </div>

                  <div className="mb-4 flex justify-between text-sm">
                    <span className="min-w-20 font-medium text-gray-700">
                      승인시각
                    </span>
                    <span className="text-right font-semibold text-gray-900">
                      {data?.approvedAt != null
                        ? new Date(data.approvedAt * 1000).toLocaleString()
                        : '-'}
                    </span>
                  </div>

                  <div className="my-4 border-t border-dashed border-[#dddddd]" />

                  <div className="flex items-center justify-between text-sm">
                    <span className="min-w-20 font-medium text-gray-700">
                      결제금액
                    </span>
                    <span className="text-primary-500 ds-subtitle text-right font-bold">
                      {data.amount.toLocaleString()}원
                    </span>
                  </div>
                </div>

                <div className="flex gap-3">
                  {data.receiptUrl && (
                    <a
                      href={data.receiptUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="ds-subtext inline-flex flex-1 cursor-pointer items-center justify-center rounded-lg border-[1.2px] border-gray-300 bg-white px-4 py-3 font-semibold text-gray-900 hover:bg-gray-100"
                    >
                      영수증 확인
                    </a>
                  )}

                  <button
                    className="bg-primary-500 hover:bg-primary-700 ds-subtext inline-flex flex-1 cursor-pointer items-center justify-center rounded-lg px-4 py-3 font-semibold text-white"
                    onClick={() => router.push('/price')}
                  >
                    돌아가기
                  </button>
                </div>
              </div>
            </main>
          </>
        )}

        {state === 'FAIL' && (
          <>
            <div className="mb-6">
              <div className="bg-primary-50 text-primary-500 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full text-3xl">
                !
              </div>
              <h1 className="mb-2 text-2xl font-bold text-gray-900">
                결제에 실패했습니다.
              </h1>
              <p className="ds-subtext text-gray-700">
                요청하신 결제가 정상적으로 처리되지 않았습니다.
              </p>
            </div>

            <div className="mb-5 flex w-full flex-col items-start rounded-lg bg-gray-100 px-8 py-5">
              <div className="font-medium text-gray-900">
                💳 결제 실패 시 확인해주세요
              </div>

              <div className="ds-subtext mt-3 flex flex-col items-start gap-1 text-gray-800">
                <div>1. 사용 중인 카드의 잔액과 한도를 확인해주세요.</div>
                <div>
                  2. 네트워크 환경이 안정적인지 점검 후 다시 시도해주세요.
                </div>
                <div>
                  3. 간편결제(토스페이·카카오페이 등)는 앱이 최신 버전인지
                  확인해주세요.
                </div>
                <div>
                  4. 동일 결제를 반복 시도한 경우 잠시 후 재시도해주세요.{' '}
                </div>
                <div>5. 계속 결제가 실패한다면 고객센터로 문의해 주세요.</div>
              </div>
            </div>

            <button
              type="button"
              className="bg-primary-500 hover:bg-primary-700 inline-flex w-[107px] flex-1 cursor-pointer items-center justify-center rounded-lg px-4 py-3 text-sm font-semibold text-white"
              onClick={() => router.push('/price')}
            >
              돌아가기
            </button>
          </>
        )}
      </div>
    </main>
  );
}

export default function PayCompletePage() {
  return (
    <Suspense
      fallback={
        <main className="flex h-full items-center justify-center bg-white px-4">
          <div className="w-full max-w-xl rounded-2xl px-8 py-10 text-center">
            <h1 className="mb-2 text-xl font-semibold">결제 처리 중</h1>
            <p className="text-sm text-gray-700">
              결제 승인 상태를 확인하고 있습니다. 잠시만 기다려 주세요.
            </p>
          </div>
        </main>
      }
    >
      <PayComplete />
    </Suspense>
  );
}
