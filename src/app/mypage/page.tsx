import React from 'react';
import MyAccount from './components/MyAccount';
import PlanList from './components/PlanList';

const page = () => {
  return (
    <div className="mx-auto mt-[30px] flex w-[944px] flex-col items-start pb-32">
      <div className="ds-title font-semibold text-gray-900">마이페이지</div>
      <MyAccount />
      <PlanList />
    </div>
  );
};

export default page;
