import { ItemContent } from '@/types/business/business.store.type';
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
const convertToMarkdown = (node: any): string => {
    if (!node) return '';

    // 텍스트 노드 처리 (마크 적용)
    if (node.type === 'text') {
        let text = node.text || '';
        const marks = node.marks || [];

        // 마크를 역순으로 적용 (마지막이 가장 바깥쪽)
        marks.forEach((mark: any) => {
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
        const content = (node.content || [])
            .map((child: any) => convertToMarkdown(child))
            .join('');
        return content ? `${content}\n\n` : '';
    }

    if (node.type === 'heading') {
        const level = node.attrs?.level || 1;
        const content = (node.content || [])
            .map((child: any) => convertToMarkdown(child))
            .join('');
        return content ? `${'#'.repeat(level)} ${content.trim()}\n\n` : '';
    }

    if (node.type === 'bulletList' || node.type === 'orderedList') {
        const items = (node.content || [])
            .map((item: any, index: number) => {
                const itemContent = (item.content || [])
                    .map((child: any) => convertToMarkdown(child))
                    .join('')
                    .trim();
                const prefix = node.type === 'orderedList' ? `${index + 1}. ` : '- ';
                return itemContent ? `${prefix}${itemContent}\n` : '';
            })
            .join('');
        return items ? `${items}\n` : '';
    }

    if (node.type === 'table') {
        const rows: string[] = [];
        let headerRow: string[] | null = null;

        (node.content || []).forEach((row: any, rowIndex: number) => {
            if (row.type === 'tableRow') {
                const cells: string[] = [];
                (row.content || []).forEach((cell: any) => {
                    if (cell.type === 'tableCell' || cell.type === 'tableHeader') {
                        const cellContent = (cell.content || [])
                            .map((child: any) => convertToMarkdown(child))
                            .join('')
                            .trim()
                            .replace(/\n/g, ' ');
                        cells.push(cellContent);
                    }
                });

                if (cells.length > 0) {
                    if (rowIndex === 0 && row.content?.[0]?.type === 'tableHeader') {
                        headerRow = cells;
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
        return node.content.map((child: any) => convertToMarkdown(child)).join('');
    }

    return '';
};

export const convertEditorJsonToContent = (editorJson: any): any[] => {
    if (!editorJson || !editorJson.content) return [];

    const contents: any[] = [];

    const extractTableData = (tableNode: any) => {
        const rows: string[][] = [];
        let columns: string[] = [];

        if (tableNode.content && Array.isArray(tableNode.content)) {
            tableNode.content.forEach((row: any, rowIndex: number) => {
                if (row.type === 'tableRow') {
                    const rowData: string[] = [];
                    if (row.content && Array.isArray(row.content)) {
                        row.content.forEach((cell: any) => {
                            if (cell.type === 'tableCell' || cell.type === 'tableHeader') {
                                const cellContent = (cell.content || [])
                                    .map((child: any) => convertToMarkdown(child))
                                    .join('')
                                    .trim();
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

    const textNodes: any[] = [];
    const tables: any[] = [];
    const images: any[] = [];

    (editorJson.content || []).forEach((node: any) => {
        if (node.type === 'table') {
            tables.push(node);
        } else if (node.type === 'image') {
            images.push(node);
        } else {
            textNodes.push(node);
        }
    });

    if (textNodes.length > 0) {
        const markdown = textNodes
            .map((node: any) => convertToMarkdown(node))
            .join('')
            .trim();

        if (markdown) {
            contents.push({
                type: 'text',
                value: markdown,
            });
        }
    }

    tables.forEach((tableNode: any) => {
        const tableData = extractTableData(tableNode);
        if (tableData.rows.length > 0) {
            contents.push({
                type: 'table',
                columns: tableData.columns,
                rows: tableData.rows,
            });
        }
    });

    images.forEach((imageNode: any) => {
        contents.push({
            type: 'image',
            src: imageNode.attrs?.src || '',
            caption: imageNode.attrs?.alt || imageNode.attrs?.title || '',
        });
    });

    return contents.length > 0 ? contents : [{ type: 'text', value: '' }];
};

// JSON으로부터 블록 생성 (저장된 데이터용)
const createBlockForSectionFromJson = (
    title: string,
    editorJson: any | null
) => {
    if (!editorJson) {
        return {
            meta: {
                title,
            },
            content: [
                {
                    type: 'text',
                    value: '',
                },
            ],
        };
    }

    const content = convertEditorJsonToContent(editorJson);

    return {
        meta: {
            title,
        },
        content: content.length > 0 ? content : [{ type: 'text', value: '' }],
    };
};

// JSON 데이터로부터 API 요청 body 생성 (전역 저장용)
export const createSaveRequestBodyFromJson = (
    number: string,
    title: string,
    itemName: string,
    oneLineIntro: string,
    editorFeaturesJson: any | null,
    editorSkillsJson: any | null,
    editorGoalsJson: any | null,
    editorContentJson?: any | null
) => {
    const subSectionType = getSubSectionTypeFromNumber(number);

    let blocks: any[];

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
            if (featuresContent.length > 0 && featuresContent[0].value !== '') {
                blocks.push({
                    meta: { title: '아이템 / 아이디어 주요 기능' },
                    content: featuresContent,
                });
            }
        }

        if (editorSkillsJson) {
            const skillsContent = convertEditorJsonToContent(editorSkillsJson);
            if (skillsContent.length > 0 && skillsContent[0].value !== '') {
                blocks.push({
                    meta: { title: '관련 보유 기술' },
                    content: skillsContent,
                });
            }
        }

        if (editorGoalsJson) {
            const goalsContent = convertEditorJsonToContent(editorGoalsJson);
            if (goalsContent.length > 0 && goalsContent[0].value !== '') {
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
            const filteredContent = block.content.filter((item: any) => {
                if (item.type === 'text') {
                    return item.value && item.value.trim() !== '';
                }
                // 표나 이미지는 항상 포함
                return true;
            });

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
        .map((block) => {
            // content에서 빈 value 제거
            const filteredContent = (block.content || []).filter((item: any) => {
                if (item.type === 'text') {
                    return item.value && item.value.trim() !== '';
                }
                // 표나 이미지는 항상 포함 (빈 경우도 있을 수 있지만 일단 포함)
                return true;
            });

            // 필터링 후 내용이 있는 블록만 반환
            if (filteredContent.length > 0) {
                return {
                    ...block,
                    content: filteredContent,
                };
            }
            return null;
        })
        .filter((block) => block !== null);

    return {
        subSectionType,
        meta: {
            author: 'string',
            createdAt: '1362-64-41',
        },
        blocks: filteredBlocks,
    };
};

// 단순 래퍼: 한 객체로 받아 바로 subsection 요청 바디 생성
export const buildSubsectionBody = (
    number: string,
    title: string,
    content: ItemContent
) => {
    return createSaveRequestBodyFromJson(
        number,
        title,
        content.itemName || '',
        content.oneLineIntro || '',
        content.editorFeatures || null,
        content.editorSkills || null,
        content.editorGoals || null,
        content.editorContent || null
    );
};


