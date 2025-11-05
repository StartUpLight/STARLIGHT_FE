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

export type BlockContentItem = TextContentItem | ImageContentItem | TableContentItem;

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

