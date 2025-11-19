'use client';
import React from 'react';
import StrengthIcon from '@/assets/icons/strength_graph.svg';
import WeaknessIcon from '@/assets/icons/weak_graph.svg';

type EvalType = 'strength' | 'weakness';

interface EvaluationCardProps {
  title: string;
  description: string;
  type: EvalType;
}

const EvaluationCard = ({ title, description, type }: EvaluationCardProps) => {
  const isStrength = type === 'strength';

  return (
    <div className="bg-gray-80 flex flex-col gap-5 rounded-[12px] p-6">
      <div className="h-8 w-8">
        {isStrength ? <StrengthIcon /> : <WeaknessIcon />}
      </div>

      <div
        className={`ds-title font-semibold ${
          isStrength ? 'text-primary-500' : 'text-warning-400'
        }`}
      >
        {title}
      </div>

      <p className="ds-text font-medium text-gray-800">{description}</p>
    </div>
  );
};

export default EvaluationCard;
