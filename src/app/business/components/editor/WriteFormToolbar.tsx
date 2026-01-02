import { Editor, JSONContent } from '@tiptap/core';
import { useState, useRef } from 'react';
import ToolButton from './ToolButton';
import BoldIcon from '@/assets/icons/write-icons/bold.svg';
import HighlightIcon from '@/assets/icons/write-icons/highlight.svg';
import HighlightActiveIcon from '@/assets/icons/write-icons/highlight-active.svg';
import ColorIcon from '@/assets/icons/write-icons/color.svg';
import TableIcon from '@/assets/icons/write-icons/table.svg';
import ImageIcon from '@/assets/icons/write-icons/image.svg';
import Heading1Icon from '@/assets/icons/write-icons/heading1.svg';
import Heading2Icon from '@/assets/icons/write-icons/heading2.svg';
import Heading3Icon from '@/assets/icons/write-icons/heading3.svg';
import GrammerIcon from '@/assets/icons/write-icons/grammer.svg';
import GrammerActiveIcon from '@/assets/icons/write-icons/grammer-active.svg';
import TableGridSelector from './TableGridSelector';
import { useAuthStore } from '@/store/auth.store';
import { uploadImage } from '@/lib/imageUpload';
import { getImageDimensions, clampImageDimensions } from '@/lib/getImageDimensions';
import { getSelectionAvailableWidth } from '@/lib/business/editor/getSelectionAvailableWidth';
import { ImageCommandAttributes } from '@/types/business/business.type';

interface WriteFormToolbarProps {
    activeEditor: Editor | null;
    editorItemName?: Editor | null;
    editorOneLineIntro?: Editor | null;
    defaultEditor: Editor | null;
    onActiveEditorChange: (editor: Editor | null) => void;
    onSpellCheckClick: () => void;
    grammarActive: boolean;
    spellChecking: boolean;
    isSaving: boolean;
    lastSavedTime: Date | null;
}

