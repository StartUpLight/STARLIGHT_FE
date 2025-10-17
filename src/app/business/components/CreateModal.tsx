import Button from "@/app/_components/common/Button";
import React from "react";

interface CreateModalProps {
  title: string;
  subtitle: string;
}

const CreateModal = ({ title, subtitle }: CreateModalProps) => {
  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/20">
      <div className="flex p-10 w-[585px] flex-col items-start rounded-[20px] bg-gray-100">
        <div className="text-gray-800 ds-heading font-bold">{title}</div>

        <div className="mt-2 text-gray-600 ds-text font-medium whitespace-pre-line">
          {subtitle}
        </div>

        <div className="w-[505px] h-[144px] bg-white mt-8" />
        <Button text="생성하기" className="mt-8" />
      </div>
    </div>
  );
};

export default CreateModal;
