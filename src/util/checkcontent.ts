type JSONAttrValue = string | number | boolean | null | undefined;

export interface Editor {
  type?: string;
  text?: string;
  marks?: Array<{ type: string; attrs?: Record<string, JSONAttrValue> }>;
  attrs?: Record<string, JSONAttrValue>;
  content?: Editor[];
}

export interface ItemContent {
  itemName?: string;
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
    const hasText = content.itemName?.trim() || content.firstSection?.trim();
    const hasEditor =
      hasContent(content.editorFeatures) ||
      hasContent(content.editorSkills) ||
      hasContent(content.editorGoals);
    return !!(hasText || hasEditor);
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
