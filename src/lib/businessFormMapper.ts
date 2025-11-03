import { ItemContent } from '@/types/business/business.store.type';
import { Block, BlockContentItem, BusinessPlanSubsectionRequest, TextContentItem } from '@/types/business/business.type';
import sections from '@/data/sidebar.json';

const getSubSectionTypeFromNumber = (number: string): string => {
    switch (number) {
        case '0':
            return 'OVERVIEW_BASIC';
        case '1-1':
            return 'PROBLEM_BACKGROUND';
        case '1-2':
            return 'PROBLEM_PURPOSE';
        case '1-3':
            return 'PROBLEM_MARKET';
        case '2-1':
            return 'FEASIBILITY_STRATEGY';
        case '2-2':
            return 'FEASIBILITY_MARKET';
        case '3-1':
            return 'GROWTH_MODEL';
        case '3-2':
            return 'GROWTH_FUNDING';
        case '3-3':
            return 'GROWTH_ENTRY';
        case '4-1':
            return 'TEAM_FOUNDER';
        case '4-2':
            return 'TEAM_MEMBERS';
        default:
            return 'OVERVIEW_BASIC';
    }
};

// checklist에서 checks 배열 추출
const getChecks = (number: string): boolean[] => {
    const allItems = sections.flatMap((section) => section.items);
    const item = allItems.find((item) => item.number === number);
    if (!item || !item.checklist) return [];
    return item.checklist.map((check) => check.checked || false);
};

// TipTap JSON을 마크다운 형식으로 변환
type JSONAttrs = { [key: string]: string | number | boolean | null | undefined };
type JSONMark = { type: string; attrs?: JSONAttrs };
type JSONNode = { type?: string; text?: string; marks?: JSONMark[]; attrs?: JSONAttrs; content?: JSONNode[] };

const convertToMarkdown = (node: JSONNode | null | undefined): string => {
    if (!node) return '';

    // 텍스트 노드 처리 (마크 적용)
    if (node.type === 'text') {
        let text = node.text || '';
        const marks = node.marks || [];

        // 마크를 역순으로 적용 (마지막이 가장 바깥쪽)
        marks.forEach((mark) => {
            switch (mark.type) {
                case 'bold':
                    text = `**${text}**`;
                    break;
                case 'italic':
                    text = `*${text}*`;
                    break;
                case 'highlight':
                    text = `==${text}==`;
                    break;
                case 'textStyle':
                    break;
                case 'code':
                    text = `\`${text}\``;
                    break;
                default:
                    break;
            }
        });
        return text;
    }

    if (node.type === 'paragraph') {
        const content = (node.content || []).map((child) => convertToMarkdown(child)).join('');
        return content ? `${content}\n\n` : '';
    }

    if (node.type === 'heading') {
        const level = (node.attrs?.level as number) || 1;
        const content = (node.content || []).map((child) => convertToMarkdown(child)).join('');
        return content ? `${'#'.repeat(level)} ${content.trim()}\n\n` : '';
    }

    if (node.type === 'bulletList' || node.type === 'orderedList') {
        const items = (node.content || [])
            .map((item, index: number) => {
                const itemContent = (item.content || []).map((child) => convertToMarkdown(child)).join('').trim();
                const prefix = node.type === 'orderedList' ? `${index + 1}. ` : '- ';
                return itemContent ? `${prefix}${itemContent}\n` : '';
            })
            .join('');
        return items ? `${items}\n` : '';
    }

    if (node.type === 'table') {
        const rows: string[] = [];

        (node.content || []).forEach((row, rowIndex: number) => {
            if (row.type === 'tableRow') {
                const cells: string[] = [];
                (row.content || []).forEach((cell) => {
                    if (cell.type === 'tableCell' || cell.type === 'tableHeader') {
                        const cellContent = (cell.content || []).map((child) => convertToMarkdown(child)).join('').trim().replace(/\n/g, ' ');
                        cells.push(cellContent);
                    }
                });

                if (cells.length > 0) {
                    if (rowIndex === 0 && row.content?.[0]?.type === 'tableHeader') {
                        rows.push(`| ${cells.join(' | ')} |`);
                        rows.push(`| ${cells.map(() => '---').join(' | ')} |`);
                    } else {
                        rows.push(`| ${cells.join(' | ')} |`);
                    }
                }
            }
        });

        return rows.length > 0 ? `${rows.join('\n')}\n\n` : '';
    }

    if (node.type === 'image') {
        const src = node.attrs?.src || '';
        const alt = node.attrs?.alt || node.attrs?.title || '';
        return src ? `![${alt}](${src})\n\n` : '';
    }

    if (node.content && Array.isArray(node.content)) {
        return node.content.map((child) => convertToMarkdown(child)).join('');
    }

    return '';
};

