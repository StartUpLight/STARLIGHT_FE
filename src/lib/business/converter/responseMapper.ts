import {
    Block,
    BlockContentItem,
    TextContentItem,
    TableContentItem,
    TableCellContentItem,
    ImageContentItem,
} from '@/types/business/business.type';
import { ItemContent } from '@/types/business/business.store.type';
import { JSONNode, JSONMark, JSONAttrs } from './editorContentMapper';

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

const convertTextValueToNodes = (textValue: string): JSONNode[] => {
    const text = typeof textValue === 'string' ? textValue : '';
    if (!text) return [{ type: 'paragraph' }];

    const lines = text.split('\n');
    const nodes: JSONNode[] = [];
    let currentBlock: JSONNode | null = null;

    type ListStackItem = {
        list: JSONNode;
        listType: 'bulletList' | 'orderedList';
        depth: number;
    };
    const listStack: ListStackItem[] = [];

    const hasContent = (block: JSONNode | null): block is JSONNode =>
        !!block && Array.isArray(block.content) && block.content.length > 0;

    const flushAllLists = () => {
        if (listStack.length === 0) return;
        while (listStack.length > 1) {
            const child = listStack.pop()!;
            const parent = listStack[listStack.length - 1];
            if (parent.list.content && parent.list.content.length > 0) {
                const lastItem = parent.list.content[parent.list.content.length - 1];
                if (lastItem.type === 'listItem' && lastItem.content) {
                    const hasNestedList = lastItem.content.some(
                        (c) => c.type === 'orderedList' || c.type === 'bulletList'
                    );
                    if (!hasNestedList) {
                        lastItem.content.push(child.list);
                    }
                }
            }
        }
        if (listStack.length > 0) {
            nodes.push(listStack[0].list);
            listStack.length = 0;
        }
    };

    const getIndentDepth = (line: string): number => {
        let depth = 0;
        for (let i = 0; i < line.length; i += 1) {
            if (line[i] === ' ') depth += 1;
            else break;
        }
        return Math.floor(depth / 2);
    };

    lines.forEach((line, index) => {
        const isLastLine = index === lines.length - 1;
        const nextLine = !isLastLine ? lines[index + 1] : null;
        const trimmedLine = line.trim();

        if (trimmedLine === '') {
            if (hasContent(currentBlock)) {
                nodes.push(currentBlock);
                currentBlock = null;
            }
            flushAllLists();
            nodes.push({ type: 'paragraph', content: [] });
            return;
        }

        const headingMatch = trimmedLine.match(/^(#{1,3})\s+(.+)$/);
        if (headingMatch) {
            if (hasContent(currentBlock)) {
                nodes.push(currentBlock);
                currentBlock = null;
            }
            flushAllLists();

            const level = headingMatch[1].length;
            const headingText = headingMatch[2];
            const parsedNodes = parseMarkdownText(headingText);
            nodes.push({
                type: 'heading',
                attrs: { level },
                content: parsedNodes.length > 0 ? parsedNodes : [{ type: 'text', text: ' ' }],
            });
            return;
        }

        const orderedListMatch = line.match(/^(\s*)(\d+)\.\s+(.+)$/);
        if (orderedListMatch) {
            if (hasContent(currentBlock)) {
                nodes.push(currentBlock);
                currentBlock = null;
            }

            const depth = getIndentDepth(line);
            const itemText = orderedListMatch[3];
            const parsedNodes = parseMarkdownText(itemText);

            const listItem: JSONNode = {
                type: 'listItem',
                content: [
                    {
                        type: 'paragraph',
                        content: parsedNodes.length > 0 ? parsedNodes : [{ type: 'text', text: ' ' }],
                    },
                ],
            };

            while (listStack.length > 0 && listStack[listStack.length - 1].depth > depth) {
                const child = listStack.pop()!;
                if (listStack.length > 0) {
                    const parent = listStack[listStack.length - 1];
                    if (parent.list.content && parent.list.content.length > 0) {
                        const lastItem = parent.list.content[parent.list.content.length - 1];
                        if (lastItem.type === 'listItem' && lastItem.content) {
                            const hasNestedList = lastItem.content.some(
                                (c) => c.type === 'orderedList' || c.type === 'bulletList'
                            );
                            if (!hasNestedList) {
                                lastItem.content.push(child.list);
                            }
                        }
                    }
                } else {
                    nodes.push(child.list);
                }
            }

            if (listStack.length === 0) {
                flushAllLists();
                const newList: JSONNode = { type: 'orderedList', content: [] };
                listStack.push({ list: newList, listType: 'orderedList', depth });
            } else {
                const topStack = listStack[listStack.length - 1];
                if (topStack.depth < depth) {
                    if (topStack.list.content && topStack.list.content.length > 0) {
                        const lastItem = topStack.list.content[topStack.list.content.length - 1];
                        if (lastItem.type === 'listItem' && lastItem.content) {
                            const existingNestedList = lastItem.content.find(
                                (c) => c.type === 'orderedList' || c.type === 'bulletList'
                            ) as JSONNode | undefined;

                            if (existingNestedList && existingNestedList.type === 'orderedList') {
                                listStack.push({ list: existingNestedList, listType: 'orderedList', depth });
                            } else if (!existingNestedList) {
                                const nestedList: JSONNode = { type: 'orderedList', content: [] };
                                lastItem.content.push(nestedList);
                                listStack.push({ list: nestedList, listType: 'orderedList', depth });
                            }
                        }
                    }
                } else if (topStack.depth === depth && topStack.listType !== 'orderedList') {
                    flushAllLists();
                    const newList: JSONNode = { type: 'orderedList', content: [] };
                    listStack.push({ list: newList, listType: 'orderedList', depth });
                }
            }

            if (listStack.length > 0) {
                const currentListStack = listStack[listStack.length - 1];
                if (
                    currentListStack.depth === depth &&
                    currentListStack.listType === 'orderedList' &&
                    currentListStack.list.content
                ) {
                    currentListStack.list.content.push(listItem);
                }
            }
            return;
        }

        const bulletListMatch = line.match(/^(\s*)[-*]\s+(.+)$/);
        if (bulletListMatch) {
            if (hasContent(currentBlock)) {
                nodes.push(currentBlock);
                currentBlock = null;
            }

            const depth = getIndentDepth(line);
            const itemText = bulletListMatch[2];
            const parsedNodes = parseMarkdownText(itemText);

            const listItem: JSONNode = {
                type: 'listItem',
                content: [
                    {
                        type: 'paragraph',
                        content: parsedNodes.length > 0 ? parsedNodes : [{ type: 'text', text: ' ' }],
                    },
                ],
            };

            while (listStack.length > 0 && listStack[listStack.length - 1].depth > depth) {
                const child = listStack.pop()!;
                if (listStack.length > 0) {
                    const parent = listStack[listStack.length - 1];
                    if (parent.list.content && parent.list.content.length > 0) {
                        const lastItem = parent.list.content[parent.list.content.length - 1];
                        if (lastItem.type === 'listItem' && lastItem.content) {
                            const hasNestedList = lastItem.content.some(
                                (c) => c.type === 'orderedList' || c.type === 'bulletList'
                            );
                            if (!hasNestedList) {
                                lastItem.content.push(child.list);
                            }
                        }
                    }
                } else {
                    nodes.push(child.list);
                }
            }
            if (listStack.length === 0) {
                flushAllLists();
                const newList: JSONNode = { type: 'bulletList', content: [] };
                listStack.push({ list: newList, listType: 'bulletList', depth });
            } else {
                const topStack = listStack[listStack.length - 1];
                if (topStack.depth < depth) {
                    if (topStack.list.content && topStack.list.content.length > 0) {
                        const lastItem = topStack.list.content[topStack.list.content.length - 1];
                        if (lastItem.type === 'listItem' && lastItem.content) {
                            const existingNestedList = lastItem.content.find(
                                (c) => c.type === 'bulletList' || c.type === 'orderedList'
                            ) as JSONNode | undefined;

                            if (existingNestedList && existingNestedList.type === 'bulletList') {
                                listStack.push({ list: existingNestedList, listType: 'bulletList', depth });
                            } else if (!existingNestedList) {
                                const nestedList: JSONNode = { type: 'bulletList', content: [] };
                                lastItem.content.push(nestedList);
                                listStack.push({ list: nestedList, listType: 'bulletList', depth });
                            }
                        }
                    }
                } else if (topStack.depth === depth && topStack.listType !== 'bulletList') {
                    flushAllLists();
                    const newList: JSONNode = { type: 'bulletList', content: [] };
                    listStack.push({ list: newList, listType: 'bulletList', depth });
                }
            }

            if (listStack.length > 0) {
                const currentListStack = listStack[listStack.length - 1];
                if (
                    currentListStack.depth === depth &&
                    currentListStack.listType === 'bulletList' &&
                    currentListStack.list.content
                ) {
                    currentListStack.list.content.push(listItem);
                }
            }
            return;
        }

        flushAllLists();

        const parsedNodes = parseMarkdownText(line);
        if (hasContent(currentBlock)) {
            nodes.push(currentBlock);
            currentBlock = null;
        }

        currentBlock = {
            type: 'paragraph',
            content: parsedNodes.length > 0 ? parsedNodes : [{ type: 'text', text: ' ' }],
        };

        if (nextLine === null || nextLine.trim() === '') {
            if (hasContent(currentBlock)) {
                nodes.push(currentBlock);
            }
            currentBlock = null;
        }
    });

    if (hasContent(currentBlock)) {
        nodes.push(currentBlock);
    }
    flushAllLists();

    return nodes.length > 0 ? nodes : [{ type: 'paragraph' }];
};

// BlockContentItem을 EditorJSON으로 변환
const convertContentItemToEditorJson = (item: BlockContentItem): JSONNode[] => {
    if (item.type === 'text') {
        const text = (item as TextContentItem).value || '';
        return convertTextValueToNodes(text);
    }
    else if (item.type === 'table') {
        const tableItem = item as TableContentItem;
        const deriveColumnCount = () => {
            if (Array.isArray(tableItem.columns) && tableItem.columns.length > 0) {
                return tableItem.columns.length;
            }
            const rowWidths = (tableItem.rows || []).map((row) =>
                row.reduce(
                    (sum, cell) => sum + Math.max(1, cell?.colspan ? cell.colspan : 1),
                    0
                )
            );
            return rowWidths.length > 0 ? Math.max(...rowWidths) : 0;
        };

        const columnCount = Math.max(1, deriveColumnCount());

        const buildCellNodes = (cell: TableCellContentItem | undefined): JSONNode[] => {
            if (!cell || !Array.isArray(cell.content) || cell.content.length === 0) {
                return [{
                    type: 'paragraph',
                    content: [],
                }];
            }
            const nodes: JSONNode[] = [];
            cell.content.forEach((contentItem) => {
                if (contentItem.type === 'text') {
                    const rawValue = (contentItem.value || '').replace(/\u00a0/g, ' ');
                    if (!rawValue.trim()) {
                        return;
                    }
                    const blockNodes = convertTextValueToNodes(rawValue);
                    nodes.push(...blockNodes);
                } else if (contentItem.type === 'image') {
                    nodes.push({
                        type: 'image',
                        attrs: {
                            src: contentItem.src || '',
                            alt: contentItem.caption || '',
                            width: contentItem.width ?? null,
                            height: contentItem.height ?? null,
                        },
                    });
                }
            });
            return nodes.length > 0 ? nodes : [{
                type: 'paragraph',
                content: [],
            }];
        };

        const tableRows: JSONNode[] = [];
        const rowspanTracker = new Array(columnCount).fill(0);
        const decrementRowspans = () => {
            for (let i = 0; i < columnCount; i += 1) {
                if (rowspanTracker[i] > 0) {
                    rowspanTracker[i] -= 1;
                }
            }
        };

        (tableItem.rows || []).forEach((row) => {
            const cells: JSONNode[] = [];
            let colIndex = 0;

            const advanceToNextAvailableColumn = () => {
                while (colIndex < columnCount && rowspanTracker[colIndex] > 0) {
                    colIndex += 1;
                }
            };

            advanceToNextAvailableColumn();

            row.forEach((cell) => {
                advanceToNextAvailableColumn();
                if (colIndex >= columnCount) {
                    return;
                }

                const colspan = Math.max(1, cell?.colspan ?? 1);
                const rowspan = Math.max(1, cell?.rowspan ?? 1);
                const widthSlice: (number | null)[] = [];
                for (let spanIndex = 0; spanIndex < colspan; spanIndex += 1) {
                    const columnEntry = tableItem.columns?.[colIndex + spanIndex];
                    const widthValue =
                        columnEntry && typeof columnEntry.width === 'number'
                            ? columnEntry.width
                            : null;
                    widthSlice.push(widthValue);
                    rowspanTracker[colIndex + spanIndex] = rowspan > 1 ? rowspan : 0;
                }

                const cellAttrs: Record<string, unknown> = {};
                if (rowspan > 1) cellAttrs.rowspan = rowspan;
                if (colspan > 1) cellAttrs.colspan = colspan;
                if (widthSlice.some((value) => typeof value === 'number')) {
                    cellAttrs.colwidth = widthSlice;
                }

                cells.push({
                    type: 'tableCell',
                    attrs: Object.keys(cellAttrs).length ? cellAttrs as JSONAttrs : undefined,
                    content: buildCellNodes(cell),
                });

                colIndex += colspan;
            });

            decrementRowspans();

            tableRows.push({
                type: 'tableRow',
                content: cells,
            });
        });

        return [
            {
                type: 'table',
                content: tableRows.length > 0 ? tableRows : [{ type: 'tableRow', content: [] }],
            },
        ];
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
            // JSONContent로 저장 (에디터 형식)
            content.itemName = editorJson;
        } else if (title === '아이템 한줄 소개') {
            // JSONContent로 저장 (에디터 형식)
            content.oneLineIntro = editorJson;
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