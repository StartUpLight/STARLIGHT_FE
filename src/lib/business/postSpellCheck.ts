import type { ImageContentItem, TableContentItem } from '@/types/business/business.type';

export type SpellContent =
  | { type: 'text'; value: string }
  | TableContentItem
  | ImageContentItem;

export interface BusinessSpellCheckRequest {
  subSectionType: string;
  checks: boolean[];
  meta: { author: string; createdAt: string };
  blocks: Array<{ meta?: { title?: string }; content: SpellContent[] }>;
}

export type SimpleEditor = {
  getText: () => string;
  isDestroyed?: boolean;
} | null;

export const DEFAULT_CHECKS = [true, true, true, false, false] as const;

export const todayISO = () => new Date().toISOString().slice(0, 10);

export const getEditorText = (ed: SimpleEditor) =>
  ed && !ed.isDestroyed ? ed.getText().trim() : '';

export const makeTextBlock = (title: string, text: string) => ({
  meta: { title },
  content: text ? [{ type: 'text', value: text } as SpellContent] : [],
});

export interface BuildSpellPayloadArgs {
  number: string;
  title?: string;
  itemName?: string;
  oneLineIntro?: string;
  editorFeatures: SimpleEditor;
  editorSkills?: SimpleEditor;
  editorGoals?: SimpleEditor;
  subSectionType?: string;
  checks?: boolean[];
  createdAtOverride?: string;
}

export function SpellPayload({
  number,
  title = '',
  itemName = '',
  oneLineIntro = '',
  editorFeatures,
  editorSkills = null,
  editorGoals = null,
  subSectionType = 'OVERVIEW_BASIC',
  checks = [...DEFAULT_CHECKS],
  createdAtOverride,
}: BuildSpellPayloadArgs): BusinessSpellCheckRequest {
  const createdAt = createdAtOverride ?? todayISO();
  const author = '이호근';

  if (number === '0') {
    const featuresText = getEditorText(editorFeatures);
    const skillsText = getEditorText(editorSkills);
    const goalsText = getEditorText(editorGoals);

    const basicInfo = [
      itemName ? `아이템명: ${itemName}` : '',
      oneLineIntro ? `한 줄 소개: ${oneLineIntro}` : '',
    ]
      .filter(Boolean)
      .join('\n');

    const blocks = [
      basicInfo ? makeTextBlock('기본 정보', basicInfo) : null,
      makeTextBlock('아이템 / 아이디어 주요 기능', featuresText),
      makeTextBlock('관련 보유 기술', skillsText),
      makeTextBlock('창업 목표', goalsText),
    ].filter((b): b is NonNullable<typeof b> => !!b && b.content.length > 0);

    return { subSectionType, checks, meta: { author, createdAt }, blocks };
  }

  const sectionText = getEditorText(editorFeatures);
  const blocks = [makeTextBlock(title || `섹션 ${number}`, sectionText)].filter(
    (b) => b.content.length > 0
  );

  return { subSectionType, checks, meta: { author, createdAt }, blocks };
}
