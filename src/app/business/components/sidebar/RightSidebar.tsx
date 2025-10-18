import React from "react";
import Button from "@/app/_components/common/Button";
import SpellCheck from "../SpellCheck";
import CheckList from "../CheckList";

const RightSidebar = () => {
  return (
    <div className="flex flex-col gap-4 w-full h-full">
      <CheckList />

      <div className="min-h-[310px]">
        <SpellCheck />
      </div>

      <div className="flex w-full flex-row gap-[10px] mt-4 flex-shrink-0">
        <Button
          text="미리보기"
          size="L"
          color="secondary"
          className="w-[156px] rounded-[8px]"
        />

        <Button text="채점하기" size="L" className="w-[156px] rounded-[8px]" />
      </div>
    </div>
  );
};

export default RightSidebar;
