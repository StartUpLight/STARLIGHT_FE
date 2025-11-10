import type { Editor } from '@tiptap/core';
import type { Mark as PMMark, Node as PMNode } from '@tiptap/pm/model';

export type CorrectionPair = { original: string; corrected: string };

export const FIXED_COLOR_HEX = '#6f55ff';

function getMarkType(editor: Editor, name: string) {
  return editor?.state?.schema?.marks?.[name] ?? null;
}

function isTextPMNode(
  n: PMNode
): n is PMNode & { text: string; marks: PMMark[] } {
  return n.isText === true;
}

type TextRange = { from: number; to: number; text: string; marks: PMMark[] };

function collectTextRanges(editor: Editor): TextRange[] {
  const out: TextRange[] = [];
  const { state } = editor;
  state.doc.descendants((node, pos) => {
    if (!isTextPMNode(node)) return;
    const text = node.text || '';
    if (!text) return;
    out.push({
      from: pos,
      to: pos + text.length,
      text,
      marks: node.marks ?? [],
    });
  });
  return out;
}

function clearFixedColorInEditor(
  editor: Editor,
  colorHex = FIXED_COLOR_HEX
): number {
  const textStyle = getMarkType(editor, 'textStyle');
  if (!textStyle) return 0;
  const { state } = editor;
  const ranges = collectTextRanges(editor);

  let editorTransaction = state.tr;
  let touched = 0;

  for (const { from, to, text, marks } of ranges) {
    const hasFixed = marks.some(
      (m) => m.type === textStyle && m.attrs?.color === colorHex
    );
    if (!hasFixed) continue;

    const kept = marks.filter(
      (m) => !(m.type === textStyle && m.attrs?.color === colorHex)
    );
    const node = state.schema.text(text, kept);
    editorTransaction = editorTransaction.replaceWith(from, to, node);
    touched++;
  }

  if (touched > 0 && editorTransaction.docChanged)
    editor.view.dispatch(editorTransaction);
  return touched;
}

export function clearFixedCorrections(
  editors: (Editor | null | undefined)[],
  colorHex = FIXED_COLOR_HEX
): number {
  let total = 0;
  for (const ed of editors) {
    if (!ed || ed.isDestroyed) continue;
    total += clearFixedColorInEditor(ed, colorHex);
  }
  return total;
}

function replaceByPairsInEditor(
  editor: Editor,
  pairs: CorrectionPair[]
): number {
  if (!editor || editor.isDestroyed || !pairs?.length) return 0;

  const spellError = getMarkType(editor, 'spellError');
  const textStyle = getMarkType(editor, 'textStyle');
  const { state } = editor;

  const map = new Map<string, string>();
  for (const p of pairs) {
    const o = (p.original ?? '').trim();
    if (o) map.set(o, p.corrected ?? o);
  }
  if (map.size === 0) return 0;

  const ranges = collectTextRanges(editor);
  if (ranges.length === 0) return 0;

  type Edit = {
    from: number;
    to: number;
    replacement: string;
    baseMarks: PMMark[];
  };
  const edits: Edit[] = [];

  for (const { from, text, marks } of ranges) {
    for (const orig of map.keys()) {
      let start = 0;
      while (true) {
        const hit = text.indexOf(orig, start);
        if (hit === -1) break;
        edits.push({
          from: from + hit,
          to: from + hit + orig.length,
          replacement: map.get(orig)!,
          baseMarks: marks,
        });
        start = hit + orig.length;
      }
    }
  }
  if (edits.length === 0) return 0;

  let tr = state.tr;
  for (let i = edits.length - 1; i >= 0; i--) {
    const { from, to, replacement, baseMarks } = edits[i];

    if (spellError) tr = tr.removeMark(from, to, spellError);

    const kept = baseMarks.filter(
      (m) => m.type !== spellError && m.type !== textStyle
    );
    const finalMarks = textStyle
      ? [...kept, textStyle.create({ color: FIXED_COLOR_HEX })]
      : kept;

    const node = state.schema.text(replacement, finalMarks);
    tr = tr.replaceWith(from, to, node);
  }

  if (tr.docChanged) {
    editor.view.dispatch(tr);
    return edits.length;
  }
  return 0;
}

export function applyOneItemCorrection(
  editors: (Editor | null | undefined)[],
  pair: CorrectionPair
): number {
  let total = 0;
  for (const ed of editors) {
    if (!ed || ed.isDestroyed) continue;
    total += replaceByPairsInEditor(ed, [pair]);
  }
  return total;
}

export function applyAllCorrections(
  editors: (Editor | null | undefined)[],
  pairs: CorrectionPair[]
): number {
  let total = 0;
  for (const ed of editors) {
    if (!ed || ed.isDestroyed) continue;
    total += replaceByPairsInEditor(ed, pairs);
  }
  return total;
}
