import type { Editor } from '@tiptap/react';
import type { SpellCheckItem } from '@/store/spellcheck.store';

export function clearSpellErrors(editor: Editor) {
  if (!editor || editor.isDestroyed) return;
  const { state } = editor;
  const type = state.schema.marks['spellError'];
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
  const type = state.schema.marks['spellError'];
  if (!type) return;

  let tr = state.tr;
  state.doc.descendants((node, pos) => {
    if (!node.isText) return;
    const text = node.text ?? '';
    items.forEach((it) => {
      const needle = (it.original ?? '').trim();
      if (!needle) return;

      let fromIdx = 0;
      while (true) {
        const idx = text.indexOf(needle, fromIdx);
        if (idx === -1) break;
        const from = pos + idx;
        const to = from + needle.length;
        tr = tr.addMark(from, to, type.create());
        fromIdx = idx + needle.length;
      }
    });
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
