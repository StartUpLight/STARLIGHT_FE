'use client';
import SmallLogo from "@/assets/icons/small_logo.svg";
import Minus from "@/assets/icons/minus.svg";
import Plus from "@/assets/icons/plus.svg";
import TossIcon from "@/assets/icons/toss.svg";
import { useState } from "react";
import Button from "../_components/common/Button";
import { useRouter } from "next/navigation";

const page = () => {
    const router = useRouter();
    const [quantity, setQuantity] = useState(1);
    const [selectedPayment, setSelectedPayment] = useState('card');
    return (
        <div className="min-h-screen bg-white">
            <div className="mx-auto py-[30px] min-w-[550px] max-w-[944px] px-6">
                <h1 className="ds-title font-semibold text-gray-900 mb-6">결제</h1>
                <div className="bg-white rounded-xl p-6 mb-[11px] border border-gray-300">
                    <h2 className="ds-subtitle font-semibold text-gray-900 mb-4">주문내역</h2>
                    <div className="flex items-start gap-3">
                        <div className=" h-[115px] px-4 gap-[2.5px] bg-gray-100 rounded-xl flex items-center justify-center">
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
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="cursor-pointer w-[36px] h-[28px] bg-gray-100 rounded-l-lg flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors"
                                    >
                                        <Minus />
                                    </button>
                                    <div className="w-[28px] h-[28px] bg-gray-100 flex items-center justify-center">
                                        <span className="text-gray-900 font-medium ds-subtext">{quantity}</span>
                                    </div>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
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

                <div className="bg-white rounded-xl p-6 mb-6 border border-gray-300">
                    <h2 className="ds-subtitle font-semibold text-gray-900 mb-4">결제수단</h2>
                    <div className="flex gap-[15.7px]">
                        <button
                            onClick={() => setSelectedPayment('card')}
                            className={`cursor-pointer flex-1 p-[10px] h-[64px] border rounded-xl ds-text font-medium transition-colors ${selectedPayment === 'card'
                                ? ' bg-primary-50 border-gray-300'
                                : 'border-gray-300 text-gray-800 hover:bg-primary-50'
                                }`}
                        >
                            신용/체크카드
                        </button>
                        <button
                            onClick={() => setSelectedPayment('toss')}
                            className={`cursor-pointer flex-1 flex items-center justify-center gap-[10px] p-[10px] h-[64px] border rounded-xl transition-colors ${selectedPayment === 'toss'
                                ? ' bg-primary-50 border-gray-300'
                                : 'border-gray-300 text-gray-800 hover:bg-primary-50'
                                }`}
                        >
                            <TossIcon />
                            <span className="ds-text font-medium">토스페이</span>
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 mb-6 border border-gray-300">
                    <h2 className="ds-subtitle font-semibold text-gray-900 mb-4">결제 금액</h2>
                    <div className="space-y-[10px] mb-4">
                        <div className="flex justify-between">
                            <span className="ds-text text-gray-700 font-medium">상품 금액</span>
                            <span className="ds-text text-gray-700 font-medium">4,900원</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="ds-text text-gray-700 font-medium">구매 수량</span>
                            <span className="ds-text text-gray-700 font-medium">{quantity}</span>
                        </div>
                        <div className="h-[1px] bg-gray-100"></div>
                        <div className="flex justify-between">
                            <span className="ds-text font-semibold text-gray-900">총 결제 금액</span>
                            <span className="ds-text font-semibold text-gray-900">{(4900 * quantity).toLocaleString()}원</span>
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
                <Button text="결제하기" className="w-full h-[44px]" onClick={() => router.push('/pay/complete')} />
            </div>
        </div>
    )
}

export default page