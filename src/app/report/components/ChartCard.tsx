'use client';

import React, { useMemo } from 'react';
import {
  Radar,
  RadarChart,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';
import { useBusinessStore } from '@/store/business.store';
import { useGetGrade } from '@/hooks/queries/useBusiness';

const ChartCard = () => {
  const cx = 250;
  const cy = 155;
  const outerRadius = 100;
  const rings = [
    { radius: 25, isDashed: true, color: '#DADFE7', bgColor: '#F3F5F9' },
    { radius: 50, isDashed: false, color: '#DADFE7', bgColor: '#FBFCFD' },
    { radius: 75, isDashed: true, color: '#DADFE7', bgColor: '#F3F5F9' },
    { radius: 100, isDashed: false, color: '#EBEEF3', bgColor: '#FBFCFD' },
  ] as const;
  const labelDistances = [20, 40, 30, 60] as const;

  const planId = useBusinessStore((s) => s.planId);
  const { data, isLoading, isError } = useGetGrade((planId ?? 0) as number);

  const radarData = useMemo(() => {
    const d = data?.data;

    const raw = [
      {
        subject: '문제 정의',
        score: d?.problemRecognitionScore ?? 0,
        fullMark: 20,
      },
      {
        subject: '실현 가능성',
        score: d?.feasibilityScore ?? 0,
        fullMark: 30,
      },
      {
        subject: '성장 전략',
        score: d?.growthStrategyScore ?? 0,
        fullMark: 30,
      },
      {
        subject: '팀 역량',
        score: d?.teamCompetenceScore ?? 0,
        fullMark: 20,
      },
    ];

    return raw.map((item) => ({
      ...item,
      ratio: item.fullMark > 0 ? item.score / item.fullMark : 0,
    }));
  }, [data]);

  if (!planId) {
    return (
      <div className="flex h-[359px] min-w-[540px] items-center justify-center rounded-xl border border-gray-300 bg-white p-6">
        <p className="ds-text text-gray-700">
          계획서를 저장/채점한 후 확인할 수 있어요.
        </p>
      </div>
    );
  }
  if (isLoading) {
    return (
      <div className="flex h-[359px] min-w-[540px] items-center justify-center rounded-xl border border-gray-300 bg-white p-6">
        <p className="ds-text text-gray-700">차트 불러오는 중입니다.</p>
      </div>
    );
  }
  if (isError) {
    return (
      <div className="flex h-[359px] min-w-[540px] items-center justify-center rounded-xl border border-gray-300 bg-white p-6">
        <p className="ds-text text-warning-400">차트를 불러올 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="flex h-[359px] min-w-[540px] flex-col items-center justify-center rounded-xl border border-gray-300 bg-white p-6">
      <div className="relative h-full w-full">
        <svg
          width="500"
          height="310"
          style={{
            position: 'absolute',
            top: 0,
            left: '51%',
            transform: 'translateX(-50%)',
          }}
        >
          {[...rings].reverse().map((ring, i) => (
            <circle
              key={`bg-${i}`}
              cx={cx}
              cy={cy}
              r={ring.radius}
              fill={ring.bgColor}
              stroke="none"
            />
          ))}
          {rings.map((ring, i) => (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={ring.radius}
              fill="none"
              stroke={ring.color}
              strokeWidth={1.6}
              strokeDasharray={ring.isDashed ? '4 4' : '0'}
            />
          ))}
          <line
            x1={cx}
            y1={cy - outerRadius}
            x2={cx}
            y2={cy + outerRadius}
            stroke="#EBEEF3"
            strokeWidth={1.6}
          />
          <line
            x1={cx - outerRadius}
            y1={cy}
            x2={cx + outerRadius}
            y2={cy}
            stroke="#EBEEF3"
            strokeWidth={1.6}
          />
        </svg>

        <ResponsiveContainer width="100%" height="100%">
          <RadarChart
            cx={cx}
            cy={cy}
            outerRadius={outerRadius}
            data={radarData}
          >
            <PolarAngleAxis
              dataKey="subject"
              tick={(props) => {
                const { payload, index } = props;
                const angle = (90 - index * 90) * (Math.PI / 180);
                const distance =
                  outerRadius + labelDistances[index as 0 | 1 | 2 | 3];
                const newX = cx + distance * Math.cos(angle);
                const newY = cy - distance * Math.sin(angle);

                return (
                  <text
                    x={newX}
                    y={newY}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="#191F28"
                    fontSize={14}
                    fontWeight={500}
                  >
                    {payload.value}
                  </text>
                );
              }}
              tickLine={false}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 1]}
              tick={false}
              axisLine={false}
            />
            <Radar
              name="점수"
              dataKey="ratio"
              stroke="#6F55FF"
              fill="rgba(111, 85, 255, 0.20)"
              fillOpacity={0.8}
              strokeWidth={1.2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChartCard;
