import { Editor } from '@tiptap/core';
import { EditorContent } from '@tiptap/react';
import TextInput from './TextInput';
import TableToolbar from './TableToolbar';

interface OverviewSectionProps {
  itemName: string;
  oneLineIntro: string;
  editorFeatures: Editor | null;
  editorSkills: Editor | null;
  editorGoals: Editor | null;
  onItemNameChange: (value: string) => void;
  onOneLineIntroChange: (value: string) => void;
  onEditorFocus: (editor: Editor) => void;
}

const OverviewSection = ({
  itemName,
  oneLineIntro,
  editorFeatures,
  editorSkills,
  editorGoals,
  onItemNameChange,
  onOneLineIntroChange,
  onEditorFocus,
}: OverviewSectionProps) => {
  return (
    <>
      <div>
        <label className="ds-subtitle mb-[10px] block font-semibold text-gray-900">
          아이템명
        </label>
        <TextInput
          placeholder="답변을 입력하세요."
          value={itemName}
          onChange={onItemNameChange}
        />
      </div>

      <div>
        <label className="ds-subtitle mb-[10px] block font-semibold text-gray-900">
          아이템 한줄 소개
        </label>
        <TextInput
          placeholder="답변을 입력하세요."
          value={oneLineIntro}
          onChange={onOneLineIntroChange}
        />
      </div>

      <div>
        <label className="ds-subtitle mb-[10px] block font-semibold text-gray-900">
          아이템 / 아이디어 주요 기능
        </label>
        <div
          className="min-h-[252px] cursor-text rounded-[4px] bg-gray-100 px-3 py-2 text-gray-900"
          onClick={() => {
            if (editorFeatures && !editorFeatures.isDestroyed) {
              editorFeatures.commands.focus();
              onEditorFocus(editorFeatures);
            }
          }}
        >
          {editorFeatures && (
            <>
              <TableToolbar editor={editorFeatures} />
              <EditorContent
                editor={editorFeatures}
                onFocus={() => onEditorFocus(editorFeatures)}
                className="prose max-w-none cursor-text placeholder:text-gray-400 focus:outline-none [&_img]:h-auto [&_img]:max-h-[400px] [&_img]:max-w-full [&_img]:object-contain"
                placeholder="아이템의 핵심기능은 무엇이며, 어떤 기능을 구현·작동 하는지 설명해주세요."
              />
            </>
          )}
        </div>
      </div>

      <div>
        <label className="ds-subtitle mb-[10px] block font-semibold text-gray-900">
          관련 보유 기술
        </label>
        <div
          className="min-h-[126px] cursor-text rounded-[4px] bg-gray-100 px-3 py-2 text-gray-900"
          onClick={() => {
            if (editorSkills && !editorSkills.isDestroyed) {
              editorSkills.commands.focus();
              onEditorFocus(editorSkills);
            }
          }}
        >
          {editorSkills && (
            <>
              <TableToolbar editor={editorSkills} />
              <EditorContent
                editor={editorSkills}
                onFocus={() => onEditorFocus(editorSkills)}
                className="prose max-w-none cursor-text placeholder:text-gray-400 focus:outline-none [&_img]:h-auto [&_img]:max-h-[400px] [&_img]:max-w-full [&_img]:object-contain"
                placeholder="아이템의 핵심기능은 무엇이며, 어떤 기능을 구현·작동 하는지 설명해주세요."
              />
            </>
          )}
        </div>
      </div>
      <div>
        <label className="ds-subtitle mb-[10px] block font-semibold text-gray-900">
          창업 목표
        </label>
        <div
          className="min-h-[126px] cursor-text rounded-[4px] bg-gray-100 px-3 py-2 text-gray-900"
          onClick={() => {
            if (editorGoals && !editorGoals.isDestroyed) {
              editorGoals.commands.focus();
              onEditorFocus(editorGoals);
            }
          }}
        >
          {editorGoals && (
            <>
              <TableToolbar editor={editorGoals} />
              <EditorContent
                editor={editorGoals}
                onFocus={() => onEditorFocus(editorGoals)}
                className="prose max-w-none cursor-text placeholder:text-gray-400 focus:outline-none [&_img]:h-auto [&_img]:max-h-[400px] [&_img]:max-w-full [&_img]:object-contain"
                placeholder="본 사업을 통해 달성하고 싶은 궁극적인 목표에 대해 설명"
              />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default OverviewSection;
