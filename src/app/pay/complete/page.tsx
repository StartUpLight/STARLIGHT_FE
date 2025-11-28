'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { postTossConfirm } from '@/api/payment';
import {
  OrderConfirmRequestPayload,
  OrderConfirmResponseDto,
} from '@/types/payment/payment.type';
import Check from '@/assets/icons/check.svg';

import { useBusinessStore } from '@/store/business.store';
import {
  getBusinessPlanSubsections,
  getBusinessPlanTitle,
} from '@/api/business';
import { generatePdfFromSubsections } from '@/lib/generatePdf';
import { ApplyFeedback } from '@/api/expert';

import PayProcessingView from './components/PayProcessingView';
import PayFailView from './components/PayFailView';

type ViewState = 'LOADING' | 'SUCCESS' | 'FAIL';

function PayCompleteInner() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [state, setState] = useState<ViewState>('LOADING');
  const [data, setData] = useState<OrderConfirmResponseDto | null>(null);

  const planId = useBusinessStore((s) => s.planId);
  const [sending, setSending] = useState(false);
  const sendOnceRef = useRef(false);

  const expertIdParam = searchParams.get('expertId');
  const expertId = expertIdParam ? Number(expertIdParam) : undefined;

  useEffect(() => {
    const paymentKey = searchParams.get('paymentKey');
    const orderId = searchParams.get('orderId');
    const code = searchParams.get('code');

    if (paymentKey && orderId) {
      const payload: OrderConfirmRequestPayload = {
        orderCode: orderId,
        paymentKey,
      };

      setState('LOADING');

      postTossConfirm(payload)
        .then((result) => {
          setData(result);
          setState('SUCCESS');
        })
        .catch(() => {
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

  useEffect(() => {
    if (state !== 'SUCCESS' || !data) return;
    if (data.status !== 'PAID') return;
    if (!planId || !expertId) return;
    if (sendOnceRef.current) return;

    sendOnceRef.current = true;

    const sendEmail = async () => {
      try {
        setSending(true);

        const response = await getBusinessPlanSubsections(planId);

        let title = response.data?.title;
        if (!title) {
          try {
            const titleResponse = await getBusinessPlanTitle(planId);
            if (titleResponse.result === 'SUCCESS' && titleResponse.data) {
              title = titleResponse.data;
            }
          } catch (e) {
            console.warn('제목 조회 실패:', e);
          }
        }

        let pdfFile: File;
        try {
          pdfFile = await generatePdfFromSubsections(response, title);
        } catch (pdfError) {
          console.error('PDF 생성 실패, 빈 파일로 대체합니다:', pdfError);
          pdfFile = new File([new Uint8Array()], 'empty.pdf', {
            type: 'application/pdf',
          });
        }

        await ApplyFeedback({
          expertId,
          businessPlanId: planId,
          file: pdfFile,
        });
      } catch (e) {
        console.error('전문가 연결(메일 전송) 실패:', e);
      } finally {
        setSending(false);
      }
    };

    sendEmail();
  }, [state, data, planId, expertId]);

  if (state === 'LOADING') {
    return <PayProcessingView />;
  }

  if (state === 'FAIL') {
    return <PayFailView onBack={() => router.push('/price')} />;
  }

  return (
    <div className="flex min-h-screen justify-center bg-white">
      <div className="mt-[220px] text-center">
        <div className="bg-primary-500 mx-auto mb-6 flex h-[60px] w-[60px] items-center justify-center rounded-full">
          <Check />
        </div>
        <h1 className="ds-heading mb-2 font-bold text-gray-900">신청완료</h1>
        <div className="mb-6">
          <p className="ds-subtitle font-medium text-gray-600">
            전문가 멘토링 신청이 완료 되었어요!
          </p>
          <p className="ds-subtitle font-medium text-gray-600">
            멘토링 결과는 마이페이지에서 확인할 수 있어요.
          </p>
        </div>

        {sending && (
          <p className="ds-caption mb-3 text-gray-700">
            전문가에게 사업계획서를 전달하는 중입니다.
          </p>
        )}

        <div className="mt-2 flex justify-center gap-4">
          <button
            className="border-primary-500 text-primary-500 hover:bg-primary-50 h-11 w-[200px] shrink-0 cursor-pointer rounded-lg border bg-white font-medium whitespace-nowrap transition-colors"
            onClick={() => router.push('/expert')}
          >
            또 다른 멘토 신청하기
          </button>
          <button
            className="bg-primary-500 hover:bg-primary-600 h-11 w-[200px] shrink-0 cursor-pointer rounded-lg font-medium whitespace-nowrap text-white transition-colors"
            onClick={() => router.push('/expert')}
          >
            신청 내역 확인하기
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PayCompletePage() {
  return (
    <Suspense fallback={<PayProcessingView />}>
      <PayCompleteInner />
    </Suspense>
  );
}
