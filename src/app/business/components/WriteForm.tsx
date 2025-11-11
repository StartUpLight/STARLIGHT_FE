'use client';
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useEditor } from '@tiptap/react';
import { useBusinessStore } from '@/store/business.store';
import { uploadImage } from '@/lib/imageUpload';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Placeholder from '@tiptap/extension-placeholder';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableHeader from '@tiptap/extension-table-header';
import TableCell from '@tiptap/extension-table-cell';
import { Editor } from '@tiptap/core';
import { useSpellCheck } from '@/hooks/mutation/useSpellCheck';
import { SpellPayload } from '@/lib/business/postSpellCheck';
import { useSpellCheckStore } from '@/store/spellcheck.store';
import { applySpellHighlights, clearSpellErrors } from '@/util/spellMark';
import SpellError from '@/util/spellError';
import { mapSpellResponse } from '@/types/business/business.type';
import { useEditorStore } from '@/store/editor.store';
import {
  DeleteTableOnDelete,
  ImageCutPaste,
  ResizableImage,
} from '../../../lib/business/extensions';
import { createPasteHandler } from '../../../lib/business/useEditorConfig';
import WriteFormHeader from './editor/WriteFormHeader';
import WriteFormToolbar from './editor/WriteFormToolbar';
import OverviewSection from './editor/OverviewSection';
import GeneralSection from './editor/GeneralSection';
import { clearFixedCorrections } from '@/util/spellReplace';

