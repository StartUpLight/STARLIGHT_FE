import { Editor } from '@tiptap/core';

const MIN_WIDTH = 50;
const EDITOR_PADDING_FALLBACK = 48;

const getComputedPadding = (element: HTMLElement) => {
    const computed = window.getComputedStyle(element);
    const paddingLeft = parseFloat(computed.paddingLeft || '0');
    const paddingRight = parseFloat(computed.paddingRight || '0');
    return { paddingLeft, paddingRight };
};

const measureCellWidth = (cell: HTMLElement | null) => {
    if (!cell) return null;
    const { paddingLeft, paddingRight } = getComputedPadding(cell);
    const available = cell.clientWidth - paddingLeft - paddingRight - 8;
    if (Number.isNaN(available)) return null;
    return Math.max(MIN_WIDTH, available);
};

const findCellFromResolvedPos = (editor: Editor, pos: number) => {
    const { state, view } = editor;
    const resolved = state.doc.resolve(pos);
    for (let depth = resolved.depth; depth >= 0; depth -= 1) {
        const node = resolved.node(depth);
        if (node.type.name === 'tableCell' || node.type.name === 'tableHeader') {
            const dom = view.nodeDOM(resolved.before(depth + 1));
            if (dom instanceof HTMLElement) {
                return dom;
            }
        }
    }
    return null;
};

export const getSelectionAvailableWidth = (editor: Editor | null): number | null => {
    if (!editor || editor.isDestroyed) return null;
    const view = editor.view;
    const doc = view.dom.ownerDocument;
    const selection = doc?.getSelection();
    let cell: HTMLElement | null = null;

    if (selection && selection.anchorNode) {
        const anchor =
            selection.anchorNode.nodeType === Node.TEXT_NODE
                ? selection.anchorNode.parentElement
                : (selection.anchorNode as HTMLElement | null);
        if (anchor) {
            cell = anchor.closest('td, th');
        }
    }

    if (!cell) {
        const { from } = editor.state.selection;
        cell = findCellFromResolvedPos(editor, from);
    }

    const cellWidth = measureCellWidth(cell);
    if (cellWidth) return cellWidth;

    const editorElement = view.dom as HTMLElement;
    if (editorElement) {
        const { paddingLeft, paddingRight } = getComputedPadding(editorElement);
        const available = editorElement.clientWidth - paddingLeft - paddingRight - EDITOR_PADDING_FALLBACK;
        if (!Number.isNaN(available)) {
            return Math.max(MIN_WIDTH, available);
        }
    }

    return null;
};


