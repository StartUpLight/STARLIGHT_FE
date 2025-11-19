import type { Editor } from '@tiptap/core';

export type ImageCommandAttributes = Parameters<Editor['commands']['setImage']>[0] & {
    width?: number;
    height?: number;
};

