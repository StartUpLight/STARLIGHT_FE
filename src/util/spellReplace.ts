import type { Editor } from '@tiptap/core';

export type CorrectionPair = { original: string; corrected: string };

function getSpellMark(editor: Editor) {
  return editor?.state?.schema?.marks?.['spellError'] ?? null;
}

function collectTextRanges(
  editor: Editor
): Array<{ from: number; to: number; text: string }> {
  const out: Array<{ from: number; to: number; text: string }> = [];
  const { state } = editor;
  state.doc.descendants((node, pos) => {
    if (!node.isText) return;
    const text = node.text ?? '';
    if (text) out.push({ from: pos, to: pos + text.length, text });
  });
  return out;
}

function replaceByPairsInEditor(
  editor: Editor,
  pairs: CorrectionPair[]
): number {
  if (!editor || editor.isDestroyed || !pairs?.length) return 0;

  const markType = getSpellMark(editor);
  const { state } = editor;

  const map = new Map<string, string>();
  pairs.forEach((p) => {
    const o = (p.original ?? '').trim();
    if (o) map.set(o, p.corrected ?? o);
  });
  if (map.size === 0) return 0;

  const ranges = collectTextRanges(editor);
  if (ranges.length === 0) return 0;

  const edits: Array<{ from: number; to: number; replacement: string }> = [];
  ranges.forEach(({ from, text }) => {
    const keys = Array.from(map.keys());
    keys.forEach((orig) => {
      let start = 0;
      while (true) {
        const hit = text.indexOf(orig, start);
        if (hit === -1) break;
        edits.push({
          from: from + hit,
          to: from + hit + orig.length,
          replacement: map.get(orig)!,
        });
        start = hit + orig.length;
      }
    });
  });

  if (edits.length === 0) return 0;

  let tr = state.tr;
  for (let i = edits.length - 1; i >= 0; i--) {
    const { from, to, replacement } = edits[i];
    if (markType) tr = tr.removeMark(from, to, markType);
    tr = tr.insertText(replacement, from, to);
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
  editors.forEach((ed) => {
    if (!ed || ed.isDestroyed) return;
    total += replaceByPairsInEditor(ed, [pair]);
  });
  return total;
}

export function applyAllCorrections(
  editors: (Editor | null | undefined)[],
  pairs: CorrectionPair[]
): number {
  let total = 0;
  editors.forEach((ed) => {
    if (!ed || ed.isDestroyed) return;
    total += replaceByPairsInEditor(ed, pairs);
  });
  return total;
}
