'use client';

const PaymentAmount = () => {
  const unitPrice = 49000;
  const totalAmount = 49000;

  return (
    <div className="mb-6 rounded-xl border border-gray-300 bg-white p-6">
      <h2 className="ds-subtitle mb-4 font-semibold text-gray-900">
        결제 금액
      </h2>
      <div className="mb-4 space-y-2.5">
        <div className="flex justify-between">
          <span className="ds-text font-medium text-gray-700">Lite 요금제</span>
          <span className="ds-text font-medium text-gray-700">
            {unitPrice.toLocaleString()}원
          </span>
        </div>

        <div className="h-px bg-gray-100"></div>
        <div className="flex justify-between">
          <span className="ds-text font-semibold text-gray-900">
            총 결제 금액
          </span>
          <span className="ds-text font-semibold text-gray-900">
            {totalAmount.toLocaleString()}원
          </span>
        </div>
        <div className="h-px bg-gray-100"></div>
      </div>
      <div className="ds-caption space-y-1.5 text-gray-500">
        <div className="flex items-center justify-between">
          <p>주문 내용을 확인했으며 결제에 동의합니다.</p>
          <span className="cursor-pointer underline">자세히</span>
        </div>
        <div className="flex items-center justify-between">
          <p>회원님의 개인정보는 안전하게 관리됩니다.</p>
          <span className="cursor-pointer underline">자세히</span>
        </div>
      </div>
    </div>
  );
};

export default PaymentAmount;
