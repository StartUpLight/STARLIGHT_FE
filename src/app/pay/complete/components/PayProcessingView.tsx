'use client';

const PayProcessingView = () => {
  return (
    <div className="flex h-full justify-center bg-white">
      <div className="mt-[220px] text-center">
        <h1 className="ds-heading mb-2 font-bold text-gray-900">
          결제 처리 중...
        </h1>
        <p className="ds-subtitle font-medium text-gray-600">
          결제 승인 상태를 확인하고 있습니다. 잠시만 기다려 주세요.
        </p>
      </div>
    </div>
  );
};

export default PayProcessingView;
