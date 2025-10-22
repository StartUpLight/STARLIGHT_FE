'use client';
import SmallLogo from "@/assets/icons/small_logo.svg";
import Minus from "@/assets/icons/minus.svg";
import Plus from "@/assets/icons/plus.svg";

interface OrderDetailsProps {
    quantity: number;
    onQuantityChange: (quantity: number) => void;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ quantity, onQuantityChange }) => {
    return (
        <div className="bg-white rounded-xl p-6 mb-[11px] border border-gray-300">
            <h2 className="ds-subtitle font-semibold text-gray-900 mb-4">주문내역</h2>
            <div className="flex items-start gap-3">
                <div className="h-[115px] px-4 gap-[2.5px] bg-gray-100 rounded-xl flex items-center justify-center">
                    <SmallLogo />
                    <span className="text-gray-900 font-semibold ds-subtext">Starlight</span>
                </div>
                <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex gap-2">
                            <h3 className="ds-text text-gray-800 font-medium">홍길동 전문가 심사</h3>
                            <div className="flex items-center gap-1">
                                <span className="ds-caption text-primary-500 font-medium">#BM</span>
                                <span className="ds-caption text-primary-500 font-medium">#문제정의</span>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <button
                                onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
                                className="cursor-pointer w-[36px] h-[28px] bg-gray-100 rounded-l-lg flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors"
                            >
                                <Minus />
                            </button>
                            <div className="w-[28px] h-[28px] bg-gray-100 flex items-center justify-center">
                                <span className="text-gray-900 font-medium ds-subtext">{quantity}</span>
                            </div>
                            <button
                                onClick={() => onQuantityChange(quantity + 1)}
                                className="cursor-pointer w-[36px] h-[28px] bg-gray-100 rounded-r-lg flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors"
                            >
                                <Plus />
                            </button>
                        </div>
                    </div>
                    <div className="h-[1px] bg-gray-100 my-2"></div>
                    <div className="flex flex-col gap-1">
                        <p className="ds-subtext text-gray-600 font-medium">홍길동님의 이력</p>
                        <p className="ds-subtext text-gray-600 font-medium">홍길동님의 이력</p>
                        <p className="ds-subtext text-gray-600 font-medium">홍길동님의 이력</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;
