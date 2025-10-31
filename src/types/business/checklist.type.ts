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
