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
type Content =
  | { type: 'image'; src: string; caption?: string; width?: number | null; height?: number | null }
  | { type: 'table'; columns: string[]; rows: string[][] }
  | { type: 'text'; value: string };

type Block = {
  meta: { title: string };
  content: Content[];
};

export type CheckListRequest = {
  subSectionType: string;
  checks: boolean[];
  meta: { author: string; createdAt: string };
  blocks: Block[];
};
