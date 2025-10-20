import React from 'react';

interface EvaluationCardProps {
  index: number;
  title: string;
  description: string;
}

const EvaluationCard = ({ index, title, description }: EvaluationCardProps) => {
  return (
    <div className="bg-gray-80 flex flex-col gap-5 rounded-[12px] p-6">
      <div className="ds-caption flex h-5 w-5 items-center justify-center rounded-full bg-gray-900 font-semibold text-gray-100">
        {index}
      </div>
      <div className="ds-title font-semibold text-gray-800">{title}</div>
      <p className="ds-text font-medium text-gray-800">{description}</p>
    </div>
  );
};

export default EvaluationCard;
