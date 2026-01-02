import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Placeholder from '@tiptap/extension-placeholder';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableHeader from '@tiptap/extension-table-header';
import TableCell from '@tiptap/extension-table-cell';
import type { Editor } from '@tiptap/core';
import type { EditorView } from '@tiptap/pm/view';
import SpellError from '@/util/spellError';
import {
    DeleteTableOnDelete,
    ResizableImage,
    SelectTableOnBorderClick,
    EnsureTrailingParagraph,
} from './extensions';
import { uploadImage } from '@/lib/imageUpload';
import { getImageDimensions, clampImageDimensions } from '@/lib/getImageDimensions';
import { ImageCommandAttributes } from '@/types/business/business.type';
import { getSelectionAvailableWidth } from './getSelectionAvailableWidth';

// 공통 에디터 확장 (표, 이미지, 하이라이트 등 모든 기능 포함)
export const COMMON_EXTENSIONS = [
    StarterKit,
    SpellError,
    DeleteTableOnDelete,
    Highlight.configure({ multicolor: true }),
    TextStyle,
    Color,
    ResizableImage.configure({ inline: false }),
    Table.configure({ resizable: true }),
    TableRow,
    TableHeader,
    TableCell,
    SelectTableOnBorderClick,
    EnsureTrailingParagraph,
];

// 간단한 에디터 확장 (하이라이트, 볼드, 색상만 가능, 헤딩/표/이미지 비활성화)
export const SIMPLE_EXTENSIONS = [
    StarterKit.configure({
        heading: false,
        blockquote: false,
        codeBlock: false,
        horizontalRule: false,
        hardBreak: false,
    }),
    SpellError,
    Highlight.configure({ multicolor: true }),
    TextStyle,
    Color,
];

// 이미지 붙여넣기 핸들러 생성
const createPasteHandler = () => {
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
                            const editor = (view as EditorView & { editor?: Editor }).editor;
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

// 에디터 설정 생성 함수들
export const createEditorFeaturesConfig = () => ({
    extensions: [
        ...COMMON_EXTENSIONS,
        Placeholder.configure({
            placeholder: '아이템의 핵심기능은 무엇이며, 어떤 기능을 구현·작동 하는지 설명해주세요.',
            includeChildren: false,
            showOnlyWhenEditable: true,
        }),
    ],
    content: '<p></p>',
    editorProps: { handlePaste: createPasteHandler() },
    immediatelyRender: false,
});

export const createEditorSkillsConfig = () => ({
    extensions: [
        ...COMMON_EXTENSIONS,
        Placeholder.configure({
            placeholder: '보유한 기술 및 지식재산권이 별도로 없을 경우, 아이템에 필요한 핵심기술을 어떻게 개발해 나갈것인지 계획에 대해 작성해주세요. \n ※ 지식재산권: 특허, 상표권, 디자인, 실용신안권 등.',
            includeChildren: false,
            showOnlyWhenEditable: true,
        }),
    ],
    content: '<p></p>',
    editorProps: { handlePaste: createPasteHandler() },
    immediatelyRender: false,
});

export const createEditorGoalsConfig = () => ({
    extensions: [
        ...COMMON_EXTENSIONS,
        Placeholder.configure({
            placeholder: '본 사업을 통해 달성하고 싶은 궁극적인 목표에 대해 설명',
            includeChildren: false,
            showOnlyWhenEditable: true,
        }),
    ],
    content: '<p></p>',
    editorProps: { handlePaste: createPasteHandler() },
    immediatelyRender: false,
});

export const createEditorItemNameConfig = () => ({
    extensions: [
        ...SIMPLE_EXTENSIONS,
        Placeholder.configure({
            placeholder: '답변을 입력하세요.',
            includeChildren: false,
            showOnlyWhenEditable: true,
        }),
    ],
    content: '<p></p>',
    immediatelyRender: false,
});

export const createEditorOneLineIntroConfig = () => ({
    extensions: [
        ...SIMPLE_EXTENSIONS,
        Placeholder.configure({
            placeholder: '답변을 입력하세요.',
            includeChildren: false,
            showOnlyWhenEditable: true,
        }),
    ],
    content: '<p></p>',
    immediatelyRender: false,
});

export const createEditorGeneralConfig = () => ({
    extensions: [
        ...COMMON_EXTENSIONS,
        Placeholder.configure({
            placeholder: '세부 항목별 체크리스트를 참고하며 작성해주시면, 리포트 점수가 올라갑니다.',
            includeChildren: false,
            showOnlyWhenEditable: true,
        }),
    ],
    content: '<p></p>',
    editorProps: { handlePaste: createPasteHandler() },
    immediatelyRender: false,
});

