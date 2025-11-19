'use client';
import React from 'react';

interface TabsProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  className?: string;
}

const ExpertTab = ({
  tabs,
  activeTab,
  onTabChange,
  className = '',
}: TabsProps) => {
  return (
    <div className={`mt-9 flex gap-2 ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`ds-subtext cursor-pointer rounded-full px-5 py-2 font-medium ${
            activeTab === tab
              ? 'bg-gray-900 text-white'
              : 'border border-gray-300 bg-white text-gray-900 hover:bg-gray-300'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default ExpertTab;
