import { Editor } from '@tiptap/core';
import { EditorContent } from '@tiptap/react';
import TableToolbar from './TableToolbar';

interface GeneralSectionProps {
  editor: Editor | null;
  onEditorFocus: (editor: Editor) => void;
}

const GeneralSection = ({ editor, onEditorFocus }: GeneralSectionProps) => {
  return (
    <div
      className="min-h-[500px] cursor-text rounded-[4px] bg-white px-3 py-2 text-gray-900"
      onClick={() => {
        if (editor && !editor.isDestroyed) {
          editor.commands.focus();
          onEditorFocus(editor);
        }
      }}
    >
      {editor && (
        <>
          <TableToolbar editor={editor} />
          <EditorContent
            editor={editor}
            onFocus={() => onEditorFocus(editor)}
            className="prose max-w-none cursor-text placeholder:text-gray-400 focus:outline-none [&_img]:h-auto [&_img]:max-h-[400px] [&_img]:max-w-full [&_img]:object-contain"
          />
        </>
      )}
    </div>
  );
};

export default GeneralSection;
