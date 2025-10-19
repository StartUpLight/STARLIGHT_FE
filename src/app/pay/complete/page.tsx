'use client';
import Button from "@/app/_components/common/Button";
import Check from "@/assets/icons/check.svg";

const page = () => {
    return (
        <div className="min-h-screen bg-white flex justify-center">
            <div className="text-center mt-[220px]">
                <div className="w-[60px] h-[60px] bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check />
                </div>
                <h1 className="ds-heading font-bold text-gray-900 mb-2">신청완료</h1>
                <div className="mb-[44px]">
                    <p className="ds-subtitle font-medium text-gray-600">전문가 멘토링 신청이 완료 되었어요!</p>
                    <p className="ds-subtitle font-medium text-gray-600">멘토링 결과는 마이페이지에서 확인할 수 있어요.</p>
                </div>
                <div className="flex gap-4 justify-center">
                    <button
                        className="w-[200px] flex-shrink-0 whitespace-nowrap cursor-pointer h-[44px] bg-white border border-primary-500 text-primary-500 hover:bg-primary-50 rounded-lg font-medium transition-colors">
                        또 다른 멘토 신청하기
                    </button>
                    <button
                        className="w-[200px] flex-shrink-0 whitespace-nowrap cursor-pointer h-[44px] bg-primary-500 text-white hover:bg-primary-600 rounded-lg font-medium transition-colors">
                        신청 내역 확인하기
                    </button>

                </div>
            </div>
        </div>
    )
}

export default page
