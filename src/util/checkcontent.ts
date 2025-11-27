type JSONAttrValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | (number | null)[];

export interface Editor {
  type?: string;
  text?: string;
  marks?: Array<{ type: string; attrs?: Record<string, JSONAttrValue> }>;
  attrs?: Record<string, JSONAttrValue>;
  content?: Editor[];
}

export interface ItemContent {
  itemName?: string | Editor | null;
  oneLineIntro?: string | Editor | null;
  firstSection?: string;
  editorFeatures?: Editor | null;
  editorSkills?: Editor | null;
  editorGoals?: Editor | null;
  editorContent?: Editor | null;
  checks?: boolean[];
}

function hasContent(node: Editor | null | undefined): boolean {
  if (!node) return false;

  if (node.type === 'text') {
    return typeof node.text === 'string' && node.text.trim().length > 0;
  }

  const contentNodes = ['text', 'image', 'table'];

  if (node.type && contentNodes.includes(node.type)) return true;

  return Array.isArray(node.content) && node.content.some(hasContent);
}

const sectionCheckers: Record<string, (content: ItemContent) => boolean> = {
  OVERVIEW_BASIC: (content) => {
    // itemName과 oneLineIntro가 문자열인지 JSONContent인지 확인
    const hasItemName = typeof content.itemName === 'string'
      ? content.itemName.trim().length > 0
      : hasContent(content.itemName as Editor | null);
    const hasOneLineIntro = typeof content.oneLineIntro === 'string'
      ? content.oneLineIntro.trim().length > 0
      : hasContent(content.oneLineIntro as Editor | null);
    const hasFirstSection = typeof content.firstSection === 'string' && content.firstSection.trim().length > 0;
    const hasEditor =
      hasContent(content.editorFeatures) ||
      hasContent(content.editorSkills) ||
      hasContent(content.editorGoals);
    return !!(hasItemName || hasOneLineIntro || hasFirstSection || hasEditor);
  },
  default: (content) => hasContent(content.editorContent),
};

export function isSectionCompleted(
  getItemContent: (n: string) => ItemContent,
  number: string
): boolean {
  const content = getItemContent(number);
  if (!content) return false;

  const checker =
    number === '0' ? sectionCheckers.OVERVIEW_BASIC : sectionCheckers.default;

  return checker(content);
}
