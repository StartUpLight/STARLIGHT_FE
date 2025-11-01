import { Editor } from '@tiptap/react';
import sections from '@/data/sidebar.json';

// sectionName 매핑
const getSectionName = (number: string): string => {
    if (number === '0') return 'OVERVIEW';
    if (number.startsWith('1-')) return 'PROBLEM_RECOGNITION';
    if (number.startsWith('2-')) return 'FEASIBILITY';
    if (number.startsWith('3-')) return 'GROWTH_STRATEGY';
    if (number.startsWith('4-')) return 'TEAM_COMPETENCE';
    return 'OVERVIEW';
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
                    // 마크다운 표준에는 없지만 ==text== 형식 사용 (GFM)
                    text = `==${text}==`;
                    break;
                case 'textStyle':
                    // 색상은 마크다운에서 지원 안 함, 텍스트만 유지
                    // 필요시 HTML 형식으로: <span style="color:${mark.attrs?.color}">${text}</span>
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

    // 블록 노드 처리
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

    // 기타 노드는 재귀적으로 처리
    if (node.content && Array.isArray(node.content)) {
        return node.content.map((child: any) => convertToMarkdown(child)).join('');
    }

    return '';
};

// TipTap JSON을 API content 형식으로 변환 (마크다운 사용)
export const convertEditorJsonToContent = (editorJson: any): any[] => {
    if (!editorJson || !editorJson.content) return [];

    const contents: any[] = [];

    // 표 추출 함수
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

    // 표와 이미지를 제외한 노드만 마크다운으로 변환
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

    // 텍스트 노드를 마크다운으로 변환
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

    // 표는 별도로 추가
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

    // 이미지는 별도로 추가
    images.forEach((imageNode: any) => {
        contents.push({
            type: 'image',
            src: imageNode.attrs?.src || '',
            caption: imageNode.attrs?.alt || imageNode.attrs?.title || '',
        });
    });

    return contents.length > 0 ? contents : [{ type: 'text', value: '' }];
};

// 전체 블록 생성 (개요 섹션의 경우 여러 블록)
const createBlocksForOverview = (
    itemName: string,
    oneLineIntro: string,
    editorFeatures: Editor | null,
    editorSkills: Editor | null,
    editorGoals: Editor | null
) => {
    const blocks: any[] = [];

    // 아이템명 블록
    if (itemName.trim()) {
        blocks.push({
            meta: {
                title: '아이템명',
            },
            content: [
                {
                    type: 'text',
                    value: itemName,
                },
            ],
        });
    }

    // 아이템 한줄 소개 블록
    if (oneLineIntro.trim()) {
        blocks.push({
            meta: {
                title: '아이템 한줄 소개',
            },
            content: [
                {
                    type: 'text',
                    value: oneLineIntro,
                },
            ],
        });
    }

    // 아이템 / 아이디어 주요 기능 블록
    if (editorFeatures && !editorFeatures.isDestroyed) {
        const featuresJson = editorFeatures.getJSON();
        const featuresContent = convertEditorJsonToContent(featuresJson);
        if (featuresContent.length > 0 && featuresContent[0].value !== '') {
            blocks.push({
                meta: {
                    title: '아이템 / 아이디어 주요 기능',
                },
                content: featuresContent,
            });
        }
    }

    // 관련 보유 기술 블록
    if (editorSkills && !editorSkills.isDestroyed) {
        const skillsJson = editorSkills.getJSON();
        const skillsContent = convertEditorJsonToContent(skillsJson);
        if (skillsContent.length > 0 && skillsContent[0].value !== '') {
            blocks.push({
                meta: {
                    title: '관련 보유 기술',
                },
                content: skillsContent,
            });
        }
    }

    // 창업 목표 블록
    if (editorGoals && !editorGoals.isDestroyed) {
        const goalsJson = editorGoals.getJSON();
        const goalsContent = convertEditorJsonToContent(goalsJson);
        if (goalsContent.length > 0 && goalsContent[0].value !== '') {
            blocks.push({
                meta: {
                    title: '창업 목표',
                },
                content: goalsContent,
            });
        }
    }

    return blocks;
};

// 일반 섹션의 블록 생성
const createBlockForSection = (
    title: string,
    editor: Editor | null
) => {
    if (!editor || editor.isDestroyed) {
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

    const editorJson = editor.getJSON();
    const content = convertEditorJsonToContent(editorJson);

    return {
        meta: {
            title,
        },
        content: content.length > 0 ? content : [{ type: 'text', value: '' }],
    };
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

// API 요청 body 생성
export const createSaveRequestBody = (
    number: string,
    title: string,
    itemName: string,
    oneLineIntro: string,
    editorFeatures: Editor | null,
    editorSkills: Editor | null,
    editorGoals: Editor | null
) => {
    const sectionName = getSectionName(number);
    const checks = getChecks(number);

    let blocks: any[];

    if (number === '0') {
        // 개요 섹션: 여러 블록 생성
        blocks = createBlocksForOverview(
            itemName,
            oneLineIntro,
            editorFeatures,
            editorSkills,
            editorGoals
        );
    } else {
        // 일반 섹션: 단일 블록 생성
        blocks = [
            createBlockForSection(title, editorFeatures),
        ];
    }

    return {
        sectionName,
        checks,
        meta: {
            author: 'string',
            createdAt: '1362-64-41',
        },
        blocks,
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
    const sectionName = getSectionName(number);
    const checks = getChecks(number);

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
        sectionName,
        checks,
        meta: {
            author: 'string',
            createdAt: '1362-64-41',
        },
        blocks: filteredBlocks,
    };
};

// API 호출 함수 (프록시를 통해 호출)
export const saveBusinessPlanSection = async (
    planId: number,
    requestBody: ReturnType<typeof createSaveRequestBody>
) => {
    try {
        const accessToken = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJzdGFyTGlnaHRAZ21haWwuY29tIiwiaWF0IjoxNzYxOTQ2OTc1LCJleHAiOjE3NjE5NTA1NzV9.5prdUSv63Ok7uCd5Am2E6xtoOC7TKzw5CcB34M35rZY'
        // 프록시 API Route를 통해 호출 (CORS 문제 해결)
        const url = `/api/v1/business-plans/${planId}/section`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(
                errorData.error || `API 요청 실패: ${response.status}`
            );
        }

        return await response.json();
    } catch (error) {
        console.error('저장 실패:', error);
        throw error;
    }
};

