import { SpellCheckItem } from '../../store/spellcheck.store';
import type { Editor } from '@tiptap/core';

//사업계획서 subsection 요청 시 필요한 type들
export interface TextContentItem {
  type: 'text';
  value: string;
}

export interface ImageContentItem {
  type: 'image';
  src: string;
  caption?: string;
  width?: number | null;
  height?: number | null;
}

export interface TableColumnItem {
  width?: number | string | null;
}

export interface TableCellContentItem {
  content: Array<TextContentItem | ImageContentItem>;
  rowspan?: number;
  colspan?: number;
}

export interface TableContentItem {
  type: 'table';
  columns: TableColumnItem[];
  rows: TableCellContentItem[][];
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
  data: {
    message: string;
    content: BusinessPlanSubsectionRequest;
  };
  error: null;
}

export interface SubSectionDetail {
  subSectionType: SubSectionType;
  subSectionId: number;
  content: BusinessPlanSubsectionRequest;
}

export interface BusinessPlanSubsectionsResponse {
  result: 'SUCCESS';
  data: {
    businessPlanId: number;
    title: string;
    planStatus: string;
    subSectionDetailList: SubSectionDetail[];
  };
  error: null;
}
export interface BusinessPlanTitleResponse {
  result: 'SUCCESS';
  data: string;
  error: {
    code: string;
    message: string;
  } | null;
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
  data: BusinessSpellCheckProps[] | { typos?: BusinessSpellCheckProps[] };
  corrected: string;
  error: null;
}

export type SpellContent =
  | { type: 'text'; value: string }
  | TableContentItem
  | ImageContentItem;

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

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null;

const get = (v: unknown, k: string): unknown =>
  isRecord(v) && k in v ? (v as Record<string, unknown>)[k] : undefined;

const isPropsArray = (v: unknown): v is BusinessSpellCheckProps[] =>
  Array.isArray(v) &&
  v.every((p) => isRecord(p) && typeof p.original === 'string');

export function extractList(response: unknown): BusinessSpellCheckProps[] {
  const layer1 = get(response, 'data') ?? response;
  const layer2 = get(layer1, 'data') ?? layer1;

  if (isPropsArray(layer2)) return layer2;

  const typos = get(layer2, 'typos');
  if (isPropsArray(typos)) return typos;

  return [];
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

export interface AiGradeResponse {
  result: string;
  data: {
    id: number;
    businessPlanId: number;
    totalScore: number;
    problemRecognitionScore: number;
    feasibilityScore: number;
    growthStrategyScore: number;
    teamCompetenceScore: number;
    sectionScores: {
      sectionType: string;
      gradingListScores: GradingListScoreProps[];
    }[];
    strengths: { title: string; content: string }[];
    weaknesses: { title: string; content: string }[];
  };
}

export interface GradingListScoreProps {
  item: string;
  score: number;
  maxScore: number;
}

export interface PdfGradingRequest {
  title: string;
  pdfUrl: string;
}

export interface PdfGradingRequestWithFile {
  title: string;
  file: File;
}

export type ImageCommandAttributes = Parameters<Editor['commands']['setImage']>[0] & {
  width?: number;
  height?: number;
};
