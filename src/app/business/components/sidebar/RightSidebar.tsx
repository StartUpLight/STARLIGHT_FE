'use client';
import React from 'react';
import SpellCheck from '../SpellCheck';
import CheckList from '../CheckList';

const RightSidebar = () => {
  return (
    <div className="flex h-full w-full flex-col gap-4">
      <CheckList />

      <div className="min-h-[310px]">
        <SpellCheck />
      </div>
    </div>
  );
};

export default RightSidebar;
