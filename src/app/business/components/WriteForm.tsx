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
import TextInput from "./editor/TextInput";
import ToolButton from "./editor/ToolButton";
import BoldIcon from "@/assets/icons/write-icons/bold.svg";
import HighlightIcon from "@/assets/icons/write-icons/highlight.svg";
import HighlightActiveIcon from "@/assets/icons/write-icons/highlight-active.svg";
import ColorIcon from "@/assets/icons/write-icons/color.svg";
import TableIcon from "@/assets/icons/write-icons/table.svg";
import ImageIcon from "@/assets/icons/write-icons/image.svg";
import GrammerIcon from "@/assets/icons/write-icons/grammer.svg";
import GrammerActiveIcon from "@/assets/icons/write-icons/grammer-active.svg";
import TableToolbar from "./editor/TableToolbar";

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

const WriteForm = ({
  number = "0",
  title = "개요",
  subtitle = "구성원의 담당업무, 사업화와 관련하여 보유한 전문성(기술력, 노하우) 위주로 작성.",
}: {
  number?: string;
  title?: string;
  subtitle?: string;
}) => {
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
  const [activeEditor, setActiveEditor] = useState<
    typeof editorFeatures | null
  >(null);
  const [grammarActive, setGrammarActive] = useState(false);

  return (
    <div className="rounded-[12px] border border-gray-100 bg-white w-full h-[756px] flex flex-col">
      {/* 고정 헤더 */}
      <div className="px-6 py-4 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="h-[20px] px-[6px] rounded-full flex items-center justify-center bg-gray-900 text-white ds-caption font-semibold">
            {number}
          </div>
          <p className="ds-subtitle font-semibold text-gray-900">
            {number === "0" ? "개요" : title}
          </p>
        </div>
        {number !== "0" && (
          <p className="ds-subtext font-medium text-gray-600 mt-[10px]">
            {subtitle}
          </p>
        )}
      </div>

      {/* 고정 툴바 */}
      <div className="py-2 px-6 flex items-center gap-4 border-b border-gray-100 flex-shrink-0">
        <ToolButton
          label={<BoldIcon />}
          active={!!activeEditor?.isActive("bold")}
          onClick={() => activeEditor?.chain().focus().toggleBold().run()}
        />
        <ToolButton
          label={
            activeEditor?.isActive("highlight", { color: "#FFF59D" }) ? (
              <HighlightActiveIcon />
            ) : (
              <HighlightIcon />
            )
          }
          active={!!activeEditor?.isActive("highlight", { color: "#FFF59D" })}
          onClick={() =>
            activeEditor
              ?.chain()
              .focus()
              .toggleHighlight({ color: "#FFF59D" })
              .run()
          }
        />
        <ToolButton
          label={<ColorIcon />}
          active={!!activeEditor?.isActive("textStyle", { color: "#FF3B57" })}
          onClick={() => {
            if (!activeEditor) return;
            const isActive = activeEditor.isActive("textStyle", {
              color: "#FF3B57",
            });
            if (isActive) {
              activeEditor.chain().focus().unsetColor().run();
            } else {
              activeEditor.chain().focus().setColor("#FF3B57").run();
            }
          }}
        />
        <div className="mx-2 h-5 w-px bg-gray-200" />
        <ToolButton
          label={<TableIcon />}
          onClick={() => {
            if (!activeEditor) return;
            const { state } = activeEditor;
            const $from = state.selection.$from;

            // 1) 표 내부에서 클릭: 현재 표 바로 뒤에 표를 추가
            let insideTableDepth = -1;
            for (let d = $from.depth; d > 0; d--) {
              if ($from.node(d).type.name === "table") {
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
                .insertTable({ rows: 3, cols: 2, withHeaderRow: true })
                .run();
            } else {
              // 2) 빈 문단(예: 표 아래 한 줄)에서 클릭: 그 자리를 표로 대체
              const isEmptyParagraph =
                $from.parent.type.name === "paragraph" &&
                $from.parent.content.size === 0;
              if (isEmptyParagraph) {
                activeEditor
                  .chain()
                  .focus()
                  .deleteRange({
                    from: state.selection.from,
                    to: state.selection.to,
                  })
                  .insertTable({ rows: 3, cols: 2, withHeaderRow: true })
                  .run();
              } else {
                // 3) 그 외 위치: 현재 커서 위치에 표 추가 (여러 개 삽입 가능)
                activeEditor
                  .chain()
                  .focus()
                  .insertTable({ rows: 3, cols: 2, withHeaderRow: true })
                  .run();
              }
            }
            // 문서 끝에 빈 문단 유지(커서는 표 첫 셀에 남음)
            const endPos = activeEditor.state.doc.content.size;
            activeEditor.commands.insertContentAt(
              endPos,
              { type: "paragraph" },
              { updateSelection: false }
            );
          }}
        />
        <ToolButton
          label={<ImageIcon />}
        //onClick={() => }
        />
        <button
          type="button"
          onClick={() => setGrammarActive((v) => !v)}
          aria-pressed={grammarActive}
          className={`flex items-center cursor-pointer gap-1 rounded-[4px] pl-[2px] pr-[6px] py-[2px] transition-colors font-semibold ${grammarActive ? "bg-primary-50 text-primary-500" : "text-gray-700"
            }`}
        >
          {grammarActive ? <GrammerActiveIcon /> : <GrammerIcon />}
          <span className="ds-subtext">맞춤법 검사</span>
        </button>
        <button className="cursor-pointer ml-auto flex items-center justify-center rounded-[4px] border border-primary-500 text-primary-500 ds-caption font-medium p-2 h-[28px]">
          임시 저장
        </button>
      </div>

      {/* 스크롤 가능한 콘텐츠 영역 */}
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-[24px] px-5 py-4">
          {number === "0" ? (
            <>
              <div>
                <label className="ds-subtitle font-semibold mb-[10px] block text-gray-900">
                  아이템명
                </label>
                <TextInput placeholder="답변을 입력하세요." />
              </div>

              <div>
                <label className="ds-subtitle font-semibold mb-[10px] block text-gray-900">
                  아이템 한줄 소개
                </label>
                <TextInput placeholder="답변을 입력하세요." />
              </div>

              <div>
                <label className="ds-subtitle font-semibold mb-[10px] block text-gray-900">
                  아이템 / 아이디어 주요 기능
                </label>
                <div
                  className="rounded-[4px] bg-gray-100 px-3 py-2 min-h-[252px] cursor-text"
                  onClick={(e) => {
                    if (editorFeatures && !editorFeatures.isDestroyed) {
                      editorFeatures.commands.focus();
                      setActiveEditor(editorFeatures);
                    }
                  }}
                >
                  <TableToolbar editor={editorFeatures} />
                  <EditorContent
                    editor={editorFeatures}
                    onFocus={() => setActiveEditor(editorFeatures)}
                    className="prose max-w-none focus:outline-none placeholder:text-gray-400 cursor-text"
                    placeholder="아이템의 핵심기능은 무엇이며, 어떤 기능을 구현·작동 하는지 설명해주세요."
                  />
                </div>
              </div>

              <div>
                <label className="ds-subtitle font-semibold mb-[10px] block text-gray-900">
                  관련 보유 기술
                </label>
                <div
                  className="rounded-[4px] bg-gray-100 px-3 py-2 min-h-[252px] cursor-text"
                  onClick={(e) => {
                    if (editorSkills && !editorSkills.isDestroyed) {
                      editorSkills.commands.focus();
                      setActiveEditor(editorSkills);
                    }
                  }}
                >
                  <TableToolbar editor={editorSkills} />
                  <EditorContent
                    editor={editorSkills}
                    onFocus={() => setActiveEditor(editorSkills)}
                    className="prose max-w-none focus:outline-none placeholder:text-gray-400 cursor-text"
                    placeholder="아이템의 핵심기능은 무엇이며, 어떤 기능을 구현·작동 하는지 설명해주세요."
                  />
                </div>
              </div>
              <div>
                <label className="ds-subtitle font-semibold mb-[10px] block text-gray-900">
                  창업 목표
                </label>
                <div
                  className="rounded-[4px] bg-gray-100 px-3 py-2 min-h-[252px] cursor-text"
                  onClick={(e) => {
                    if (editorGoals && !editorGoals.isDestroyed) {
                      editorGoals.commands.focus();
                      setActiveEditor(editorGoals);
                    }
                  }}
                >
                  <TableToolbar editor={editorGoals} />
                  <EditorContent
                    editor={editorGoals}
                    onFocus={() => setActiveEditor(editorGoals)}
                    className="prose max-w-none focus:outline-none placeholder:text-gray-400 cursor-text"
                    placeholder="본 사업을 통해 달성하고 싶은 궁극적인 목표에 대해 설명"
                  />
                </div>
              </div>
            </>
          ) : (
            <div
              className="rounded-[4px] bg-white px-3 py-2 min-h-[252px] cursor-text"
              onClick={(e) => {
                if (editorFeatures && !editorFeatures.isDestroyed) {
                  editorFeatures.commands.focus();
                  setActiveEditor(editorFeatures);
                }
              }}
            >
              <TableToolbar editor={editorFeatures} />
              <EditorContent
                editor={editorFeatures}
                onFocus={() => setActiveEditor(editorFeatures)}
                className="prose max-w-none focus:outline-none placeholder:text-gray-400 cursor-text"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WriteForm;
