'use client';
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useEditor } from '@tiptap/react';
import { Editor, JSONContent } from '@tiptap/core';
import {
  createEditorFeaturesConfig,
  createEditorSkillsConfig,
  createEditorGoalsConfig,
  createEditorItemNameConfig,
  createEditorOneLineIntroConfig,
  createEditorGeneralConfig,
} from '@/lib/business/editor/editorConstants';
import { useBusinessStore } from '@/store/business.store';
import { useSpellCheckStore } from '@/store/spellcheck.store';
import { useEditorStore } from '@/store/editor.store';
import { useSpellCheck } from '@/hooks/mutation/useSpellCheck';
import { SpellPayload } from '@/lib/business/postSpellCheck';
import { applySpellHighlights, clearSpellErrors } from '@/util/spellMark';
import { clearFixedCorrections } from '@/util/spellReplace';
import { mapSpellResponse } from '@/types/business/business.type';
import WriteFormHeader from './editor/WriteFormHeader';
import WriteFormToolbar from './editor/WriteFormToolbar';
import OverviewSection from './editor/OverviewSection';
import GeneralSection from './editor/GeneralSection';

const WriteForm = ({
  number = '0',
  title = '개요',
  subtitle = '구성원의 담당업무, 사업화와 관련하여 보유한 전문성(기술력, 노하우) 위주로 작성.',
}: {
  number?: string;
  title?: string;
  subtitle?: string;
}) => {
  const isOverview = number === '0';

  // 에디터 인스턴스 생성
  const editorFeatures = useEditor(createEditorFeaturesConfig());
  const editorSkills = useEditor(createEditorSkillsConfig());
  const editorGoals = useEditor(createEditorGoalsConfig());
  const editorItemName = useEditor(createEditorItemNameConfig());
  const editorOneLineIntro = useEditor(createEditorOneLineIntroConfig());
  const editorGeneral = useEditor(createEditorGeneralConfig());

  const overviewEditors = useMemo(
    () => ({
      itemName: editorItemName,
      oneLineIntro: editorOneLineIntro,
      features: editorFeatures,
      skills: editorSkills,
      goals: editorGoals,
    }),
    [editorItemName, editorOneLineIntro, editorFeatures, editorSkills, editorGoals]
  );

  const defaultEditor = useMemo(
    () => (isOverview ? editorFeatures : editorGeneral),
    [isOverview, editorFeatures, editorGeneral]
  );

  const {
    updateItemContent,
    getItemContent,
    lastSavedTime,
    isSaving,
    saveSingleItem,
    planId,
  } = useBusinessStore();
  const currentContent = useBusinessStore((state) => state.contents[number]);
  const [activeEditor, setActiveEditor] = useState<Editor | null>(null);
  const [grammarActive, setGrammarActive] = useState(false);

  const convertStringToJSONContent = useCallback((text: string): JSONContent => ({
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: [{ type: 'text', text }],
      },
    ],
  }), []);

  const restoreEditorContent = useCallback(
    (editor: Editor | null, content: JSONContent | null | undefined) => {
      if (!editor || editor.isDestroyed) return;
      try {
        if (content) {
          const currentJSON = editor.getJSON();
          const nextJSON = JSON.parse(JSON.stringify(content));
          if (JSON.stringify(currentJSON) === JSON.stringify(nextJSON)) return;
          editor.commands.setContent(nextJSON, false);
        } else {
          const currentJSON = editor.getJSON();
          const isEmpty =
            !currentJSON ||
            !Array.isArray(currentJSON.content) ||
            currentJSON.content.length === 0 ||
            (currentJSON.content.length === 1 &&
              currentJSON.content[0]?.type === 'paragraph' &&
              (!currentJSON.content[0]?.content || currentJSON.content[0]?.content?.length === 0));
          if (!isEmpty) {
            editor.commands.clearContent(false);
          }
        }
      } catch (e) {
        console.error('에디터 내용 복원 실패:', e);
      }
    },
    []
  );

  useEffect(() => {
    const content = getItemContent(number);
    if (isOverview) {
      restoreEditorContent(
        editorItemName,
        content.itemName ? (typeof content.itemName === 'string' ? convertStringToJSONContent(content.itemName) : content.itemName) : null
      );
      restoreEditorContent(
        editorOneLineIntro,
        content.oneLineIntro ? (typeof content.oneLineIntro === 'string' ? convertStringToJSONContent(content.oneLineIntro) : content.oneLineIntro) : null
      );
      restoreEditorContent(editorFeatures, content.editorFeatures);
      restoreEditorContent(editorSkills, content.editorSkills);
      restoreEditorContent(editorGoals, content.editorGoals);
    } else {
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
    convertStringToJSONContent,
  ]);

  const debouncedSave = useCallback(async () => {
    if (!planId) return;
    try {
      await saveSingleItem(planId, number);
    } catch (error) {
      console.error('자동 저장 실패:', error);
    }
  }, [planId, number, saveSingleItem]);

  const saveSelection = useCallback((editor: Editor | null) => {
    if (!editor || editor.isDestroyed) return null;
    return { from: editor.state.selection.from, to: editor.state.selection.to };
  }, []);

  const restoreSelection = useCallback(
    (editor: Editor, selection: { from: number; to: number }) => {
      try {
        editor.chain().focus().setTextSelection(selection).run();
      } catch (e) {
        console.error('커서 위치 복원 실패:', e);
      }
    },
    []
  );

  const saveEditorContentToStore = useCallback(() => {
    const primaryEditor = isOverview ? editorFeatures : editorGeneral;
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
  }, [
    isOverview,
    number,
    editorItemName,
    editorOneLineIntro,
    editorFeatures,
    editorGeneral,
    editorSkills,
    editorGoals,
    updateItemContent,
  ]);

  const createUpdateHandler = useCallback(
    (timeoutRef: React.MutableRefObject<NodeJS.Timeout | null>) => {
      return () => {
        const primaryEditor = isOverview ? editorFeatures : editorGeneral;
        const selections = {
          main: saveSelection(primaryEditor),
          skills: saveSelection(editorSkills),
          goals: saveSelection(editorGoals),
          itemName: saveSelection(editorItemName),
          oneLineIntro: saveSelection(editorOneLineIntro),
        };

        saveEditorContentToStore();

        requestAnimationFrame(() => {
          const currentEditor = activeEditor || primaryEditor;
          if (!currentEditor || currentEditor.isDestroyed) return;

          let selection: typeof selections.main = null;
          if (currentEditor === primaryEditor) {
            selection = selections.main;
          } else if (currentEditor === editorSkills) {
            selection = selections.skills;
          } else if (currentEditor === editorGoals) {
            selection = selections.goals;
          } else if (currentEditor === editorItemName) {
            selection = selections.itemName;
          } else if (currentEditor === editorOneLineIntro) {
            selection = selections.oneLineIntro;
          }

          if (selection) restoreSelection(currentEditor, selection);
        });

        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(debouncedSave, 300);
      };
    },
    [
      isOverview,
      editorFeatures,
      editorGeneral,
      editorSkills,
      editorGoals,
      editorItemName,
      editorOneLineIntro,
      saveEditorContentToStore,
      activeEditor,
      saveSelection,
      restoreSelection,
      debouncedSave,
    ]
  );

  const timeoutRefs = useRef({
    main: null as NodeJS.Timeout | null,
    skills: null as NodeJS.Timeout | null,
    goals: null as NodeJS.Timeout | null,
    itemName: null as NodeJS.Timeout | null,
    oneLineIntro: null as NodeJS.Timeout | null,
  });

  const registerEditorListener = useCallback(
    (
      editor: Editor | null,
      timeoutKey: keyof typeof timeoutRefs.current
    ): (() => void) | null => {
      if (!editor) return null;
      const timeoutRef = { current: timeoutRefs.current[timeoutKey] };
      const handler = createUpdateHandler(timeoutRef);
      editor.on('update', handler);
      timeoutRefs.current[timeoutKey] = timeoutRef.current;
      return () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        editor.off('update', handler);
      };
    },
    [createUpdateHandler]
  );

  useEffect(() => {
    const mainEditor = isOverview ? editorFeatures : editorGeneral;
    if (!mainEditor) return;

    const cleanups: (() => void)[] = [
      registerEditorListener(mainEditor, 'main'),
      isOverview ? registerEditorListener(overviewEditors.itemName, 'itemName') : null,
      isOverview ? registerEditorListener(overviewEditors.oneLineIntro, 'oneLineIntro') : null,
      isOverview ? registerEditorListener(overviewEditors.skills, 'skills') : null,
      isOverview ? registerEditorListener(overviewEditors.goals, 'goals') : null,
    ].filter((cleanup): cleanup is () => void => cleanup !== null);

    return () => cleanups.forEach((cleanup) => cleanup());
  }, [
    isOverview,
    editorFeatures,
    editorGeneral,
    overviewEditors,
    registerEditorListener,
  ]);

  // 맞춤법 검사
  const { openPanel, setLoading, setItems, reset: resetSpell } = useSpellCheckStore();
  const { mutate: spellcheck } = useSpellCheck();
  const spellChecking = useSpellCheckStore((s) => s.loading);
  const items = useSpellCheckStore((s) => s.items);
  const register = useEditorStore((s) => s.register);

  const editors = useMemo(
    () =>
      (isOverview ? [editorFeatures, editorSkills, editorGoals] : [editorGeneral]).filter(
        (e): e is Editor => !!e && !e.isDestroyed
      ),
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
  }, [number, isOverview, editorFeatures, editorGeneral, editorSkills, editorGoals, register]);

  useEffect(() => {
    resetSpell();
    if (!editors.length) return;
    return resetSpellVisuals(editors);
  }, [number, editors, resetSpell, resetSpellVisuals]);

  const handleSpellCheckClick = () => {
    setGrammarActive((v) => !v);
    openPanel();
    if (editors.length) resetSpellVisuals(editors);

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
        defaultEditor={defaultEditor}
        onActiveEditorChange={setActiveEditor}
        onSpellCheckClick={handleSpellCheckClick}
        grammarActive={grammarActive}
        spellChecking={spellChecking}
        isSaving={isSaving}
        lastSavedTime={lastSavedTime}
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
