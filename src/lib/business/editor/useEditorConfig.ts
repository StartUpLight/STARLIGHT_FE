import type { Editor } from '@tiptap/core';
import type { EditorView } from '@tiptap/pm/view';
import { uploadImage } from '@/lib/imageUpload';
import { getImageDimensions, clampImageDimensions } from '@/lib/getImageDimensions';
import { ImageCommandAttributes } from '@/lib/business/editor/types';
import { getSelectionAvailableWidth } from './getSelectionAvailableWidth';

type EditorViewWithEditor = EditorView & { editor?: Editor };

export const createPasteHandler = () => {
    return (view: EditorView, event: ClipboardEvent) => {
        const items = Array.from(event.clipboardData?.items || []);
        const imageItem = items.find(
            (item) => item.type.indexOf('image') !== -1
        );

        if (imageItem) {
            event.preventDefault();
            const file = imageItem.getAsFile();
            if (file) {
                // 파일 크기 제한 (5MB)
                // const maxSize = 5 * 1024 * 1024;
                // if (file.size > maxSize) {
                //     alert('이미지 크기는 5MB 이하여야 합니다.');
                //     return true;
                // }

                // 비동기로 업로드 처리
                uploadImage(file)
                    .then(async (imageUrl) => {
                        if (imageUrl) {
                            const editor = (view as EditorViewWithEditor).editor;
                            const { width, height } = await getImageDimensions(imageUrl);
                            const selectionWidth = getSelectionAvailableWidth(editor ?? null);
                            const fallbackWidth = view.dom?.clientWidth ? view.dom.clientWidth - 48 : undefined;
                            const maxWidth = selectionWidth ?? fallbackWidth;
                            const { width: clampedWidth, height: clampedHeight } = clampImageDimensions(width, height, maxWidth ?? undefined);
                            const imageAttributes: ImageCommandAttributes = {
                                src: imageUrl,
                                width: clampedWidth ?? undefined,
                                height: clampedHeight ?? undefined,
                            };
                            editor
                                ?.chain()
                                .focus()
                                .setImage(imageAttributes)
                                .run();
                        }
                    })
                    .catch((error) => {
                        console.error('이미지 업로드 실패:', error);
                        alert('이미지 업로드에 실패했습니다. 다시 시도해주세요.');
                    });
                return true;
            }
        }
        return false;
    };
};

