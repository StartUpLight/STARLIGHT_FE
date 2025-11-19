import { Block, BlockContentItem, TextContentItem, TableContentItem, ImageContentItem } from '@/types/business/business.type';
import { ItemContent } from '@/types/business/business.store.type';
import { JSONNode, JSONMark } from './editorContentMapper';

// 마크다운/인라인 HTML을 파싱하여 JSONNode 배열로 변환
const parseMarkdownText = (text: string): JSONNode[] => {
    if (!text) return [{ type: 'text', text: ' ' }];

    const nodes: JSONNode[] = [];
    let currentIndex = 0;

    // 이미지 마크다운 파싱: ![alt](src)
    const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
    let imageMatch: RegExpExecArray | null;
    const imageMatches: Array<{ start: number; end: number; alt: string; src: string }> = [];

    while ((imageMatch = imageRegex.exec(text)) !== null) {
        imageMatches.push({
            start: imageMatch.index,
            end: imageMatch.index + imageMatch[0].length,
            alt: imageMatch[1] || '',
            src: imageMatch[2] || '',
        });
    }

    // 이미지와 span을 함께 처리하기 위해 모든 매치를 정렬
    const spanRegex = /<span([^>]*)>(.*?)<\/span>/gi;
    let spanMatch: RegExpExecArray | null;
    const spanMatches: Array<{ start: number; end: number; attrs: string; inner: string }> = [];

    while ((spanMatch = spanRegex.exec(text)) !== null) {
        spanMatches.push({
            start: spanMatch.index,
            end: spanMatch.index + spanMatch[0].length,
            attrs: spanMatch[1] || '',
            inner: spanMatch[2] || '',
        });
    }

    // 모든 매치를 시작 위치로 정렬
    const allMatches = [
        ...imageMatches.map(m => ({ ...m, type: 'image' as const })),
        ...spanMatches.map(m => ({ ...m, type: 'span' as const })),
    ].sort((a, b) => a.start - b.start);

    // 매치를 순서대로 처리
    allMatches.forEach((match) => {
        if (match.start > currentIndex) {
            const before = text.substring(currentIndex, match.start);
            if (before) nodes.push({ type: 'text', text: before });
        }

        if (match.type === 'image') {
            nodes.push({
                type: 'image',
                attrs: {
                    src: match.src,
                    alt: match.alt,
                },
            });
        } else if (match.type === 'span') {
            const hasSpell = /class=["'][^"']*spell-error[^"']*["']/i.test(match.attrs);
            const colorMatch = /style=["'][^"']*color\s*:\s*([^;"']+)/i.exec(match.attrs);
            if (hasSpell) {
                nodes.push({ type: 'text', text: match.inner, marks: [{ type: 'spellError' }] as JSONMark[] });
            } else if (colorMatch) {
                const color = colorMatch[1].trim();
                nodes.push({ type: 'text', text: match.inner, marks: [{ type: 'textStyle', attrs: { color } }] as JSONMark[] });
            } else {
                nodes.push({ type: 'text', text: match.inner });
            }
        }

        currentIndex = match.end;
    });

    if (currentIndex < text.length) {
        const remain = text.substring(currentIndex);
        if (remain) nodes.push({ type: 'text', text: remain });
    }

    const applyMarkerAcrossNodes = (srcNodes: JSONNode[], marker: string, mark: JSONMark): JSONNode[] => {
        const out: JSONNode[] = [];
        let open = false;
        let carry: JSONMark[] = [];
        for (const node of srcNodes) {
            if (node.type !== 'text') {
                out.push(node);
                continue;
            }
            let text = node.text || '';
            while (true) {
                const idx = text.indexOf(marker);
                if (idx === -1) break;
                const before = text.slice(0, idx);
                if (before) {
                    const baseMarks = node.marks || [];
                    const combined = open ? [...baseMarks, ...carry] : baseMarks;
                    out.push({ type: 'text', text: before, marks: combined.length ? combined : undefined });
                }
                open = !open;
                if (open) {
                    carry = [...(node.marks || []), mark];
                } else {
                    carry = [];
                }
                text = text.slice(idx + marker.length);
            }
            if (text) {
                const baseMarks = node.marks || [];
                const combined = open ? [...baseMarks, ...carry] : baseMarks;
                out.push({ type: 'text', text, marks: combined.length ? combined : undefined });
            }
        }
        return out;
    };
    let processed = nodes;
    processed = applyMarkerAcrossNodes(processed, '**', { type: 'bold' });
    processed = applyMarkerAcrossNodes(processed, '==', { type: 'highlight', attrs: { color: '#FFF59D' } });
    processed = applyMarkerAcrossNodes(processed, '*', { type: 'italic' });
    processed = applyMarkerAcrossNodes(processed, '`', { type: 'code' });
    return processed.length ? processed : [{ type: 'text', text: ' ' }];
};

