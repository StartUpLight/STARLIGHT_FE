import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Placeholder from '@tiptap/extension-placeholder';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableHeader from '@tiptap/extension-table-header';
import TableCell from '@tiptap/extension-table-cell';
import SpellError from '@/util/spellError';
import {
    DeleteTableOnDelete,
    ResizableImage,
    SelectTableOnBorderClick,
    EnsureTrailingParagraph,
} from './extensions';
import { createPasteHandler } from './useEditorConfig';

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

// 에디터 설정 타입
export type EditorConfig = {
    extensions: any[];
    content: string;
    editorProps?: { handlePaste?: (view: any, event: ClipboardEvent) => boolean };
    immediatelyRender: boolean;
};

// 에디터 설정 생성 함수들
export const createEditorFeaturesConfig = (): EditorConfig => ({
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

export const createEditorSkillsConfig = (): EditorConfig => ({
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

export const createEditorGoalsConfig = (): EditorConfig => ({
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

export const createEditorItemNameConfig = (): EditorConfig => ({
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

export const createEditorOneLineIntroConfig = (): EditorConfig => ({
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

export const createEditorGeneralConfig = (): EditorConfig => ({
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

