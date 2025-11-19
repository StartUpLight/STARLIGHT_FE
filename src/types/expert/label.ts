export const TAB_LABELS = [
  '지표/데이터',
  '시장성/BM',
  '팀 역량',
  '문제 정의',
  '성장 전략',
] as const;

export type TabLabel = (typeof TAB_LABELS)[number];

export const CODE_TO_KO: Record<string, TabLabel> = {
  MARKET_BM: '시장성/BM',
  TEAM_CAPABILITY: '팀 역량',
  PROBLEM_DEFINITION: '문제 정의',
  GROWTH_STRATEGY: '성장 전략',
  METRIC_DATA: '지표/데이터',
};

export const mappingKorea = (code: string): TabLabel | undefined =>
  CODE_TO_KO[code];
