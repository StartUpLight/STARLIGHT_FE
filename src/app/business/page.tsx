import React from "react";
import CreateModal from "./components/CreateModal";

const page = () => {
  return (
    //추후 수정 예정
    <CreateModal
      title="사업계획서 쉽게 생성하기"
      subtitle={`사업계획서 초안을 체크리스트로 쉽게 작성해 보세요.
      앞으로 사업계획서의 작성 효율과 퀄리티를 높여주는 자료가 될 거예요.`}
    />
  );
};

export default page;
