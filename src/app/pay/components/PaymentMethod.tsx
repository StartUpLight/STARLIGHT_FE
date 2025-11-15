'use client';
import TossIcon from "@/assets/icons/toss.svg";

interface PaymentMethodProps {
    selectedPayment: string;
    onPaymentChange: (payment: string) => void;
}

const PaymentMethod: React.FC<PaymentMethodProps> = ({ selectedPayment, onPaymentChange }) => {
    return (
        <div className="bg-white rounded-xl p-6 mb-6 border border-gray-300">
            <h2 className="ds-subtitle font-semibold text-gray-900 mb-4">결제수단</h2>
            <div className="flex gap-[15.7px]">
                <button
                    onClick={() => onPaymentChange('card')}
                    className={`cursor-pointer flex-1 p-[10px] h-[64px] border rounded-xl ds-text font-medium transition-colors ${selectedPayment === 'card'
                            ? 'bg-primary-50 border-gray-300'
                            : 'border-gray-300 text-gray-800 hover:bg-primary-50'
                        }`}
                >
                    신용/체크카드
                </button>
                <button
                    onClick={() => onPaymentChange('toss')}
                    className={`cursor-pointer flex-1 flex items-center justify-center gap-[10px] p-[10px] h-[64px] border rounded-xl transition-colors ${selectedPayment === 'toss'
                            ? 'bg-primary-50 border-gray-300'
                            : 'border-gray-300 text-gray-800 hover:bg-primary-50'
                        }`}
                >
                    <TossIcon />
                    <span className="ds-text font-medium">토스페이</span>
                </button>
            </div>
        </div>
    );
};

export default PaymentMethod;
