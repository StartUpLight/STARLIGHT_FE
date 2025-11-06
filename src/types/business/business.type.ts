import { SpellCheckItem } from '../../store/spellcheck.store';

//사업계획서 subsection 요청 시 필요한 type들
export interface TextContentItem {
  type: 'text';
  value: string;
}

export interface ImageContentItem {
  type: 'image';
  src: string;
  caption?: string;
}

export interface TableContentItem {
  type: 'table';
  columns: string[];
  rows: string[][];
}

export type BlockContentItem =
  | TextContentItem
  | ImageContentItem
  | TableContentItem;

export interface BlockMeta {
  title: string;
}

export interface Block {
  meta: BlockMeta;
  content: BlockContentItem[];
}

export interface BusinessPlanSubsectionRequestMeta {
  author: string;
  createdAt: string;
}

export interface BusinessPlanSubsectionRequest {
  subSectionType: string;
  checks?: boolean[];
  meta: BusinessPlanSubsectionRequestMeta;
  blocks: Block[];
}

//사업계획서 생성 응답 type
export interface BusinessPlanCreateResponse {
  result: 'SUCCESS';
  data: {
    businessPlanId: number;
    title: string | null;
    planStatus: string;
  };
  error: null;
}

export type SubSectionType =
  | 'OVERVIEW_BASIC'
  | 'PROBLEM_BACKGROUND'
  | 'PROBLEM_PURPOSE'
  | 'PROBLEM_MARKET'
  | 'FEASIBILITY_STRATEGY'
  | 'FEASIBILITY_MARKET'
  | 'GROWTH_MODEL'
  | 'GROWTH_FUNDING'
  | 'GROWTH_ENTRY'
  | 'TEAM_FOUNDER'
  | 'TEAM_MEMBERS';

export interface BusinessPlanSubsectionResponse {
  result: 'SUCCESS';
  data: BusinessPlanSubsectionRequest;
  error: null;
}

export interface BusinessSpellCheckProps {
  type: string;
  severity: string;
  token: string;
  suggestions: string[];
  visible: string;
  original: string;
  context: string;
  help: string;
  examples: string[];
}

export interface BusinessSpellCheckResponse {
  result: string;
  data: BusinessSpellCheckProps[];
  corrected: string;
  error: null;
}

export type SpellContent =
  | { type: 'text'; value: string }
  | {
      type: 'table';
      columns: string[];
      rows: (string | number | null)[][];
    }
  | { type: 'image'; src: string; caption?: string };

export interface BusinessSpellCheckRequest {
  subSectionType: string;
  checks: boolean[];
  meta: {
    author: string;
    createdAt: string;
  };
  blocks: Array<{
    meta?: { title?: string };
    content: SpellContent[];
  }>;
}

function extractList(
  res: BusinessSpellCheckResponse
): BusinessSpellCheckProps[] {
  if (!res || !res.data) return [];
  if (Array.isArray(res.data)) return res.data;
  const anyData = res.data as any;
  return Array.isArray(anyData.typos) ? anyData.typos : [];
}

export function mapSpellResponse(
  res: BusinessSpellCheckResponse
): SpellCheckItem[] {
  const list = extractList(res);
  return list.map((d, i) => ({
    id: i,
    original: d.original ?? '',
    corrected: d.suggestions?.[0] ?? d.visible ?? d.original ?? '',
    open: false,
    severity: d.severity,
    context: d.context,
    help: d.help,
    suggestions: d.suggestions ?? [],
  }));
}