const WriteForm = ({
  number = '0',
  title = '개요',
  subtitle = '구성원의 담당업무, 사업화와 관련하여 보유한 전문성(기술력, 노하우) 위주로 작성.',
}: {
  number?: string;
  title?: string;
  subtitle?: string;
}) => {
  const editorFeatures = useEditor({
    extensions: [
      StarterKit,
      SpellError,
      DeleteTableOnDelete,
      ImageCutPaste,
      Highlight.configure({ multicolor: true }),
      TextStyle,
      Color,
      ResizableImage.configure({ inline: false }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      Placeholder.configure({
        placeholder:
          '아이템의 핵심기능은 무엇이며, 어떤 기능을 구현·작동 하는지 설명해주세요.',
        includeChildren: false,
        showOnlyWhenEditable: true,
      }),
    ],
    content: '<p></p>',
    editorProps: {
      handlePaste: createPasteHandler(),
    },
  });

  const editorSkills = useEditor({
    extensions: [
      StarterKit,
      SpellError,
      DeleteTableOnDelete,
      ImageCutPaste,
      Highlight.configure({ multicolor: true }),
      TextStyle,
      Color,
      ResizableImage.configure({ inline: false }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      Placeholder.configure({
        placeholder:
          '보유한 기술 및 지식재산권이 별도로 없을 경우, 아이템에 필요한 핵심기술을 어떻게 개발해 나갈것인지 계획에 대해 작성해주세요. \n ※ 지식재산권: 특허, 상표권, 디자인, 실용신안권 등.',
        includeChildren: false,
        showOnlyWhenEditable: true,
      }),
    ],
    content: '<p></p>',
    editorProps: {
      handlePaste: createPasteHandler(),
    },
  });

  const editorGoals = useEditor({
    extensions: [
      StarterKit,
      SpellError,
      DeleteTableOnDelete,
      ImageCutPaste,
      Highlight.configure({ multicolor: true }),
      TextStyle,
      Color,
      ResizableImage.configure({ inline: false }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      Placeholder.configure({
        placeholder: '본 사업을 통해 달성하고 싶은 궁극적인 목표에 대해 설명',
        includeChildren: false,
        showOnlyWhenEditable: true,
      }),
    ],
    content: '<p></p>',
    editorProps: {
      handlePaste: createPasteHandler(),
    },
  });
  const { updateItemContent, getItemContent, lastSavedTime, isSaving } =
    useBusinessStore();
  const [activeEditor, setActiveEditor] = useState<
    typeof editorFeatures | null
  >(null);
  const [grammarActive, setGrammarActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // store에서 저장된 내용 불러오기
  const savedContent = getItemContent(number);
  const [itemName, setItemName] = useState(savedContent.itemName || '');
  const [oneLineIntro, setOneLineIntro] = useState(
    savedContent.oneLineIntro || ''
  );

  // number가 변경될 때 store에서 내용 불러오기
  useEffect(() => {
    if (!editorFeatures) return;

    const content = getItemContent(number);
    setItemName(content.itemName || '');
    setOneLineIntro(content.oneLineIntro || '');

    // 에디터 내용 복원
    if (number === '0') {
      if (
        content.editorFeatures &&
        editorFeatures &&
        !editorFeatures.isDestroyed
      ) {
        try {
          editorFeatures.commands.setContent(content.editorFeatures);
        } catch (e) {
          console.error('에디터 내용 복원 실패:', e);
        }
      }
      if (content.editorSkills && editorSkills && !editorSkills.isDestroyed) {
        try {
          editorSkills.commands.setContent(content.editorSkills);
        } catch (e) {
          console.error('에디터 내용 복원 실패:', e);
        }
      }
      if (content.editorGoals && editorGoals && !editorGoals.isDestroyed) {
        try {
          editorGoals.commands.setContent(content.editorGoals);
        } catch (e) {
          console.error('에디터 내용 복원 실패:', e);
        }
      }
    } else {
      if (
        content.editorContent &&
        editorFeatures &&
        !editorFeatures.isDestroyed
      ) {
        try {
          editorFeatures.commands.setContent(content.editorContent);
        } catch (e) {
          console.error('에디터 내용 복원 실패:', e);
        }
      }
    }
  }, [number, editorFeatures, editorSkills, editorGoals, getItemContent]);

  // 에디터에 onChange 이벤트 리스너 추가 (디바운스 적용)
  useEffect(() => {
    if (!editorFeatures) return;

    let timeoutId: NodeJS.Timeout;

    const handleUpdate = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        if (number === '0') {
          updateItemContent(number, {
            itemName,
            oneLineIntro,
            editorFeatures: editorFeatures.getJSON(),
            editorSkills: editorSkills?.getJSON() || null,
            editorGoals: editorGoals?.getJSON() || null,
          });
        } else {
          updateItemContent(number, {
            editorContent: editorFeatures.getJSON(),
          });
        }
      }, 300);
    };

    editorFeatures.on('update', handleUpdate);

    if (number === '0' && editorSkills) {
      let skillsTimeoutId: NodeJS.Timeout;
      const handleSkillsUpdate = () => {
        clearTimeout(skillsTimeoutId);
        skillsTimeoutId = setTimeout(() => {
          updateItemContent(number, {
            itemName,
            oneLineIntro,
            editorSkills: editorSkills.getJSON(),
          });
        }, 300);
      };
      editorSkills.on('update', handleSkillsUpdate);
    }

    if (number === '0' && editorGoals) {
      let goalsTimeoutId: NodeJS.Timeout;
      const handleGoalsUpdate = () => {
        clearTimeout(goalsTimeoutId);
        goalsTimeoutId = setTimeout(() => {
          updateItemContent(number, {
            itemName,
            oneLineIntro,
            editorGoals: editorGoals.getJSON(),
          });
        }, 300);
      };
      editorGoals.on('update', handleGoalsUpdate);
    }

    return () => {
      clearTimeout(timeoutId);
      editorFeatures.off('update', handleUpdate);
      if (number === '0' && editorSkills) {
        editorSkills.off('update');
      }
      if (number === '0' && editorGoals) {
        editorGoals.off('update');
      }
    };
  }, [
    editorFeatures,
    editorSkills,
    editorGoals,
    number,
    updateItemContent,
    itemName,
    oneLineIntro,
  ]);

  // TextInput 값 변경 시 store에 저장
  const handleItemNameChange = (value: string) => {
    setItemName(value);
    updateItemContent(number, { itemName: value });
  };

  const handleOneLineIntroChange = (value: string) => {
    setOneLineIntro(value);
    updateItemContent(number, { oneLineIntro: value });
  };

  // 이미지 파일 선택 핸들러
  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || !activeEditor) return;

    // 이미지 파일만 허용
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.');
      return;
    }

    // 파일 크기 제한 (예: 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert('이미지 크기는 5MB 이하여야 합니다.');
      return;
    }

    try {
      // 서버에 이미지 업로드 및 공개 URL 받기
      const imageUrl = await uploadImage(file);

      if (imageUrl && activeEditor) {
        activeEditor.chain().focus().setImage({ src: imageUrl }).run();
      }
    } catch (error) {
      console.error('이미지 업로드 실패:', error);
      alert('이미지 업로드에 실패했습니다. 다시 시도해주세요.');
    }

    // 같은 파일을 다시 선택할 수 있도록 input 값 초기화
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 이미지 버튼 클릭 핸들러
  const handleImageButtonClick = () => {
    if (!activeEditor) {
      // activeEditor가 없으면 기본 에디터에 포커스
      if (editorFeatures && !editorFeatures.isDestroyed) {
        editorFeatures.commands.focus();
        setActiveEditor(editorFeatures);
      }
    }
    fileInputRef.current?.click();
  };

  //-----------------------------------------------------------------------------------------
  //맞춤법검사

  const {
    openPanel,
    setLoading,
    setItems,
    reset: resetSpell,
  } = useSpellCheckStore();
  const { mutate: spellcheck } = useSpellCheck();
  const spellChecking = useSpellCheckStore((s) => s.loading);
  const items = useSpellCheckStore((s) => s.items);
  const register = useEditorStore((s) => s.register);

  const editors = useMemo(
    () =>
      (number === '0'
        ? [editorFeatures, editorSkills, editorGoals]
        : [editorFeatures]
      ).filter((e): e is Editor => !!e && !e.isDestroyed),
    [number, editorFeatures, editorSkills, editorGoals]
  );

  const resetSpellVisuals = useCallback((edit: Editor[]) => {
    const id = requestAnimationFrame(() => {
      clearFixedCorrections(edit);

      edit.forEach((ed) => clearSpellErrors(ed));
    });
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    if (!editors.length) return;
    const id = requestAnimationFrame(() => {
      applySpellHighlights(editors, items);
    });
    return () => cancelAnimationFrame(id);
  }, [editors, items]);

  useEffect(() => {
    register({
      sectionNumber: number,
      features: editorFeatures ?? null,
      skills: number === '0' ? (editorSkills ?? null) : null,
      goals: number === '0' ? (editorGoals ?? null) : null,
    });
  }, [number, editorFeatures, editorSkills, editorGoals, register]);

  useEffect(() => {
    resetSpell();
    if (!editors.length) return;
    return resetSpellVisuals(editors);
  }, [number, editors, resetSpell, resetSpellVisuals]);

  const handleSpellCheckClick = () => {
    setGrammarActive((v) => !v);
    openPanel();

    if (editors.length) {
      resetSpellVisuals(editors);
    }

    setLoading(true);

    const payload = SpellPayload({
      number,
      title,
      itemName,
      oneLineIntro,
      editorFeatures,
      editorSkills,
      editorGoals,
    });

    spellcheck(payload, {
      onSuccess: (res) => {
        setItems(mapSpellResponse(res));
        setLoading(false);
      },
      onError: (err) => {
        console.error('맞춤법검사 실패:', err);
        setItems([]);
        setLoading(false);
        alert('잠시 후 다시 시도해주세요.');
      },
    });
  };

  return (
    <div className="flex h-[756px] w-full flex-col rounded-[12px] border border-gray-100 bg-white">
      <WriteFormHeader number={number} title={title} subtitle={subtitle} />
      <WriteFormToolbar
        activeEditor={activeEditor}
        onImageClick={handleImageButtonClick}
        onSpellCheckClick={handleSpellCheckClick}
        grammarActive={grammarActive}
        spellChecking={spellChecking}
        isSaving={isSaving}
        lastSavedTime={lastSavedTime}
      />
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
      {/* 스크롤 가능한 콘텐츠 영역 */}
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-[24px] px-5 py-4">
          {number === '0' ? (
            <OverviewSection
              itemName={itemName}
              oneLineIntro={oneLineIntro}
              editorFeatures={editorFeatures}
              editorSkills={editorSkills}
              editorGoals={editorGoals}
              onItemNameChange={handleItemNameChange}
              onOneLineIntroChange={handleOneLineIntroChange}
              onEditorFocus={setActiveEditor}
            />
          ) : (
            <GeneralSection
              editor={editorFeatures}
              onEditorFocus={setActiveEditor}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default WriteForm;