// BlockContentItem을 EditorJSON으로 변환
const convertContentItemToEditorJson = (item: BlockContentItem): JSONNode[] => {
    if (item.type === 'text') {
        const text = (item as TextContentItem).value;
        if (!text || text === '') {
            return [{ type: 'paragraph' }];
        }

        const lines = text.split('\n');
        const nodes: JSONNode[] = [];
        let currentBlock: JSONNode | null = null;
        let currentList: JSONNode | null = null;
        let currentListType: 'bulletList' | 'orderedList' | null = null;

        const hasContent = (block: JSONNode | null): block is JSONNode => {
            return block !== null &&
                block.content !== undefined &&
                Array.isArray(block.content) &&
                block.content.length > 0;
        };

        const flushList = () => {
            if (hasContent(currentList)) {
                nodes.push(currentList!);
            }
            currentList = null;
            currentListType = null;
        };

        lines.forEach((line, index) => {
            const isLastLine = index === lines.length - 1;
            const nextLine = !isLastLine ? lines[index + 1] : null;
            const trimmedLine = line.trim();

            if (trimmedLine === '') {
                // 빈 줄: 현재 블록과 리스트 저장 후 새 paragraph 추가
                if (hasContent(currentBlock)) {
                    nodes.push(currentBlock);
                    currentBlock = null;
                }
                flushList();
                nodes.push({ type: 'paragraph', content: [] });
                return;
            }

            // Heading 마크다운 체크 (#, ##, ###)
            const headingMatch = trimmedLine.match(/^(#{1,3})\s+(.+)$/);
            if (headingMatch) {
                // 이전 블록과 리스트 저장
                if (hasContent(currentBlock)) {
                    nodes.push(currentBlock);
                    currentBlock = null;
                }
                flushList();

                const level = headingMatch[1].length;
                const headingText = headingMatch[2];
                const parsedNodes = parseMarkdownText(headingText);

                // heading 노드 생성 (heading은 블록 레벨 요소이므로 hardBreak 추가하지 않음)
                currentBlock = {
                    type: 'heading',
                    attrs: { level },
                    content: parsedNodes.length > 0 ? parsedNodes : [{ type: 'text', text: ' ' }],
                };

                // heading은 바로 저장 (다음 줄이 있으면 다음 반복에서 처리)
                nodes.push(currentBlock);
                currentBlock = null;
                return;
            }

            // OrderedList 마크다운 체크 (1. 2. 3. 등)
            const orderedListMatch = trimmedLine.match(/^(\d+)\.\s+(.+)$/);
            if (orderedListMatch) {
                // 이전 블록 저장
                if (hasContent(currentBlock)) {
                    nodes.push(currentBlock);
                    currentBlock = null;
                }

                // 리스트 타입이 다르면 이전 리스트 저장
                if (currentListType !== 'orderedList') {
                    flushList();
                    currentListType = 'orderedList';
                    currentList = { type: 'orderedList', content: [] };
                }

                const itemText = orderedListMatch[2];
                const parsedNodes = parseMarkdownText(itemText);
                const listItem: JSONNode = {
                    type: 'listItem',
                    content: [{
                        type: 'paragraph',
                        content: parsedNodes.length > 0 ? parsedNodes : [{ type: 'text', text: ' ' }]
                    }],
                };

                if (currentList && currentList.content) {
                    currentList.content.push(listItem);
                }
                return;
            }

            // BulletList 마크다운 체크 (- 또는 *)
            const bulletListMatch = trimmedLine.match(/^[-*]\s+(.+)$/);
            if (bulletListMatch) {
                // 이전 블록 저장
                if (hasContent(currentBlock)) {
                    nodes.push(currentBlock);
                    currentBlock = null;
                }

                // 리스트 타입이 다르면 이전 리스트 저장
                if (currentListType !== 'bulletList') {
                    flushList();
                    currentListType = 'bulletList';
                    currentList = { type: 'bulletList', content: [] };
                }

                const itemText = bulletListMatch[1];
                const parsedNodes = parseMarkdownText(itemText);
                const listItem: JSONNode = {
                    type: 'listItem',
                    content: [{
                        type: 'paragraph',
                        content: parsedNodes.length > 0 ? parsedNodes : [{ type: 'text', text: ' ' }]
                    }],
                };

                if (currentList && currentList.content) {
                    currentList.content.push(listItem);
                }
                return;
            }

            // 리스트가 진행 중이면 리스트 종료
            flushList();

            // 일반 텍스트 줄: paragraph에 추가
            const parsedNodes = parseMarkdownText(line);

            if (!currentBlock) {
                currentBlock = { type: 'paragraph', content: [] };
            }

            if (!currentBlock.content) {
                currentBlock.content = [];
            }

            // 파싱된 노드들을 현재 블록에 추가
            parsedNodes.forEach((node) => {
                if (currentBlock && currentBlock.content) {
                    currentBlock.content.push(node);
                }
            });

            // 다음 줄이 존재하고 비어있지 않다면 'hardBreak' 추가 (Enter 1회 -> 줄바꿈)
            // 단, 다음 줄이 리스트(bulletList 또는 orderedList)인 경우 제외
            if (nextLine !== null && nextLine.trim() !== '') {
                const trimmedNextLine = nextLine.trim();
                const isNextLineList =
                    /^[-*]\s+/.test(trimmedNextLine) ||  // bulletList: - 또는 *로 시작
                    /^\d+\.\s+/.test(trimmedNextLine);   // orderedList: 숫자. 로 시작

                if (!isNextLineList && currentBlock && currentBlock.content) {
                    currentBlock.content.push({ type: 'hardBreak' });
                }
            } else {
                // 다음 줄이 없거나 빈 줄이면 현재 블록 저장
                if (hasContent(currentBlock)) {
                    nodes.push(currentBlock);
                }
                currentBlock = null;
            }
        });

        // 마지막 블록과 리스트 처리: 내용이 있으면 추가
        if (hasContent(currentBlock)) {
            nodes.push(currentBlock);
        }
        flushList();

        return nodes.length > 0 ? nodes : [{ type: 'paragraph' }];
    }
    else if (item.type === 'table') {
        const tableItem = item as TableContentItem;
        const rows: JSONNode[] = [];

        const hasHeader = Array.isArray(tableItem.columns) && tableItem.columns.length > 0;
        if (hasHeader) {
            const headerCells = tableItem.columns.map(col => {
                // 헤더 셀 내용도 마크다운으로 파싱하여 서식 정보 복원
                const colText = String(col || ' ');
                const parsedNodes = parseMarkdownText(colText);
                return {
                    type: 'tableHeader',
                    content: [{
                        type: 'paragraph',
                        content: parsedNodes.length > 0 ? parsedNodes : [{ type: 'text', text: ' ' }],
                    }],
                };
            });
            rows.push({
                type: 'tableRow',
                content: headerCells,
            });
        }

        if (tableItem.rows && tableItem.rows.length > 0) {
            let dataRows = tableItem.rows;
            if (hasHeader) {
                const firstEqualsHeader =
                    Array.isArray(dataRows[0]) &&
                    dataRows[0].length === tableItem.columns.length &&
                    dataRows[0].every((cell, idx) => String(cell ?? '') === String(tableItem.columns[idx] ?? ''));
                if (firstEqualsHeader) {
                    dataRows = dataRows.slice(1);
                }
            }
            dataRows.forEach(row => {
                const cells = row.map(cell => {
                    // 셀 내용을 마크다운으로 파싱하여 서식 정보 복원
                    const cellText = String(cell || ' ');
                    const parsedNodes = parseMarkdownText(cellText);
                    return {
                        type: 'tableCell',
                        content: [{
                            type: 'paragraph',
                            content: parsedNodes.length > 0 ? parsedNodes : [{ type: 'text', text: ' ' }],
                        }],
                    };
                });
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
        const width = typeof imageItem.width === 'number' ? imageItem.width : null;
        const height = typeof imageItem.height === 'number' ? imageItem.height : null;
        const normalizedWidth = width && width > 0 ? width : null;
        const normalizedHeight = height && height > 0 ? height : null;
        return [{
            type: 'image',
            attrs: {
                src: imageItem.src || '',
                alt: imageItem.caption || '',
                width: normalizedWidth,
                height: normalizedHeight,
            },
        }];
    }

    return [{ type: 'paragraph' }];
};

const convertBlockToEditorJson = (block: Block): JSONNode[] => {
    const nodes: JSONNode[] = [];
    block.content.forEach(item => {
        nodes.push(...convertContentItemToEditorJson(item));
    });
    return nodes.length > 0 ? nodes : [{ type: 'paragraph' }];
};

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