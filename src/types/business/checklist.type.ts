export type ChecklistProps = {
  title: string;
  content: string;
  checked?: boolean;
};

export type SectionItem = {
  name: string;
  number: string;
  title: string;
  subtitle: string;
  checklist?: ChecklistProps[];
};
export type Section = { title: string; items: SectionItem[] };

///
import { TableContentItem, ImageContentItem, TextContentItem } from './business.type';

type Content = TextContentItem | ImageContentItem | TableContentItem;

type Block = {
  meta: { title: string };
  content: Content[];
};

export type CheckListResponse = {
  subSectionType: string;
  checks: boolean[];
  meta: { author: string; createdAt: string };
  blocks: Block[];
};