// TipTap JSON을 BlockContentItem 배열로 변환
const convertEditorJsonToContent = (editorJson: { content?: JSONNode[] } | null): BlockContentItem[] => {
    if (!editorJson || !Array.isArray(editorJson.content)) return [];

    const contents: BlockContentItem[] = [];

    const extractTableData = (tableNode: JSONNode) => {
        const rows: string[][] = [];
        let columns: string[] = [];

        if (tableNode.content && Array.isArray(tableNode.content)) {
            tableNode.content.forEach((row, rowIndex: number) => {
                if (row.type === 'tableRow') {
                    const rowData: string[] = [];
                    if (row.content && Array.isArray(row.content)) {
                        row.content.forEach((cell) => {
                            if (cell.type === 'tableCell' || cell.type === 'tableHeader') {
                                const cellContent = (cell.content || []).map((child) => convertToMarkdown(child)).join('').trim();
                                rowData.push(cellContent);

                                if (rowIndex === 0 && cell.type === 'tableHeader') {
                                    columns.push(cellContent);
                                }
                            }
                        });
                    }
                    if (rowData.length > 0) {
                        rows.push(rowData);
                    }
                }
            });
        }

        if (columns.length === 0 && rows.length > 0) {
            columns = rows[0] || [];
        }

        return { columns, rows };
    };

    const textNodes: JSONNode[] = [];
    const tables: JSONNode[] = [];
    const images: JSONNode[] = [];

    (editorJson.content || []).forEach((node) => {
        if (node.type === 'table') {
            tables.push(node);
        } else if (node.type === 'image') {
            images.push(node);
        } else {
            textNodes.push(node);
        }
    });

    if (textNodes.length > 0) {
        const markdown = textNodes.map((node) => convertToMarkdown(node)).join('').trim();

        if (markdown) {
            contents.push({
                type: 'text',
                value: markdown,
            });
        }
    }

    tables.forEach((tableNode) => {
        const tableData = extractTableData(tableNode);
        if (tableData.rows.length > 0) {
            contents.push({ type: 'table', columns: tableData.columns, rows: tableData.rows });
        }
    });

    images.forEach((imageNode) => {
        contents.push({
            type: 'image',
            src: (imageNode.attrs?.src as string) || '',
            caption: (imageNode.attrs?.alt as string) || (imageNode.attrs?.title as string) || '',
        });
    });

    return contents.length > 0 ? contents : [{ type: 'text', value: '' } as TextContentItem];
};

// JSON으로부터 블록 생성 (저장된 데이터용)
const createBlockForSectionFromJson = (
    title: string,
    editorJson: { content?: JSONNode[] } | null
): Block => {
    if (!editorJson) {
        return {
            meta: {
                title,
            },
            content: [
                {
                    type: 'text',
                    value: '',
                } as TextContentItem,
            ],
        };
    }

    const content = convertEditorJsonToContent(editorJson);

    return {
        meta: {
            title,
        },
        content: content.length > 0 ? content : [{ type: 'text', value: '' } as TextContentItem],
    };
};

