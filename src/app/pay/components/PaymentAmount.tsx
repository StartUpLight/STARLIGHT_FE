'use client';

interface PaymentAmountProps {
    quantity: number;
}

const PaymentAmount: React.FC<PaymentAmountProps> = ({ quantity }) => {
    const unitPrice = 4900;
    const totalAmount = unitPrice * quantity;

    return (
        <div className="bg-white rounded-xl p-6 mb-6 border border-gray-300">
            <h2 className="ds-subtitle font-semibold text-gray-900 mb-4">결제 금액</h2>
            <div className="space-y-[10px] mb-4">
                <div className="flex justify-between">
                    <span className="ds-text text-gray-700 font-medium">상품 금액</span>
                    <span className="ds-text text-gray-700 font-medium">{unitPrice.toLocaleString()}원</span>
                </div>
                <div className="flex justify-between">
                    <span className="ds-text text-gray-700 font-medium">구매 수량</span>
                    <span className="ds-text text-gray-700 font-medium">{quantity}</span>
                </div>
                <div className="h-[1px] bg-gray-100"></div>
                <div className="flex justify-between">
                    <span className="ds-text font-semibold text-gray-900">총 결제 금액</span>
                    <span className="ds-text font-semibold text-gray-900">{totalAmount.toLocaleString()}원</span>
                </div>
                <div className="h-[1px] bg-gray-100"></div>
            </div>
            <div className="ds-caption text-gray-500 space-y-1.5">
                <div className="flex justify-between items-center">
                    <p>주문 내용을 확인했으며 결제에 동의합니다.</p>
                    <span className="underline cursor-pointer">자세히</span>
                </div>
                <div className="flex justify-between items-center">
                    <p>회원님의 개인정보는 안전하게 관리됩니다.</p>
                    <span className="underline cursor-pointer">자세히</span>
                </div>
            </div>
        </div>
    );
};

export default PaymentAmount;
