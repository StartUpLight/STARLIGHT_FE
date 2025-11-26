'use client';
import Button from '../_components/common/Button';
import { useRouter } from 'next/navigation';
import OrderDetails from './components/OrderDetails';
import PaymentAmount from './components/PaymentAmount';

const Page = () => {
  const router = useRouter();

  return (
    <div className="h-full bg-white">
      <div className="mx-auto max-w-[944px] min-w-[550px] px-6 py-[30px]">
        <h1 className="ds-title mb-6 font-semibold text-gray-900">결제</h1>
        <OrderDetails />
        <PaymentAmount />
        <Button
          text="결제하기"
          className="h-11 w-full"
          onClick={() => router.push('/pay/complete')}
        />
      </div>
    </div>
  );
};

export default Page;