// JSON 데이터로부터 API 요청 body 생성 (전역 저장용)
export const createSaveRequestBodyFromJson = (
    number: string,
    title: string,
    itemName: string,
    oneLineIntro: string,
    editorFeaturesJson: { content?: JSONNode[] } | null,
    editorSkillsJson: { content?: JSONNode[] } | null,
    editorGoalsJson: { content?: JSONNode[] } | null,
    editorContentJson?: { content?: JSONNode[] } | null
): BusinessPlanSubsectionRequest => {
    const subSectionType = getSubSectionTypeFromNumber(number);
    const checks = getChecks(number);

    let blocks: Block[];

    if (number === '0') {
        // 개요 섹션: 여러 블록 생성
        blocks = [];

        if (itemName.trim()) {
            blocks.push({
                meta: { title: '아이템명' },
                content: [{ type: 'text', value: itemName }],
            });
        }

        if (oneLineIntro.trim()) {
            blocks.push({
                meta: { title: '아이템 한줄 소개' },
                content: [{ type: 'text', value: oneLineIntro }],
            });
        }

        if (editorFeaturesJson) {
            const featuresContent = convertEditorJsonToContent(editorFeaturesJson);
            const hasText = featuresContent.some((ci) => ci.type !== 'text' || (ci as TextContentItem).value.trim() !== '');
            if (hasText) {
                blocks.push({
                    meta: { title: '아이템 / 아이디어 주요 기능' },
                    content: featuresContent,
                });
            }
        }

        if (editorSkillsJson) {
            const skillsContent = convertEditorJsonToContent(editorSkillsJson);
            const hasText = skillsContent.some((ci) => ci.type !== 'text' || (ci as TextContentItem).value.trim() !== '');
            if (hasText) {
                blocks.push({
                    meta: { title: '관련 보유 기술' },
                    content: skillsContent,
                });
            }
        }

        if (editorGoalsJson) {
            const goalsContent = convertEditorJsonToContent(editorGoalsJson);
            const hasText = goalsContent.some((ci) => ci.type !== 'text' || (ci as TextContentItem).value.trim() !== '');
            if (hasText) {
                blocks.push({
                    meta: { title: '창업 목표' },
                    content: goalsContent,
                });
            }
        }
    } else {
        // 일반 섹션: 단일 블록 생성
        const block = createBlockForSectionFromJson(title, editorContentJson || null);
        // 빈 블록이 아니면 추가
        if (block.content && block.content.length > 0) {
            // content에서 빈 value 제거
            const filteredContent = block.content.filter((ci) => ci.type !== 'text' || (ci as TextContentItem).value.trim() !== '');

            // 필터링 후에도 내용이 있으면 블록 추가
            if (filteredContent.length > 0) {
                blocks = [{
                    ...block,
                    content: filteredContent,
                }];
            } else {
                blocks = [];
            }
        } else {
            blocks = [];
        }
    }

    // blocks에서 빈 content 제거 및 content 내부의 빈 value 제거
    const filteredBlocks = blocks
        .map((block): Block | null => {
            // content에서 빈 value 제거
            const filteredContent = (block.content || []).filter((ci) => ci.type !== 'text' || (ci as TextContentItem).value.trim() !== '');

            // 필터링 후 내용이 있는 블록만 반환
            if (filteredContent.length > 0) {
                return {
                    ...block,
                    content: filteredContent,
                };
            }
            return null;
        })
        .filter((block): block is Block => block !== null);

    return {
        subSectionType,
        checks,
        meta: {
            author: 'string',
            createdAt: '1362-64-41',
        },
        blocks: filteredBlocks,
    };
};

// 단순 래퍼: 한 객체로 받아 바로 subsection 요청 바디 생성
export const buildSubsectionRequest = (
    number: string,
    title: string,
    content: ItemContent
) => {
    return createSaveRequestBodyFromJson(
        number,
        title,
        content.itemName || '',
        content.oneLineIntro || '',
        content.editorFeatures as { content?: JSONNode[] } | null,
        content.editorSkills as { content?: JSONNode[] } | null,
        content.editorGoals as { content?: JSONNode[] } | null,
        content.editorContent as { content?: JSONNode[] } | null
    );
};