const WriteFormToolbar = ({
    activeEditor,
    editorItemName,
    editorOneLineIntro,
    defaultEditor,
    onActiveEditorChange,
    onSpellCheckClick,
    grammarActive,
    spellChecking,
    isSaving,
    lastSavedTime,
}: WriteFormToolbarProps) => {
    // 아이템명 또는 한줄소개 에디터인지 확인
    const isSimpleEditor = activeEditor === editorItemName || activeEditor === editorOneLineIntro;
    const { isAuthenticated } = useAuthStore();
    const [showTableGrid, setShowTableGrid] = useState(false);
    const spellButtonDisabled = spellChecking || !isAuthenticated;
    const tableButtonRef = useRef<HTMLButtonElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // 이미지 업로드
    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || !activeEditor) return;

        if (!file.type.startsWith('image/')) {
            alert('이미지 파일만 업로드 가능합니다.');
            return;
        }

        try {
            const imageUrl = await uploadImage(file);
            if (!imageUrl || !activeEditor) return;

            const { width, height } = await getImageDimensions(imageUrl);
            const selectionWidth = getSelectionAvailableWidth(activeEditor);
            const editorDom = activeEditor.view.dom as HTMLElement | null;
            const maxWidth = selectionWidth ?? (editorDom ? editorDom.clientWidth - 48 : undefined);
            const { width: clampedWidth, height: clampedHeight } = clampImageDimensions(
                width,
                height,
                maxWidth
            );

            activeEditor.chain().focus().setImage({
                src: imageUrl,
                width: clampedWidth ?? undefined,
                height: clampedHeight ?? undefined,
            } as ImageCommandAttributes).run();
        } catch (error) {
            console.error('이미지 업로드 실패:', error);
            alert('이미지 업로드에 실패했습니다. 다시 시도해주세요.');
        } finally {
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleImageButtonClick = () => {
        if (!activeEditor) {
            if (defaultEditor && !defaultEditor.isDestroyed) {
                defaultEditor.commands.focus();
                onActiveEditorChange(defaultEditor);
            }
        }
        fileInputRef.current?.click();
    };

    const handleTableClick = () => {
        setShowTableGrid(!showTableGrid);
    };

    const handleHeading = (level: 1 | 2 | 3) => {
        if (!activeEditor) return;
        const { state } = activeEditor;
        const { from, to, empty } = state.selection;

        // 텍스트가 선택되어 있으면 선택 부분만 헤딩으로 변환
        if (!empty && from !== to) {
            const $from = state.selection.$from;

            // 선택한 텍스트 추출
            const selectedText = state.doc.textBetween(from, to);
            if (!selectedText.trim()) return;

            // 문단 위치 찾기
            let paragraphStart = from;
            let paragraphBeforePos = -1;

            for (let d = $from.depth; d > 0; d--) {
                const node = $from.node(d);
                if (node.type.name === 'paragraph') {
                    paragraphBeforePos = $from.before(d);
                    paragraphStart = $from.start(d);
                    break;
                }
            }

            if (paragraphBeforePos === -1) {
                activeEditor.chain().focus().toggleHeading({ level }).run();
                return;
            }

            // 선택한 범위의 콘텐츠 추출 (마크 포함)
            const selectedSlice = state.doc.slice(from, to);
            const selectedContentJSON = selectedSlice.content.toJSON();

            // 문단의 끝 위치 찾기
            const $to = state.selection.$to;
            let paragraphEnd = to;
            for (let d = $to.depth; d > 0; d--) {
                const node = $to.node(d);
                if (node.type.name === 'paragraph') {
                    paragraphEnd = $to.start(d) + node.nodeSize - 2;
                    break;
                }
            }

            // 앞뒤 콘텐츠 추출 (마크 포함)
            const beforeSlice = state.doc.slice(paragraphStart, from);
            const afterSlice = state.doc.slice(to, paragraphEnd);
            const beforeContentJSON = beforeSlice.content.toJSON();
            const afterContentJSON = afterSlice.content.toJSON();

            // 앞뒤 텍스트 확인
            const beforeText = state.doc.textBetween(paragraphStart, from);
            const afterText = state.doc.textBetween(to, paragraphEnd);

            // 새 콘텐츠 구성
            const newContent: JSONContent[] = [];

            // 앞부분 문단 (텍스트가 있을 때만)
            if (beforeText.trim()) {
                newContent.push({
                    type: 'paragraph',
                    content: Array.isArray(beforeContentJSON) && beforeContentJSON.length > 0
                        ? beforeContentJSON
                        : [{ type: 'text', text: beforeText }],
                });
            }

            // 헤딩
            newContent.push({
                type: 'heading',
                attrs: { level },
                content: Array.isArray(selectedContentJSON) && selectedContentJSON.length > 0
                    ? selectedContentJSON
                    : [{ type: 'text', text: selectedText }],
            });

            // 뒷부분 문단 (텍스트가 있을 때만)
            if (afterText.trim()) {
                newContent.push({
                    type: 'paragraph',
                    content: Array.isArray(afterContentJSON) && afterContentJSON.length > 0
                        ? afterContentJSON
                        : [{ type: 'text', text: afterText }],
                });
            }

            // 전체 문단 삭제 후 새 콘텐츠를 한 번에 삽입
            if (newContent.length > 0) {
                activeEditor
                    .chain()
                    .focus()
                    .deleteRange({ from: paragraphStart, to: paragraphEnd })
                    .insertContentAt(paragraphBeforePos, newContent)
                    .run();
            }
        } else {
            // 텍스트가 선택되지 않았으면 기본 동작
            activeEditor.chain().focus().toggleHeading({ level }).run();
        }
    };

    const handleTableSelect = (rows: number, cols: number) => {
        if (!activeEditor) return;
        const { state } = activeEditor;
        const $from = state.selection.$from;

        // 1) 표 내부에서 클릭: 현재 표 바로 뒤에 표를 추가
        let insideTableDepth = -1;
        for (let d = $from.depth; d > 0; d--) {
            if ($from.node(d).type.name === 'table') {
                insideTableDepth = d;
                break;
            }
        }
        if (insideTableDepth !== -1) {
            const start = $from.before(insideTableDepth);
            const afterTablePos =
                start + $from.node(insideTableDepth).nodeSize;
            activeEditor
                .chain()
                .focus()
                .setTextSelection(afterTablePos)
                .insertTable({ rows, cols, withHeaderRow: true })
                .run();
        } else {
            // 2) 빈 문단(예: 표 아래 한 줄)에서 클릭: 그 자리를 표로 대체
            const isEmptyParagraph =
                $from.parent.type.name === 'paragraph' &&
                $from.parent.content.size === 0;
            if (isEmptyParagraph) {
                activeEditor
                    .chain()
                    .focus()
                    .deleteRange({
                        from: state.selection.from,
                        to: state.selection.to,
                    })
                    .insertTable({ rows, cols, withHeaderRow: true })
                    .run();
            } else {
                // 3) 그 외 위치: 현재 커서 위치에 표 추가 (여러 개 삽입 가능)
                activeEditor
                    .chain()
                    .focus()
                    .insertTable({ rows, cols, withHeaderRow: true })
                    .run();
            }
        }
        // 문서 끝에 빈 문단 유지(커서는 표 첫 셀에 남음)
        const endPos = activeEditor.state.doc.content.size;
        activeEditor.commands.insertContentAt(
            endPos,
            { type: 'paragraph' },
            { updateSelection: false }
        );
    };

    return (
        <div className="flex flex-shrink-0 items-center gap-4 border-b border-gray-100 px-6 py-2">
            <ToolButton
                label={<BoldIcon />}
                active={!!activeEditor?.isActive('bold')}
                onClick={() => activeEditor?.chain().focus().toggleBold().run()}
            />
            <ToolButton
                label={
                    activeEditor?.isActive('highlight', { color: '#FFF59D' }) ? (
                        <HighlightActiveIcon />
                    ) : (
                        <HighlightIcon />
                    )
                }
                active={!!activeEditor?.isActive('highlight', { color: '#FFF59D' })}
                onClick={() =>
                    activeEditor
                        ?.chain()
                        .focus()
                        .toggleHighlight({ color: '#FFF59D' })
                        .run()
                }
            />
            <ToolButton
                label={<ColorIcon />}
                active={!!activeEditor?.isActive('textStyle', { color: '#FF3B57' })}
                onClick={() => {
                    if (!activeEditor) return;
                    const isActive = activeEditor.isActive('textStyle', {
                        color: '#FF3B57',
                    });
                    if (isActive) {
                        activeEditor.chain().focus().unsetColor().run();
                    } else {
                        activeEditor.chain().focus().setColor('#FF3B57').run();
                    }
                }}
            />
            <div className="mx-2 h-5 w-px bg-gray-200" />
            <ToolButton
                label={<Heading1Icon />}
                active={!!activeEditor?.isActive('heading', { level: 1 })}
                onClick={() => handleHeading(1)}
                disabled={isSimpleEditor}
            />
            <ToolButton
                label={<Heading2Icon />}
                active={!!activeEditor?.isActive('heading', { level: 2 })}
                onClick={() => handleHeading(2)}
                disabled={isSimpleEditor}
            />
            <ToolButton
                label={<Heading3Icon />}
                active={!!activeEditor?.isActive('heading', { level: 3 })}
                onClick={() => handleHeading(3)}
                disabled={isSimpleEditor}
            />
            <div className="mx-2 h-5 w-px bg-gray-200" />
            <div className="relative flex items-center">
                <ToolButton
                    ref={tableButtonRef}
                    label={<TableIcon />}
                    onClick={handleTableClick}
                    disabled={isSimpleEditor}
                />
                {showTableGrid && !isSimpleEditor && (
                    <TableGridSelector
                        onSelect={handleTableSelect}
                        onClose={() => setShowTableGrid(false)}
                        buttonRef={tableButtonRef}
                    />
                )}
            </div>
            <ToolButton
                label={<ImageIcon />}
                onClick={handleImageButtonClick}
                disabled={isSimpleEditor || !isAuthenticated}
            />
            <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
            />
            <button
                type="button"
                onClick={onSpellCheckClick}
                aria-pressed={grammarActive}
                disabled={spellButtonDisabled}
                className={`flex items-center gap-1 rounded-[4px] py-[2px] pr-[6px] pl-[2px] font-semibold transition-colors ${grammarActive ? 'bg-primary-50 text-primary-500' : 'text-gray-700'
                    } ${spellButtonDisabled ? 'cursor-not-allowed opacity-40' : 'cursor-pointer'} `}
            >
                {grammarActive ? <GrammerActiveIcon /> : <GrammerIcon />}
                <span className="ds-subtext">
                    {spellChecking ? '검사 중...' : '맞춤법 검사'}
                </span>
            </button>
            {isSaving ? (
                <span className="ml-auto ds-caption font-medium text-gray-600">저장 중...</span>
            ) : lastSavedTime ? (
                <span className="ml-auto ds-caption font-medium text-gray-600">
                    최근 저장 ({lastSavedTime.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false })})
                </span>
            ) : null}
        </div>
    );
};

export default WriteFormToolbar;

