'use client';
import { useState } from "react";
import Button from "../_components/common/Button";
import { useRouter } from "next/navigation";
import OrderDetails from "./components/OrderDetails";
import PaymentMethod from "./components/PaymentMethod";
import PaymentAmount from "./components/PaymentAmount";

const Page = () => {
    const router = useRouter();
    const [quantity, setQuantity] = useState(1);
    const [selectedPayment, setSelectedPayment] = useState('card');
    return (
        <div className="min-h-screen bg-white">
            <div className="mx-auto py-[30px] min-w-[550px] max-w-[944px] px-6">
                <h1 className="ds-title font-semibold text-gray-900 mb-6">결제</h1>
                <OrderDetails
                    quantity={quantity}
                    onQuantityChange={setQuantity}
                />
                <PaymentMethod
                    selectedPayment={selectedPayment}
                    onPaymentChange={setSelectedPayment}
                />
                <PaymentAmount quantity={quantity} />
                <Button
                    text="결제하기"
                    className="w-full h-[44px]"
                    onClick={() => router.push('/pay/complete')}
                />
            </div>
        </div>
    )
}

export default Page