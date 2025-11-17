import { Editor } from '@tiptap/core';
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

interface WriteFormToolbarProps {
    activeEditor: Editor | null;
    onImageClick: () => void;
    onSpellCheckClick: () => void;
    grammarActive: boolean;
    spellChecking: boolean;
    isSaving: boolean;
    lastSavedTime: Date | null;
}

const WriteFormToolbar = ({
    activeEditor,
    onImageClick,
    onSpellCheckClick,
    grammarActive,
    spellChecking,
    isSaving,
    lastSavedTime,
}: WriteFormToolbarProps) => {
    const [showTableGrid, setShowTableGrid] = useState(false);
    const tableButtonRef = useRef<HTMLButtonElement>(null);

    const handleTableClick = () => {
        setShowTableGrid(!showTableGrid);
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
                onClick={() => activeEditor?.chain().focus().toggleHeading({ level: 1 }).run()}
            />
            <ToolButton
                label={<Heading2Icon />}
                active={!!activeEditor?.isActive('heading', { level: 2 })}
                onClick={() => activeEditor?.chain().focus().toggleHeading({ level: 2 }).run()}
            />
            <ToolButton
                label={<Heading3Icon />}
                active={!!activeEditor?.isActive('heading', { level: 3 })}
                onClick={() => activeEditor?.chain().focus().toggleHeading({ level: 3 }).run()}
            />
            <div className="mx-2 h-5 w-px bg-gray-200" />
            <div className="relative flex items-center">
                <ToolButton
                    ref={tableButtonRef}
                    label={<TableIcon />}
                    onClick={handleTableClick}
                />
                {showTableGrid && (
                    <TableGridSelector
                        onSelect={handleTableSelect}
                        onClose={() => setShowTableGrid(false)}
                        buttonRef={tableButtonRef}
                    />
                )}
            </div>
            <ToolButton label={<ImageIcon />} onClick={onImageClick} />
            <button
                type="button"
                onClick={onSpellCheckClick}
                aria-pressed={grammarActive}
                disabled={spellChecking}
                className={`flex cursor-pointer items-center gap-1 rounded-[4px] py-[2px] pr-[6px] pl-[2px] font-semibold transition-colors ${grammarActive ? 'bg-primary-50 text-primary-500' : 'text-gray-700'} ${spellChecking ? 'cursor-not-allowed opacity-60' : ''} `}
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

