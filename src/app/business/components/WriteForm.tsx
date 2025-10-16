"use client";

import { useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Image from "@tiptap/extension-image";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableHeader from "@tiptap/extension-table-header";
import TableCell from "@tiptap/extension-table-cell";

function TextInput({ placeholder }: { placeholder: string }) {
    return (
        <input
            className="w-full rounded-[10px] border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 placeholder:text-gray-500 focus:border-primary-500 focus:outline-none focus:ring-0"
            placeholder={placeholder}
        />
    );
}

function TextArea({ placeholder }: { placeholder: string }) {
    const [value, setValue] = useState("");
    return (
        <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="min-h-[160px] w-full resize-y rounded-[10px] border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 placeholder:text-gray-500 focus:border-primary-500 focus:outline-none focus:ring-0"
            placeholder={placeholder}
        />
    );
}

export default function WriteForm() {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Highlight.configure({ multicolor: true }),
            TextStyle,
            Color,
            Image.configure({ inline: false }),
            Table.configure({ resizable: true }),
            TableRow,
            TableHeader,
            TableCell,
        ],
        content: "<p></p>",
    });

    const ToolButton = ({
        onClick,
        active,
        label,
    }: { onClick: () => void; active?: boolean; label: string }) => (
        <button
            type="button"
            onClick={onClick}
            aria-pressed={active}
            className={`ds-subtext rounded px-3 py-1.5 transition-colors ${active ? "text-primary-500" : "text-gray-700 hover:text-primary-500"
                }`}
        >
            {label}
        </button>
    );

    return (
        <div className="rounded-[12px] border border-gray-100 bg-white p-5 sm:p-6">
            <div className="mb-4 flex items-center gap-3">
                <ToolButton
                    label="B"
                    active={!!editor?.isActive("bold")}
                    onClick={() => editor?.chain().focus().toggleBold().run()}
                />
                <ToolButton
                    label="형광펜"
                    active={!!editor?.isActive("highlight", { color: "#FFF59D" })}
                    onClick={() => editor?.chain().focus().toggleHighlight({ color: "#FFF59D" }).run()}
                />
                <ToolButton
                    label="A"
                    active={!!editor?.isActive("textStyle", { color: "#FF3B57" })}
                    onClick={() => {
                        if (!editor) return;
                        const isActive = editor.isActive("textStyle", { color: "#FF3B57" });
                        if (isActive) {
                            editor.chain().focus().unsetColor().run();
                        } else {
                            editor.chain().focus().setColor("#FF3B57").run();
                        }
                    }}
                />
                <div className="mx-2 h-5 w-px bg-gray-200" />
                <ToolButton label="Undo" onClick={() => editor?.chain().focus().undo().run()} />
                <ToolButton label="Redo" onClick={() => editor?.chain().focus().redo().run()} />
                <div className="mx-2 h-5 w-px bg-gray-200" />
                <ToolButton
                    label="표"
                    onClick={() =>
                        editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
                    }
                />
                <ToolButton
                    label="이미지(URL)"
                    onClick={() => {
                        const url = window.prompt("이미지 URL");
                        if (url) editor?.chain().focus().setImage({ src: url }).run();
                    }}
                />
            </div>

            <div className="space-y-5">
                <div>
                    <label className="ds-subtext mb-2 block text-gray-800">아이템명</label>
                    <TextInput placeholder="마우스" />
                </div>

                <div>
                    <label className="ds-subtext mb-2 block text-gray-800">아이템 한줄 소개</label>
                    <TextInput placeholder="미니멀하고 편한 마우스를 경험해보세요" />
                </div>

                <div>
                    <label className="ds-subtext mb-2 block text-gray-800">아이템 / 아이디어 주요 기능</label>
                    <div className="rounded-[10px] border border-gray-300 bg-gray-50 px-3 py-2">
                        <EditorContent editor={editor} className="prose max-w-none focus:outline-none" />
                    </div>
                </div>

                <div>
                    <label className="ds-subtext mb-2 block text-gray-800">관련 보유 기술</label>
                    <TextArea placeholder="아이템의 핵심기능은 무엇이며, 어떤 기능을 구현·작동 하는지 설명" />
                </div>
            </div>
        </div>
    );
}
