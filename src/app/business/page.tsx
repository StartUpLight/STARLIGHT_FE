import React from "react";
import WriteForm from "./components/WriteForm";

const page = () => {
  return (
    <div className="w-full min-h-[calc(100vh-60px)] bg-gray-100">
      {/* width는 임의로 고정해두었는데 고정 값 빼면 너비 반응형 동작합니다. */}
      <main className="mx-auto px-6 w-full mt-[60px]">
        <WriteForm number={"0"} />
      </main>
    </div>
  );
};

export default page;
