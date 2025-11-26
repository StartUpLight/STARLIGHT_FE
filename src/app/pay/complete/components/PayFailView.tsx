'use client';

type PayFailViewProps = {
  onBack: () => void;
};

const PayFailView = ({ onBack }: PayFailViewProps) => {
  return (
    <main className="flex h-full items-center justify-center bg-white px-4">
      <div className="w-full max-w-xl rounded-2xl px-8 py-10 text-center">
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
            <div>2. 네트워크 환경이 안정적인지 점검 후 다시 시도해주세요.</div>
            <div>
              3. 간편결제(토스페이·카카오페이 등)는 앱이 최신 버전인지
              확인해주세요.
            </div>
            <div>4. 동일 결제를 반복 시도한 경우 잠시 후 재시도해주세요.</div>
            <div>5. 계속 결제가 실패한다면 고객센터로 문의해 주세요.</div>
          </div>
        </div>

        <button
          type="button"
          className="bg-primary-500 hover:bg-primary-700 inline-flex w-[107px] flex-1 cursor-pointer items-center justify-center rounded-lg px-4 py-3 text-sm font-semibold text-white"
          onClick={onBack}
        >
          돌아가기
        </button>
      </div>
    </main>
  );
};

export default PayFailView;
