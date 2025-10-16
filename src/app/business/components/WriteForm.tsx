"use client";
import { useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableHeader from "@tiptap/extension-table-header";
import TableCell from "@tiptap/extension-table-cell";
import { Extension } from "@tiptap/core";
import TextInput from "./TextInput";
import ToolButton from "./ToolButton";

const DeleteTableOnDelete = Extension.create({
    name: "delete-table-on-delete",
    addKeyboardShortcuts() {
        return {
            Delete: ({ editor }) => {
                if (editor.isActive("table")) {
                    return editor.commands.deleteTable();
                }
                return false;
            },
        };
    },
});

export default function WriteForm({
    number = '0',
    title = "개요",
    subtitle = "구성원의 담당업무, 사업화와 관련하여 보유한 전문성(기술력, 노하우) 위주로 작성.",
}: { number?: string; title?: string; subtitle?: string }) {
    const editorFeatures = useEditor({
        extensions: [
            StarterKit,
            DeleteTableOnDelete,
            Highlight.configure({ multicolor: true }),
            TextStyle,
            Color,
            Image.configure({ inline: false }),
            Table.configure({ resizable: true }),
            TableRow,
            TableHeader,
            TableCell,
            Placeholder.configure({
                placeholder:
                    "아이템의 핵심기능은 무엇이며, 어떤 기능을 구현·작동 하는지 설명해주세요.",
                includeChildren: false,
                showOnlyWhenEditable: true,
            }),
        ],
        content: "<p></p>",
    });
    const editorSkills = useEditor({
        extensions: [
            StarterKit,
            DeleteTableOnDelete,
            Highlight.configure({ multicolor: true }),
            TextStyle,
            Color,
            Image.configure({ inline: false }),
            Table.configure({ resizable: true }),
            TableRow,
            TableHeader,
            TableCell,
            Placeholder.configure({
                placeholder:
                    "보유한 기술 및 지식재산권이 별도로 없을 경우, 아이템에 필요한 핵심기술을 어떻게 개발해 나갈것인지 계획에 대해 작성해주세요. \n ※ 지식재산권: 특허, 상표권, 디자인, 실용신안권 등.",
                includeChildren: false,
                showOnlyWhenEditable: true,
            }),
        ],
        content: "<p></p>",
    });
    const editorGoals = useEditor({
        extensions: [
            StarterKit,
            DeleteTableOnDelete,
            Highlight.configure({ multicolor: true }),
            TextStyle,
            Color,
            Image.configure({ inline: false }),
            Table.configure({ resizable: true }),
            TableRow,
            TableHeader,
            TableCell,
            Placeholder.configure({
                placeholder: "본 사업을 통해 달성하고 싶은 궁극적인 목표에 대해 설명",
                includeChildren: false,
                showOnlyWhenEditable: true,
            }),
        ],
        content: "<p></p>",
    });
    const [activeEditor, setActiveEditor] = useState<typeof editorFeatures | null>(null);
    const [grammarActive, setGrammarActive] = useState(false);

    return (
        <div className="rounded-[12px] border border-gray-100 bg-white h-[756px] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center gap-2">
                    <div className="h-[20px] px-[6px] rounded-full flex items-center justify-center bg-gray-800 text-white ds-caption font-semibold">{number}</div>
                    <p className="ds-subtitle font-semibold text-gray-800">{number === '0' ? "개요" : title}</p>
                </div>
                {number !== '0' && <p className="ds-subtext font-medium text-gray-600 mt-[10px]">{subtitle}</p>}
            </div>
            <div className="py-2 px-6 mb-4 flex items-center gap-4 border-b border-gray-100">
                <ToolButton
                    label={<img src="/icons/write-icons/bold.svg" alt="Bold" />}
                    active={!!activeEditor?.isActive("bold")}
                    onClick={() => activeEditor?.chain().focus().toggleBold().run()}
                />
                <ToolButton
                    label={<img src="/icons/write-icons/highlight.svg" alt="Highlight" />}
                    active={!!activeEditor?.isActive("highlight", { color: "#FFF59D" })}
                    onClick={() => activeEditor?.chain().focus().toggleHighlight({ color: "#FFF59D" }).run()}
                />
                <ToolButton
                    label={<img src="/icons/write-icons/color.svg" alt="Color" />}
                    active={!!activeEditor?.isActive("textStyle", { color: "#FF3B57" })}
                    onClick={() => {
                        if (!activeEditor) return;
                        const isActive = activeEditor.isActive("textStyle", { color: "#FF3B57" });
                        if (isActive) {
                            activeEditor.chain().focus().unsetColor().run();
                        } else {
                            activeEditor.chain().focus().setColor("#FF3B57").run();
                        }
                    }}
                />
                <div className="mx-2 h-5 w-px bg-gray-200" />
                <ToolButton
                    label={<img src="/icons/write-icons/table.svg" alt="Table" />}
                    onClick={() => {
                        if (!activeEditor) return;
                        const isEmpty = activeEditor.getText().trim().length === 0;
                        const chain = activeEditor.chain().focus();
                        if (isEmpty) {
                            chain.clearContent();
                        }
                        // 표 삽입 (커서는 첫 번째 셀에 위치)
                        chain.insertTable({ rows: 3, cols: 2, withHeaderRow: true }).run();
                        // 표 아래에 빈 문단 추가 (커서 위치는 변경하지 않음)
                        const endPos = activeEditor.state.doc.content.size;
                        activeEditor.commands.insertContentAt(endPos, { type: "paragraph" }, { updateSelection: false });
                    }}
                />
                <ToolButton
                    label={<img src="/icons/write-icons/image.svg" alt="Image" />}
                //onClick={() => }
                />
                <button
                    type="button"
                    onClick={() => setGrammarActive((v) => !v)}
                    aria-pressed={grammarActive}
                    className={`flex items-center gap-1 rounded-[4px] pl-[2px] pr-[6px] py-[2px] transition-colors font-semibold ${grammarActive
                        ? "bg-primary-50 text-primary-500"
                        : "text-gray-700"
                        }`}
                >
                    <img
                        src={grammarActive ? "/icons/write-icons/grammer-active.svg" : "/icons/write-icons/grammer.svg"}
                        alt="Grammer"
                    />
                    <span className="ds-subtext">맞춤법 검사</span>
                </button>
                <button className="cursor-pointer ml-auto flex items-center justify-center rounded-[4px] border border-primary-500 text-primary-500 ds-caption font-medium p-2 h-[28px]">
                    임시 저장
                </button>
            </div>
            <div className="space-y-[24px] px-5 pb-4">
                {number === '0' ? (
                    <>
                        <div>
                            <label className="ds-subtitle font-semibold mb-[10px] block text-gray-800">아이템명</label>
                            <TextInput placeholder="답변을 입력하세요." />
                        </div>

                        <div>
                            <label className="ds-subtitle font-semibold mb-[10px] block text-gray-800">아이템 한줄 소개</label>
                            <TextInput placeholder="답변을 입력하세요." />
                        </div>

                        <div>
                            <label className="ds-subtitle font-semibold mb-[10px] block text-gray-800">아이템 / 아이디어 주요 기능</label>
                            <div className="rounded-[4px] bg-gray-100 px-3 py-2 min-h-[252px]">
                                <EditorContent
                                    editor={editorFeatures}
                                    onFocus={() => setActiveEditor(editorFeatures)}
                                    className="prose max-w-none focus:outline-none placeholder:text-gray-400"
                                    placeholder="아이템의 핵심기능은 무엇이며, 어떤 기능을 구현·작동 하는지 설명해주세요."
                                />
                            </div>
                        </div>

                        <div>
                            <label className="ds-subtitle font-semibold mb-[10px] block text-gray-800">관련 보유 기술</label>
                            <div className="rounded-[4px] bg-gray-100 px-3 py-2 min-h-[252px]">
                                <EditorContent
                                    editor={editorSkills}
                                    onFocus={() => setActiveEditor(editorSkills)}
                                    className="prose max-w-none focus:outline-none placeholder:text-gray-400"
                                    placeholder="아이템의 핵심기능은 무엇이며, 어떤 기능을 구현·작동 하는지 설명해주세요."
                                />
                            </div>
                        </div>
                        <div>
                            <label className="ds-subtitle font-semibold mb-[10px] block text-gray-800">창업 목표</label>
                            <div className="rounded-[4px] bg-gray-100 px-3 py-2 min-h-[252px]">
                                <EditorContent
                                    editor={editorGoals}
                                    onFocus={() => setActiveEditor(editorGoals)}
                                    className="prose max-w-none focus:outline-none placeholder:text-gray-400"
                                    placeholder="본 사업을 통해 달성하고 싶은 궁극적인 목표에 대해 설명"
                                />
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="rounded-[4px] bg-white px-3 py-2 min-h-[252px]">
                        <EditorContent
                            editor={editorFeatures}
                            onFocus={() => setActiveEditor(editorFeatures)}
                            className="prose max-w-none focus:outline-none placeholder:text-gray-400"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
