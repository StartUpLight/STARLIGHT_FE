import { Block, BlockContentItem, TextContentItem, TableContentItem, ImageContentItem } from '@/types/business/business.type';
import { ItemContent } from '@/types/business/business.store.type';
import { JSONNode, JSONMark } from './editorContentMapper';

// 마크다운/인라인 HTML을 파싱하여 JSONNode 배열로 변환 (간단 버전)
const parseMarkdownText = (text: string): JSONNode[] => {
    if (!text) return [{ type: 'text', text: ' ' }];

    // 1) 인라인 HTML <span> 우선 처리
    //   - <span class="spell-error">...</span> => spellError mark
    //   - <span style="color:...">...</span>   => textStyle mark with color
    const nodes: JSONNode[] = [];
    let currentIndex = 0;
    const spanRegex = /<span([^>]*)>(.*?)<\/span>/gi;
    let spanMatch: RegExpExecArray | null;
    while ((spanMatch = spanRegex.exec(text)) !== null) {
        const start = spanMatch.index;
        const end = start + spanMatch[0].length;
        const attrs = spanMatch[1] || '';
        const inner = spanMatch[2] || '';
        if (start > currentIndex) {
            const before = text.substring(currentIndex, start);
            if (before) nodes.push({ type: 'text', text: before });
        }
        const hasSpell = /class=["'][^"']*spell-error[^"']*["']/i.test(attrs);
        const colorMatch = /style=["'][^"']*color\s*:\s*([^;"']+)/i.exec(attrs);
        if (hasSpell) {
            nodes.push({ type: 'text', text: inner, marks: [{ type: 'spellError' }] as JSONMark[] });
        } else if (colorMatch) {
            const color = colorMatch[1].trim();
            nodes.push({ type: 'text', text: inner, marks: [{ type: 'textStyle', attrs: { color } }] as JSONMark[] });
        } else {
            nodes.push({ type: 'text', text: inner });
        }
        currentIndex = end;
    }
    if (currentIndex < text.length) {
        const remain = text.substring(currentIndex);
        if (remain) nodes.push({ type: 'text', text: remain });
    }

    // 2) 간단 마크다운 처리 (**bold**, *italic*, `code`, ==highlight==)
    const patterns = [
        { regex: /\*\*(.+?)\*\*/g, markType: 'bold' },
        { regex: /\*(.+?)\*/g, markType: 'italic' },
        { regex: /`(.+?)`/g, markType: 'code' },
        { regex: /==(.+?)==/g, markType: 'highlight' },
    ];

    const applyMarkdown = (n: JSONNode): JSONNode[] => {
        if (n.type !== 'text' || n.marks) return [n];
        const src = n.text || '';
        const matches: Array<{ start: number; end: number; text: string; markType: string }> = [];
        patterns.forEach(({ regex, markType }) => {
            let m: RegExpExecArray | null;
            regex.lastIndex = 0;
            while ((m = regex.exec(src)) !== null) {
                matches.push({ start: m.index, end: m.index + m[0].length, text: m[1], markType });
            }
        });
        matches.sort((a, b) => a.start - b.start);
        const filtered: typeof matches = [];
        let last = -1;
        matches.forEach(m => {
            if (m.start >= last) {
                filtered.push(m);
                last = m.end;
            }
        });
        const out: JSONNode[] = [];
        let i = 0;
        filtered.forEach(m => {
            if (m.start > i) {
                const pre = src.substring(i, m.start);
                if (pre) out.push({ type: 'text', text: pre });
            }
            const mark: JSONMark = { type: m.markType };
            if (m.markType === 'highlight') mark.attrs = { color: '#FFF59D' };
            out.push({ type: 'text', text: m.text, marks: [mark] });
            i = m.end;
        });
        if (i < src.length) {
            const tail = src.substring(i);
            if (tail) out.push({ type: 'text', text: tail });
        }
        return out.length ? out : [n];
    };

    const finalNodes: JSONNode[] = [];
    nodes.forEach(n => finalNodes.push(...applyMarkdown(n)));
    return finalNodes.length ? finalNodes : [{ type: 'text', text: ' ' }];
};

// SubSectionType을 number로 변환
export const getNumberFromSubSectionType = (subSectionType: string): string => {
    switch (subSectionType) {
        case 'OVERVIEW_BASIC':
            return '0';
        case 'PROBLEM_BACKGROUND':
            return '1-1';
        case 'PROBLEM_PURPOSE':
            return '1-2';
        case 'PROBLEM_MARKET':
            return '1-3';
        case 'FEASIBILITY_STRATEGY':
            return '2-1';
        case 'FEASIBILITY_MARKET':
            return '2-2';
        case 'GROWTH_MODEL':
            return '3-1';
        case 'GROWTH_FUNDING':
            return '3-2';
        case 'GROWTH_ENTRY':
            return '3-3';
        case 'TEAM_FOUNDER':
            return '4-1';
        case 'TEAM_MEMBERS':
            return '4-2';
        default:
            return '0';
    }
};

