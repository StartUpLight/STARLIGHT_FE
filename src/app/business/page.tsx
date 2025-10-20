import React from 'react';
import WriteForm from './components/WriteForm';

const page = () => {
  return (
    <div className="min-h-[calc(100vh-60px)] w-full bg-gray-100">
      {/* width는 임의로 고정해두었는데 고정 값 빼면 너비 반응형 동작합니다. */}
      <main className="mx-auto w-full px-6">
        <WriteForm number={'0'} />
      </main>
    </div>
  );
};

export default page;
