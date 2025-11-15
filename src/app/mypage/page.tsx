import React from 'react';
import MyAccount from './components/MyAccount';

const page = () => {
  return (
    <div className="mt-[30px] flex flex-col items-start px-[132px]">
      <div className="ds-title font-semibold text-gray-900">마이페이지</div>
      <MyAccount />
    </div>
  );
};

export default page;