// BlockContentItem을 EditorJSON으로 변환
const convertContentItemToEditorJson = (item: BlockContentItem): JSONNode[] => {
    if (item.type === 'text') {
        const text = (item as TextContentItem).value;
        if (!text || text.trim() === '') {
            return [{ type: 'paragraph' }];
        }

        // 마크다운 형식 파싱 (간단한 버전)
        // **bold**, *italic*, `code`, ==highlight== 등을 처리
        const lines = text.split('\n');
        const paragraphs: JSONNode[] = [];
        let currentParagraph: JSONNode = { type: 'paragraph', content: [] };

        lines.forEach((line, index) => {
            if (line.trim() === '') {
                // 빈 줄이면 새 paragraph 시작
                if (currentParagraph.content && currentParagraph.content.length > 0) {
                    paragraphs.push(currentParagraph);
                    currentParagraph = { type: 'paragraph', content: [] };
                }
            } else {
                // 마크다운 파싱 (간단 버전)
                const textNodes = parseMarkdownText(line);
                if (currentParagraph.content) {
                    currentParagraph.content.push(...textNodes);
                }
            }
        });

        // 마지막 paragraph 추가
        if (currentParagraph.content && currentParagraph.content.length > 0) {
            paragraphs.push(currentParagraph);
        }

        return paragraphs.length > 0 ? paragraphs : [{ type: 'paragraph' }];
    } else if (item.type === 'table') {
        const tableItem = item as TableContentItem;
        const rows: JSONNode[] = [];

        // 헤더 행
        if (tableItem.columns && tableItem.columns.length > 0) {
            const headerCells = tableItem.columns.map(col => ({
                type: 'tableHeader',
                content: [{
                    type: 'paragraph',
                    content: [{ type: 'text', text: col || ' ' }],
                }],
            }));
            rows.push({
                type: 'tableRow',
                content: headerCells,
            });
        }

        // 데이터 행
        if (tableItem.rows && tableItem.rows.length > 0) {
            tableItem.rows.forEach(row => {
                const cells = row.map(cell => ({
                    type: 'tableCell',
                    content: [{
                        type: 'paragraph',
                        content: [{ type: 'text', text: String(cell || ' ') }],
                    }],
                }));
                rows.push({
                    type: 'tableRow',
                    content: cells,
                });
            });
        }

        return [{
            type: 'table',
            content: rows,
        }];
    } else if (item.type === 'image') {
        const imageItem = item as ImageContentItem;
        return [{
            type: 'image',
            attrs: {
                src: imageItem.src || '',
                alt: imageItem.caption || '',
            },
        }];
    }

    return [{ type: 'paragraph' }];
};

// Block을 EditorJSON으로 변환
const convertBlockToEditorJson = (block: Block): JSONNode[] => {
    const nodes: JSONNode[] = [];
    block.content.forEach(item => {
        nodes.push(...convertContentItemToEditorJson(item));
    });
    return nodes.length > 0 ? nodes : [{ type: 'paragraph' }];
};

// API 응답의 Block[]을 ItemContent로 변환
export const convertResponseToItemContent = (
    blocks: Block[],
    checks?: boolean[]
): ItemContent => {
    const content: ItemContent = {
        checks: checks || [],
    };

    // number === '0'인 경우 특별 처리
    // 블록의 meta.title을 기준으로 분류
    blocks.forEach(block => {
        const title = block.meta?.title || '';
        const editorNodes = convertBlockToEditorJson(block);
        const editorJson: JSONNode = {
            type: 'doc',
            content: editorNodes,
        };

        if (title === '아이템명') {
            const textItem = block.content.find(c => c.type === 'text') as TextContentItem | undefined;
            content.itemName = textItem?.value || '';
        } else if (title === '아이템 한줄 소개') {
            const textItem = block.content.find(c => c.type === 'text') as TextContentItem | undefined;
            content.oneLineIntro = textItem?.value || '';
        } else if (title === '아이템 / 아이디어 주요 기능') {
            content.editorFeatures = editorJson;
        } else if (title === '관련 보유 기술') {
            content.editorSkills = editorJson;
        } else if (title === '창업 목표') {
            content.editorGoals = editorJson;
        } else {
            // 일반 항목의 경우
            content.editorContent = editorJson;
        }
    });

    return content;
};

