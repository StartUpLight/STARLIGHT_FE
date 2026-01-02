import { ItemContent } from '@/types/business/business.store.type';
import { Block, BlockContentItem, BusinessPlanSubsectionRequest, TextContentItem } from '@/types/business/business.type';
import { getSubSectionTypeFromNumber } from './mappers/getSubsection';
import { getChecks } from './mappers/getChecklist';
import { JSONNode, convertEditorJsonToContent } from './converter/editorContentMapper';

// 스토어의 ItemContent를 받아 subsection 요청 바디를 생성합니다(체크리스트 포함).
export const buildSubsectionRequest = (
    number: string,
    title: string,
    content: ItemContent
): BusinessPlanSubsectionRequest => {
    const subSectionType = getSubSectionTypeFromNumber(number);
    const checks = content.checks && content.checks.length > 0 ? content.checks : getChecks(number);

    let blocks: Block[];

    if (number === '0') {
        blocks = [];
        if (content.itemName) {
            // JSONContent인 경우 convertEditorJsonToContent 사용, 문자열인 경우 텍스트로 변환
            const itemNameContent = typeof content.itemName === 'string'
                ? [{ type: 'text', value: content.itemName } as TextContentItem]
                : convertEditorJsonToContent(content.itemName as { content?: JSONNode[] } | null);
            const hasItemNameText = itemNameContent.some((ci) => ci.type !== 'text' || (ci as TextContentItem).value.trim() !== '');
            if (hasItemNameText) {
                blocks.push({ meta: { title: '아이템명' }, content: itemNameContent } as Block);
            }
        }
        if (content.oneLineIntro) {
            // JSONContent인 경우 convertEditorJsonToContent 사용, 문자열인 경우 텍스트로 변환
            const oneLineIntroContent = typeof content.oneLineIntro === 'string'
                ? [{ type: 'text', value: content.oneLineIntro } as TextContentItem]
                : convertEditorJsonToContent(content.oneLineIntro as { content?: JSONNode[] } | null);
            const hasOneLineIntroText = oneLineIntroContent.some((ci) => ci.type !== 'text' || (ci as TextContentItem).value.trim() !== '');
            if (hasOneLineIntroText) {
                blocks.push({ meta: { title: '아이템 한줄 소개' }, content: oneLineIntroContent } as Block);
            }
        }
        if (content.editorFeatures) {
            const featuresContent = convertEditorJsonToContent(content.editorFeatures as { content?: JSONNode[] } | null);
            const hasText = featuresContent.some((ci) => ci.type !== 'text' || (ci as TextContentItem).value.trim() !== '');
            if (hasText) blocks.push({ meta: { title: '아이템 / 아이디어 주요 기능' }, content: featuresContent } as Block);
        }
        if (content.editorSkills) {
            const skillsContent = convertEditorJsonToContent(content.editorSkills as { content?: JSONNode[] } | null);
            const hasText = skillsContent.some((ci) => ci.type !== 'text' || (ci as TextContentItem).value.trim() !== '');
            if (hasText) blocks.push({ meta: { title: '관련 보유 기술' }, content: skillsContent } as Block);
        }
        if (content.editorGoals) {
            const goalsContent = convertEditorJsonToContent(content.editorGoals as { content?: JSONNode[] } | null);
            const hasText = goalsContent.some((ci) => ci.type !== 'text' || (ci as TextContentItem).value.trim() !== '');
            if (hasText) blocks.push({ meta: { title: '창업 목표' }, content: goalsContent } as Block);
        }
    } else {
        const editorContentJson = (content.editorContent || null) as { content?: JSONNode[] } | null;
        const contentItems = editorContentJson
            ? convertEditorJsonToContent(editorContentJson)
            : ([{ type: 'text', value: '' } as TextContentItem] as BlockContentItem[]);
        const filteredContent = contentItems.filter((ci) => ci.type !== 'text' || (ci as TextContentItem).value.trim() !== '');
        blocks = filteredContent.length > 0 ? [{ meta: { title }, content: filteredContent } as Block] : [];
    }

    const filteredBlocks = blocks
        .map((block): Block | null => {
            const filteredContent = (block.content || []).filter((ci) => ci.type !== 'text' || (ci as TextContentItem).value.trim() !== '');
            if (filteredContent.length > 0) return { ...block, content: filteredContent } as Block;
            return null;
        })
        .filter((block): block is Block => block !== null);

    return {
        subSectionType,
        checks,
        meta: { author: 'string', createdAt: '1362-64-41' },
        blocks: filteredBlocks,
    };
};


