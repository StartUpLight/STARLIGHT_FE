import React from 'react';
import MyAccount from './components/MyAccount';
import PlanList from './components/PlanList';

const page = () => {
  return (
    <div className="mt-[30px] pb-[128px] flex flex-col items-start w-[944px] mx-auto">
      <div className="ds-title font-semibold text-gray-900">마이페이지</div>
      <MyAccount />
      <PlanList />
    </div>
  );
};

export default page;
