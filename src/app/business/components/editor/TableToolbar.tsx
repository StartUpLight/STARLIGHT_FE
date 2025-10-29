"use client";
import { BubbleMenu, Editor } from "@tiptap/react";

const TableToolbar = ({ editor }: { editor: Editor | null }) => {
    if (!editor) return null;

    const shouldShow = () => {
        const isInTable = editor.isActive("table");
        if (!isInTable) return false;

        const selection = editor.state.selection;
        return !selection.empty;
    };

    const Btn = ({
        label,
        onClick,
        disabled,
        icon = false,
    }: {
        label: string;
        onClick: () => void;
        disabled?: boolean;
        icon?: boolean;
    }) => (
        <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={onClick}
            disabled={disabled}
            className={`${icon ? 'px-1.5 py-1 text-xs font-medium' : 'px-1.5 py-0.5 text-[11px]'} whitespace-nowrap rounded transition-all duration-150 ${disabled
                ? "opacity-30 cursor-not-allowed"
                : "cursor-pointer hover:bg-primary-50 hover:text-primary-600 active:bg-primary-100"
                }`}
            title={icon ? label : undefined}
        >
            {label}
        </button>
    );

    const can = editor.can();

    return (
        <BubbleMenu
            editor={editor}
            pluginKey="table-bubble-menu"
            shouldShow={shouldShow}
            tippyOptions={{
                offset: [0, 8],
                placement: "top",
                appendTo: () => document.body
            }}
        >
            <div className="flex items-center gap-0.5 rounded-lg border border-gray-200 bg-white px-0.5 py-0.5 shadow-lg">
                {/* 행 추가 */}
                <div className="flex items-center gap-0.5 border-r border-gray-200 pr-0.5">
                    <Btn label="↑" onClick={() => editor.chain().focus().addRowBefore().run()} icon />
                    <Btn label="↓" onClick={() => editor.chain().focus().addRowAfter().run()} icon />
                </div>
                {/* 열 추가 */}
                <div className="flex items-center gap-0.5 border-r border-gray-200 px-0.5">
                    <Btn label="←" onClick={() => editor.chain().focus().addColumnBefore().run()} icon />
                    <Btn label="→" onClick={() => editor.chain().focus().addColumnAfter().run()} icon />
                </div>
                {/* 삭제 */}
                <div className="flex items-center gap-0.5 border-r border-gray-200 px-0.5">
                    <Btn
                        label="행삭제"
                        onClick={() => editor.chain().focus().deleteRow().run()}
                        disabled={!can.deleteRow?.()}
                    />
                    <Btn
                        label="열삭제"
                        onClick={() => editor.chain().focus().deleteColumn().run()}
                        disabled={!can.deleteColumn?.()}
                    />
                    <Btn label="표삭제" onClick={() => editor.chain().focus().deleteTable().run()} />
                </div>
                {/* 병합/분리 */}
                <div className="flex items-center gap-0.5 pl-0.5">
                    <Btn
                        label="병합"
                        onClick={() => editor.chain().focus().mergeCells().run()}
                        disabled={!can.mergeCells?.()}
                    />
                    <Btn
                        label="분리"
                        onClick={() => editor.chain().focus().splitCell().run()}
                        disabled={!can.splitCell?.()}
                    />
                </div>
            </div>
        </BubbleMenu>
    );
};

export default TableToolbar;