import type { Editor } from '@tiptap/react';
import type { SpellCheckItem } from '@/store/spellcheck.store';
import { FIXED_COLOR_HEX } from './spellReplace';

function getMarkType(editor: Editor, name: string) {
  return editor?.state?.schema?.marks?.[name] ?? null;
}

export function clearSpellErrors(editor: Editor) {
  if (!editor || editor.isDestroyed) return;
  const { state } = editor;
  const type = getMarkType(editor, 'spellError');
  if (!type) return;

  let tr = state.tr;
  state.doc.descendants((node, pos) => {
    if (!node.isText) return;
    if (node.marks.some((m) => m.type === type)) {
      tr = tr.removeMark(pos, pos + (node.text?.length ?? 0), type);
    }
  });
  if (tr.docChanged) editor.view.dispatch(tr);
}

export function markSpellErrors(editor: Editor, items: SpellCheckItem[]) {
  if (!editor || editor.isDestroyed || !items?.length) return;

  const { state } = editor;
  const spellErr = getMarkType(editor, 'spellError');
  const textStyle = getMarkType(editor, 'textStyle');
  if (!spellErr) return;

  const needles = Array.from(
    new Set(
      items.map((it) => (it.original ?? '').trim()).filter((s) => s.length > 0)
    )
  );
  if (needles.length === 0) return;

  let tr = state.tr;

  state.doc.descendants((node, pos) => {
    if (!node.isText) return;

    if (
      textStyle &&
      node.marks.some(
        (m) =>
          m.type === textStyle && (m.attrs?.color as string) === FIXED_COLOR_HEX
      )
    ) {
      return;
    }

    const text = node.text ?? '';
    if (!text) return;

    for (const needle of needles) {
      let fromIdx = 0;
      while (true) {
        const idx = text.indexOf(needle, fromIdx);
        if (idx === -1) break;
        const from = pos + idx;
        const to = from + needle.length;
        tr = tr.addMark(from, to, spellErr.create());
        fromIdx = idx + needle.length;
      }
    }
  });

  if (tr.docChanged) editor.view.dispatch(tr);
}

export function applySpellHighlights(
  editors: (Editor | null | undefined)[],
  items: SpellCheckItem[]
) {
  editors.forEach((ed) => {
    if (!ed || ed.isDestroyed) return;
    clearSpellErrors(ed);
    markSpellErrors(ed, items);
  });
}
