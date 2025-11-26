'use client';
import SmallLogo from '@/assets/icons/small_logo.svg';

const OrderDetails = () => {
  return (
    <div className="mb-[11px] rounded-xl border border-gray-300 bg-white p-6">
      <h2 className="ds-subtitle mb-4 font-semibold text-gray-900">주문내역</h2>
      <div className="flex items-start gap-3">
        <div className="flex h-[115px] items-center justify-center gap-[2.5px] rounded-xl bg-gray-100 px-4">
          <SmallLogo />
          <span className="ds-subtext font-semibold text-gray-900">
            Starlight
          </span>
        </div>
        <div className="flex-1">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex gap-2">
              <h3 className="ds-text font-medium text-gray-800">
                홍길동 전문가 심사
              </h3>
              <div className="flex items-center gap-1">
                <span className="ds-caption text-primary-500 font-medium">
                  #BM
                </span>
                <span className="ds-caption text-primary-500 font-medium">
                  #문제정의
                </span>
              </div>
            </div>
          </div>
          <div className="my-2 h-px bg-gray-100"></div>
          <div className="flex flex-col gap-1">
            <p className="ds-subtext font-medium text-gray-600">
              홍길동님의 이력
            </p>
            <p className="ds-subtext font-medium text-gray-600">
              홍길동님의 이력
            </p>
            <p className="ds-subtext font-medium text-gray-600">
              홍길동님의 이력
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
