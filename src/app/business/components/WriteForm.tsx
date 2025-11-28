'use client';
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useEditor } from '@tiptap/react';
import { useBusinessStore } from '@/store/business.store';
import { uploadImage } from '@/lib/imageUpload';
import {
  getImageDimensions,
  clampImageDimensions,
} from '@/lib/getImageDimensions';
import { getSelectionAvailableWidth } from '@/lib/business/editor/getSelectionAvailableWidth';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Placeholder from '@tiptap/extension-placeholder';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableHeader from '@tiptap/extension-table-header';
import TableCell from '@tiptap/extension-table-cell';
import { Editor, JSONContent } from '@tiptap/core';
import { useSpellCheck } from '@/hooks/mutation/useSpellCheck';
import { SpellPayload } from '@/lib/business/postSpellCheck';
import { useSpellCheckStore } from '@/store/spellcheck.store';
import { applySpellHighlights, clearSpellErrors } from '@/util/spellMark';
import SpellError from '@/util/spellError';
import { mapSpellResponse } from '@/types/business/business.type';
import { useEditorStore } from '@/store/editor.store';
import { DeleteTableOnDelete, ResizableImage, SelectTableOnBorderClick, EnsureTrailingParagraph } from '../../../lib/business/editor/extensions';
import { createPasteHandler } from '../../../lib/business/editor/useEditorConfig';
import { ImageCommandAttributes } from '@/lib/business/editor/types';
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
    immediatelyRender: false,
  });

  const editorSkills = useEditor({
    extensions: [
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
    immediatelyRender: false,
  });

  const editorGoals = useEditor({
    extensions: [
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
    immediatelyRender: false,
  });

  // 아이템명 에디터 (하이라이트, 볼드, 색상만 가능, 헤딩/표/이미지 비활성화)
  const editorItemName = useEditor({
    extensions: [
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
      Placeholder.configure({
        placeholder: '답변을 입력하세요.',
        includeChildren: false,
        showOnlyWhenEditable: true,
      }),
    ],
    content: '<p></p>',
    immediatelyRender: false,
  });

  // 아이템 한줄소개 에디터 (하이라이트, 볼드, 색상만 가능, 헤딩/표/이미지 비활성화)
  const editorOneLineIntro = useEditor({
    extensions: [
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
      Placeholder.configure({
        placeholder: '답변을 입력하세요.',
        includeChildren: false,
        showOnlyWhenEditable: true,
      }),
    ],
    content: '<p></p>',
    immediatelyRender: false,
  });

  const editorGeneral = useEditor({
    extensions: [
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
      Placeholder.configure({
        placeholder:
          '세부 항목별 체크리스트를 참고하며 작성해주시면, 리포트 점수가 올라갑니다.',
        includeChildren: false,
        showOnlyWhenEditable: true,
      }),
    ],
    content: '<p></p>',
    editorProps: {
      handlePaste: createPasteHandler(),
    },
    immediatelyRender: false,
  });

  const {
    updateItemContent,
    getItemContent,
    lastSavedTime,
    isSaving,
    saveAllItems,
    planId,
  } = useBusinessStore();
  // 현재 섹션의 contents만 구독하여 변경 감지
  const currentContent = useBusinessStore((state) => state.contents[number]);
  const [activeEditor, setActiveEditor] = useState<Editor | null>(null);
  const [grammarActive, setGrammarActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isOverview = number === '0';
  // 에디터 내용 복원 헬퍼 함수
  const restoreEditorContent = useCallback(
    (editor: Editor | null, content: JSONContent | null | undefined) => {
      if (!editor || editor.isDestroyed) return;
      try {
        if (content) {
          const currentJSON = editor.getJSON();
          const nextJSON = JSON.parse(JSON.stringify(content));
          if (JSON.stringify(currentJSON) === JSON.stringify(nextJSON)) {
            return;
          }
          editor.commands.setContent(nextJSON, false);
        } else {
          const currentJSON = editor.getJSON();
          const isAlreadyEmpty =
            !currentJSON ||
            !Array.isArray(currentJSON.content) ||
            currentJSON.content.length === 0 ||
            (currentJSON.content.length === 1 &&
              currentJSON.content[0]?.type === 'paragraph' &&
              (!currentJSON.content[0]?.content ||
                currentJSON.content[0]?.content?.length === 0));
          if (isAlreadyEmpty) return;
          // content가 없으면 에디터를 빈 상태로 초기화
          editor.commands.clearContent(false);
        }
      } catch (e) {
        console.error('에디터 내용 복원 실패:', e);
      }
    },
    []
  );

  // number가 변경되거나 contents가 업데이트될 때 store에서 내용 불러오기
  useEffect(() => {
    const content = getItemContent(number);
    // 에디터 내용 복원
    if (isOverview) {
      // 개요 섹션: editorFeatures, editorSkills, editorGoals 모두 복원
      // itemName과 oneLineIntro는 JSONContent로 저장되어 있을 수 있음
      restoreEditorContent(
        editorItemName,
        content.itemName
          ? typeof content.itemName === 'string'
            ? {
              type: 'doc',
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: content.itemName }],
                },
              ],
            }
            : content.itemName
          : null
      );
      restoreEditorContent(
        editorOneLineIntro,
        content.oneLineIntro
          ? typeof content.oneLineIntro === 'string'
            ? {
              type: 'doc',
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: content.oneLineIntro }],
                },
              ],
            }
            : content.oneLineIntro
          : null
      );
      restoreEditorContent(editorFeatures, content.editorFeatures);
      restoreEditorContent(editorSkills, content.editorSkills);
      restoreEditorContent(editorGoals, content.editorGoals);
    } else {
      // 일반 섹션: editorGeneral만 복원
      restoreEditorContent(editorGeneral, content.editorContent);
    }
  }, [
    number,
    isOverview,
    editorFeatures,
    editorGeneral,
    editorSkills,
    editorGoals,
    editorItemName,
    editorOneLineIntro,
    currentContent,
    getItemContent,
    restoreEditorContent,
  ]);

  // 공통 저장 함수 (디바운스 적용)
  const debouncedSave = useCallback(async () => {
    if (!planId) return;
    try {
      await saveAllItems(planId);
    } catch (error) {
      console.error('자동 저장 실패:', error);
    }
  }, [planId, saveAllItems]);

  // 에디터 업데이트 핸들러 생성
  const createUpdateHandler = useCallback(
    (timeoutRef: React.MutableRefObject<NodeJS.Timeout | null>) => {
      return () => {
        // 저장 전 커서 위치 저장
        const saveSelection = (editor: Editor | null) => {
          if (!editor || editor.isDestroyed) return null;
          return {
            from: editor.state.selection.from,
            to: editor.state.selection.to,
          };
        };

        const primaryEditor = isOverview ? editorFeatures : editorGeneral;
        const mainSelection = saveSelection(primaryEditor);
        const skillsSelection = saveSelection(editorSkills);
        const goalsSelection = saveSelection(editorGoals);
        const itemNameSelection = saveSelection(editorItemName);
        const oneLineIntroSelection = saveSelection(editorOneLineIntro);

        // store에 즉시 저장 (메모리 작업이므로 디바운스 불필요)
        if (isOverview) {
          updateItemContent(number, {
            itemName: editorItemName?.getJSON() || null,
            oneLineIntro: editorOneLineIntro?.getJSON() || null,
            editorFeatures: primaryEditor?.getJSON() || null,
            editorSkills: editorSkills?.getJSON() || null,
            editorGoals: editorGoals?.getJSON() || null,
          });
        } else {
          updateItemContent(number, {
            editorContent: primaryEditor?.getJSON() || null,
          });
        }

        // 커서 위치 복원 로직
        requestAnimationFrame(() => {
          const fallbackEditor = primaryEditor;
          const currentActiveEditor = activeEditor || fallbackEditor;
          if (currentActiveEditor && !currentActiveEditor.isDestroyed) {
            let selectionToRestore = null;
            if (currentActiveEditor === fallbackEditor && mainSelection) {
              selectionToRestore = mainSelection;
            } else if (
              currentActiveEditor === editorSkills &&
              skillsSelection
            ) {
              selectionToRestore = skillsSelection;
            } else if (currentActiveEditor === editorGoals && goalsSelection) {
              selectionToRestore = goalsSelection;
            } else if (
              currentActiveEditor === editorItemName &&
              itemNameSelection
            ) {
              selectionToRestore = itemNameSelection;
            } else if (
              currentActiveEditor === editorOneLineIntro &&
              oneLineIntroSelection
            ) {
              selectionToRestore = oneLineIntroSelection;
            }
            if (selectionToRestore) {
              try {
                currentActiveEditor
                  .chain()
                  .focus()
                  .setTextSelection({
                    from: selectionToRestore.from,
                    to: selectionToRestore.to,
                  })
                  .run();
              } catch (e) {
                // 커서 위치 복원 실패 시 무시
              }
            }
          }
        });

        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
          debouncedSave();
        }, 300);
      };
    },
    [
      isOverview,
      number,
      editorItemName,
      editorOneLineIntro,
      editorFeatures,
      editorGeneral,
      editorSkills,
      editorGoals,
      updateItemContent,
      debouncedSave,
      activeEditor,
    ]
  );

  // 에디터에 onChange 이벤트 리스너 추가 (store는 즉시 저장, API만 디바운스)
  const mainTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const skillsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const goalsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const itemNameTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const oneLineIntroTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const mainEditorInstance = isOverview ? editorFeatures : editorGeneral;
    if (!mainEditorInstance) return;

    const handleMainUpdate = createUpdateHandler(mainTimeoutRef);
    mainEditorInstance.on('update', handleMainUpdate);

    const cleanup: (() => void)[] = [
      () => {
        if (mainTimeoutRef.current) clearTimeout(mainTimeoutRef.current);
        mainEditorInstance.off('update', handleMainUpdate);
      },
    ];

    if (isOverview) {
      // 아이템명 에디터
      if (editorItemName) {
        const handleItemNameUpdate = createUpdateHandler(itemNameTimeoutRef);
        editorItemName.on('update', handleItemNameUpdate);
        cleanup.push(() => {
          if (itemNameTimeoutRef.current)
            clearTimeout(itemNameTimeoutRef.current);
          editorItemName.off('update', handleItemNameUpdate);
        });
      }

      // 한줄소개 에디터
      if (editorOneLineIntro) {
        const handleOneLineIntroUpdate = createUpdateHandler(
          oneLineIntroTimeoutRef
        );
        editorOneLineIntro.on('update', handleOneLineIntroUpdate);
        cleanup.push(() => {
          if (oneLineIntroTimeoutRef.current)
            clearTimeout(oneLineIntroTimeoutRef.current);
          editorOneLineIntro.off('update', handleOneLineIntroUpdate);
        });
      }

      if (editorSkills) {
        const handleSkillsUpdate = createUpdateHandler(skillsTimeoutRef);
        editorSkills.on('update', handleSkillsUpdate);
        cleanup.push(() => {
          if (skillsTimeoutRef.current) clearTimeout(skillsTimeoutRef.current);
          editorSkills.off('update', handleSkillsUpdate);
        });
      }

      if (editorGoals) {
        const handleGoalsUpdate = createUpdateHandler(goalsTimeoutRef);
        editorGoals.on('update', handleGoalsUpdate);
        cleanup.push(() => {
          if (goalsTimeoutRef.current) clearTimeout(goalsTimeoutRef.current);
          editorGoals.off('update', handleGoalsUpdate);
        });
      }
    }

    return () => {
      cleanup.forEach((fn) => fn());
    };
  }, [
    editorFeatures,
    editorGeneral,
    editorSkills,
    editorGoals,
    editorItemName,
    editorOneLineIntro,
    planId,
    isOverview,
    createUpdateHandler,
  ]);

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

    try {
      // 서버에 이미지 업로드 및 공개 URL 받기
      const imageUrl = await uploadImage(file);

      if (imageUrl && activeEditor) {
        const { width, height } = await getImageDimensions(imageUrl);
        const selectionWidth = getSelectionAvailableWidth(activeEditor);
        const editorDom = activeEditor.view.dom as HTMLElement | null;
        const fallbackWidth = editorDom
          ? editorDom.clientWidth - 48
          : undefined;
        const maxWidth = selectionWidth ?? fallbackWidth;
        const { width: clampedWidth, height: clampedHeight } =
          clampImageDimensions(width, height, maxWidth ?? undefined);
        const imageAttributes: ImageCommandAttributes = {
          src: imageUrl,
          width: clampedWidth ?? undefined,
          height: clampedHeight ?? undefined,
        };

        activeEditor.chain().focus().setImage(imageAttributes).run();
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
      const defaultEditor = isOverview ? editorFeatures : editorGeneral;
      if (defaultEditor && !defaultEditor.isDestroyed) {
        defaultEditor.commands.focus();
        setActiveEditor(defaultEditor);
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
      (isOverview
        ? [editorFeatures, editorSkills, editorGoals]
        : [editorGeneral]
      ).filter((e): e is Editor => !!e && !e.isDestroyed),
    [isOverview, editorFeatures, editorSkills, editorGoals, editorGeneral]
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
      features: (isOverview ? editorFeatures : editorGeneral) ?? null,
      skills: isOverview ? (editorSkills ?? null) : null,
      goals: isOverview ? (editorGoals ?? null) : null,
    });
  }, [
    number,
    isOverview,
    editorFeatures,
    editorGeneral,
    editorSkills,
    editorGoals,
    register,
  ]);

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
      itemName: editorItemName?.getText() || '',
      oneLineIntro: editorOneLineIntro?.getText() || '',
      editorFeatures: (isOverview ? editorFeatures : editorGeneral) ?? null,
      editorSkills: isOverview ? editorSkills : null,
      editorGoals: isOverview ? editorGoals : null,
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
    <div
      data-toast-anchor
      className="flex h-[756px] w-full flex-col rounded-[12px] border border-gray-100 bg-white"
    >
      <WriteFormHeader number={number} title={title} subtitle={subtitle} />
      <WriteFormToolbar
        activeEditor={activeEditor}
        editorItemName={isOverview ? editorItemName : undefined}
        editorOneLineIntro={isOverview ? editorOneLineIntro : undefined}
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
        <div className="space-y-[24px] px-5 pt-4 pb-[80px]">
          {isOverview ? (
            <OverviewSection
              editorItemName={editorItemName}
              editorOneLineIntro={editorOneLineIntro}
              editorFeatures={editorFeatures}
              editorSkills={editorSkills}
              editorGoals={editorGoals}
              onEditorFocus={setActiveEditor}
            />
          ) : (
            <GeneralSection
              editor={editorGeneral}
              onEditorFocus={setActiveEditor}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default WriteForm;
