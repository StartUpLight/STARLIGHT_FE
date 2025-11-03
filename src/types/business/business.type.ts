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
    meta: BusinessPlanSubsectionRequestMeta;
    blocks: Block[];
}


