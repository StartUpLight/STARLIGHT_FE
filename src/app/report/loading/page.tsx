'use client';
import Check from "@/assets/icons/check.svg";
import LoadingPoint from "@/assets/icons/loading_point.svg";

const page = () => {
    return (
        <div className="min-h-screen bg-white flex justify-center">
            <div className="text-center mt-[220px]">
                <div className="w-[60px] h-[60px] bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-6 gap-[6px]">
                    <LoadingPoint />
                    <LoadingPoint />
                    <LoadingPoint />
                </div>
                <h1 className="ds-heading font-bold text-gray-900 mb-2">사업계획서 분석중</h1>
                <div className="mb-[44px]">
                    <p className="ds-subtitle font-medium text-gray-600">사업계획서를 분석 중이에요.</p>
                    <p className="ds-subtitle font-medium text-gray-600">잠시만 기다려주세요!</p>
                </div>
            </div>
        </div>
    )
}

export default page
