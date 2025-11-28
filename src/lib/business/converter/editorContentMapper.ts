import {
    BlockContentItem,
    TextContentItem,
    ImageContentItem,
    TableCellContentItem,
    TableColumnItem,
} from '@/types/business/business.type';

export type JSONAttrValue =
    | string
    | number
    | boolean
    | null
    | undefined
    | (number | null)[];
export type JSONAttrs = { [key: string]: JSONAttrValue };
export type JSONMark = { type: string; attrs?: JSONAttrs };
export type JSONNode = { type?: string; text?: string; marks?: JSONMark[]; attrs?: JSONAttrs; content?: JSONNode[] };

// TipTap JSON 노드를 마크다운 문자열로 변환합니다.
const parseDimension = (value: unknown): number | null => {
    if (typeof value === 'number') {
        return Number.isFinite(value) ? value : null;
    }
    if (typeof value === 'string') {
        const parsed = parseFloat(value);
        return Number.isNaN(parsed) ? null : parsed;
    }
    return null;
};

export const convertToMarkdown = (
    node: JSONNode | null | undefined,
    depth: number = 0
): string => {
    if (!node) return '';
    if (node.type === 'text') {
        let text = node.text || '';
        const marks = node.marks || [];

        // spellError와 textStyle를 먼저 확인
        const spellErrorMark = marks.find((mark) => mark.type === 'spellError');
        const textStyleMark = marks.find((mark) => mark.type === 'textStyle');
        const hasSpellError = !!spellErrorMark;
        const color = textStyleMark?.attrs?.color as string | undefined;
        // #6f55ff는 맞춤법 검사 결과로 적용된 색상이므로 저장하지 않음
        const isSpellCheckColor = color && color.toLowerCase() === '#6f55ff';

        // spellError와 textStyle를 함께 처리
        if (hasSpellError && color && !isSpellCheckColor) {
            // spellError가 있고 원래 색상이 있으면 (맞춤법 검사 결과 색상이 아닌 경우) 함께 저장
            text = `<span class="spell-error" style="color:${color}">${text}</span>`;
        } else if (hasSpellError) {
            // spellError만 있으면 (맞춤법 검사 결과 색상이거나 색상이 없는 경우)
            text = `<span class="spell-error">${text}</span>`;
        } else if (color) {
            // textStyle만 있으면
            text = `<span style="color:${color}">${text}</span>`;
        }

        // 나머지 마크 처리
        marks.forEach((mark) => {
            if (mark.type === 'spellError' || mark.type === 'textStyle') {
                // 이미 위에서 처리했으므로 스킵
                return;
            }

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
                case 'code':
                    text = `\`${text}\``;
                    break;
                default:
                    break;
            }
        });
        return text;
    }

    if (node.type === 'hardBreak') {
        // hardBreak는 paragraph 내부의 줄바꿈 (엔터 1회)
        return '\n';
    }

    if (node.type === 'paragraph') {
        const content = (node.content || []).map((child) => convertToMarkdown(child, depth)).join('');
        return content;
    }

    if (node.type === 'heading') {
        const level = (node.attrs?.level as number) || 1;
        const content = (node.content || []).map((child) => convertToMarkdown(child, depth)).join('');
        return content ? `${'#'.repeat(level)} ${content.trim()}` : '';
    }

    if (node.type === 'bulletList' || node.type === 'orderedList') {
        const indent = '  '.repeat(depth);
        const isOrdered = node.type === 'orderedList';
        const items = (node.content || [])
            .map((item, index: number) => {
                if (!item || item.type !== 'listItem') return '';
                const prefix = isOrdered ? `${index + 1}. ` : '- ';

                const textParts: string[] = [];
                const nestedParts: string[] = [];

                (item.content || []).forEach((child) => {
                    if (!child) return;
                    if (child.type === 'bulletList' || child.type === 'orderedList') {
                        nestedParts.push(convertToMarkdown(child, depth + 1));
                    } else {
                        const value = convertToMarkdown(child, depth + 1).trim();
                        if (value) {
                            textParts.push(value);
                        }
                    }
                });

                const textContent = textParts.join(' ').trim();
                const baseLine = `${indent}${prefix}${textContent}`.trimEnd();
                const nestedContent = nestedParts.length > 0 ? `\n${nestedParts.join('\n')}` : '';

                return baseLine + nestedContent;
            })
            .filter(Boolean);

        return items.length > 0 ? items.join('\n') : '';
    }

    if (node.type === 'table') {
        const rows: string[] = [];
        (node.content || []).forEach((row, rowIndex: number) => {
            if (row.type === 'tableRow') {
                const cells: string[] = [];
                (row.content || []).forEach((cell) => {
                    if (cell.type === 'tableCell' || cell.type === 'tableHeader') {
                        const cellContent = (cell.content || []).map((child) => convertToMarkdown(child, depth)).join('').trim().replace(/\n/g, ' ');
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
        const width = parseDimension(node.attrs?.width);
        const height = parseDimension(node.attrs?.height);
        node.attrs = {
            ...node.attrs,
            width: width ?? undefined,
            height: height ?? undefined,
        };
        return src ? `![${alt}](${src})` : '';
    }

    if (node.content && Array.isArray(node.content)) {
        return node.content.map((child) => convertToMarkdown(child, depth)).join('');
    }
    return '';
};

// TipTap 문서(JSON)를 API 전송용 BlockContentItem 배열로 변환합니다.
const collectInlineImages = (node: JSONNode | undefined, target: ImageContentItem[]) => {
    if (!node) return;

    if (node.type === 'image') {
        const src = (node.attrs?.src as string) || '';
        if (!src) return;
        target.push({
            type: 'image',
            src,
            caption: (node.attrs?.caption as string) || (node.attrs?.alt as string) || (node.attrs?.title as string) || '',
            width: parseDimension(node.attrs?.width),
            height: parseDimension(node.attrs?.height),
        });
        return;
    }

    if (!Array.isArray(node.content)) return;

    node.content.forEach((child) => {
        collectInlineImages(child, target);
    });
};

const splitMarkdownByImages = (
    markdown: string,
    images: ImageContentItem[],
    pushText: (text: string) => void,
    pushImage: (image: ImageContentItem) => void
) => {
    if (!markdown) return;
    const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = imageRegex.exec(markdown)) !== null) {
        const before = markdown.slice(lastIndex, match.index);
        if (before) {
            pushText(before);
        }
        const imageItem = images.shift();
        if (imageItem) {
            pushImage({
                ...imageItem,
                caption: imageItem.caption || match[1] || '',
                src: imageItem.src || match[2],
            });
        } else {
            pushImage({
                type: 'image',
                src: match[2],
                caption: match[1] || '',
                width: null,
                height: null,
            });
        }
        lastIndex = imageRegex.lastIndex;
    }

    const remaining = markdown.slice(lastIndex);
    if (remaining) {
        pushText(remaining);
    }
};

export const convertEditorJsonToContent = (editorJson: { content?: JSONNode[] } | null): BlockContentItem[] => {
    if (!editorJson || !Array.isArray(editorJson.content)) return [];
    const contents: BlockContentItem[] = [];

    const buildCellContentItems = (cellNode: JSONNode): TableCellContentItem['content'] => {
        const items: TableCellContentItem['content'] = [];
        const pushText = (value: string) => {
            items.push({ type: 'text', value } as TextContentItem);
        };
        const pushImage = (image: ImageContentItem) => {
            if (!image.src) return;
            items.push({
                type: 'image',
                src: image.src,
                caption: image.caption || '',
                width: image.width ?? null,
                height: image.height ?? null,
            });
        };

        const serializeNode = (node: JSONNode | undefined) => {
            if (!node) return;
            const inlineImages: ImageContentItem[] = [];
            collectInlineImages(node, inlineImages);
            const markdown = convertToMarkdown(node);
            splitMarkdownByImages(
                markdown,
                inlineImages,
                (text) => pushText(text),
                (image) =>
                    pushImage({
                        type: 'image',
                        src: image.src,
                        caption: image.caption || '',
                        width: image.width ?? null,
                        height: image.height ?? null,
                    })
            );
        };

        if (!Array.isArray(cellNode.content) || cellNode.content.length === 0) {
            pushText('');
            return items;
        }

        cellNode.content.forEach((child) => serializeNode(child));

        return items.length > 0 ? items : [{ type: 'text', value: '' }];
    };

    const extractTableData = (tableNode: JSONNode) => {
        const tableRows: TableCellContentItem[][] = [];
        const firstRow = tableNode.content?.find((row) => row.type === 'tableRow');
        const inferredColumnCount =
            firstRow && Array.isArray(firstRow.content)
                ? firstRow.content.reduce((sum, cell) => sum + (Number(cell.attrs?.colspan) || 1), 0)
                : 0;
        const columnCount = Math.max(1, inferredColumnCount);
        const colwidth = Array.isArray(tableNode.attrs?.colwidth)
            ? (tableNode.attrs?.colwidth as Array<number | null | undefined>)
            : undefined;
        const columns: TableColumnItem[] = Array.from({ length: columnCount }, (_, idx) => {
            const width = colwidth && colwidth[idx] != null ? colwidth[idx] : null;
            return width != null ? { width } : {};
        });
        const rowspanState = new Array(columnCount).fill(0);

        const decrementRowspans = () => {
            for (let i = 0; i < columnCount; i += 1) {
                if (rowspanState[i] > 0) {
                    rowspanState[i] -= 1;
                }
            }
        };

        (tableNode.content || []).forEach((row) => {
            if (row.type !== 'tableRow') {
                return;
            }
            const rowCells: TableCellContentItem[] = [];
            let colIndex = 0;

            const advanceToNextAvailableColumn = () => {
                while (colIndex < columnCount && rowspanState[colIndex] > 0) {
                    colIndex += 1;
                }
            };

            advanceToNextAvailableColumn();

            (row.content || []).forEach((cell) => {
                if (cell.type !== 'tableCell' && cell.type !== 'tableHeader') {
                    return;
                }
                advanceToNextAvailableColumn();
                if (colIndex >= columnCount) {
                    return;
                }
                const colspan = Math.max(1, Number(cell.attrs?.colspan) || 1);
                const rowspan = Math.max(1, Number(cell.attrs?.rowspan) || 1);
                const cellContent = buildCellContentItems(cell);
                const tableCell: TableCellContentItem = {
                    content: cellContent,
                };
                if (colspan > 1) tableCell.colspan = colspan;
                if (rowspan > 1) tableCell.rowspan = rowspan;
                rowCells.push(tableCell);
                const cellColwidth = Array.isArray(cell.attrs?.colwidth)
                    ? (cell.attrs?.colwidth as Array<number | null | undefined>)
                    : undefined;
                for (let i = 0; i < colspan; i += 1) {
                    const columnIdx = colIndex + i;
                    rowspanState[columnIdx] = rowspan > 1 ? rowspan : 0;
                    const widthValue = cellColwidth?.[i];
                    if (
                        typeof widthValue === 'number' &&
                        columns[columnIdx] &&
                        columns[columnIdx].width == null
                    ) {
                        columns[columnIdx].width = widthValue;
                    }
                }
                colIndex += colspan;
            });

            decrementRowspans();
            tableRows.push(rowCells);
        });

        return {
            columns,
            rows: tableRows,
        };
    };

    // 노드의 순서를 유지하면서 처리
    let currentTextNodes: JSONNode[] = [];

    const flushTextNodes = () => {
        if (currentTextNodes.length > 0) {
            const markdownParts: string[] = [];
            const inlineImages: ImageContentItem[] = [];
            currentTextNodes.forEach((node, index) => {
                collectInlineImages(node, inlineImages);
                const content = convertToMarkdown(node);
                markdownParts.push(content);

                // 노드 사이에 줄바꿈 추가
                if (index < currentTextNodes.length - 1) {
                    markdownParts.push('\n');
                }
            });

            const markdown = markdownParts.join('');
            const pushText = (value: string) => {
                if (!value) return;
                contents.push({ type: 'text', value } as TextContentItem);
            };
            const pushImage = (image: ImageContentItem) => {
                if (!image.src) return;
                contents.push({
                    type: 'image',
                    src: image.src,
                    caption: image.caption || '',
                    width: image.width ?? null,
                    height: image.height ?? null,
                });
            };

            splitMarkdownByImages(markdown, inlineImages, pushText, pushImage);
            currentTextNodes = [];
        }
    };

    (editorJson.content || []).forEach((node) => {
        if (node.type === 'table') {
            // 텍스트 노드들을 먼저 처리
            flushTextNodes();
            const tableData = extractTableData(node);
            if (tableData.rows.length > 0) {
                contents.push({ type: 'table', columns: tableData.columns, rows: tableData.rows });
            }
        } else if (node.type === 'image') {
            // 텍스트 노드들을 먼저 처리
            flushTextNodes();
            // 최상위 레벨의 독립적인 이미지
            const widthAttr = parseDimension(node.attrs?.width);
            const heightAttr = parseDimension(node.attrs?.height);
            contents.push({
                type: 'image',
                src: (node.attrs?.src as string) || '',
                caption: (node.attrs?.caption as string) || (node.attrs?.alt as string) || (node.attrs?.title as string) || '',
                width: widthAttr ?? null,
                height: heightAttr ?? null,
            });
        } else {
            // 텍스트 노드 (paragraph, heading 등) - 나중에 한번에 처리
            currentTextNodes.push(node);
        }
    });

    // 마지막 텍스트 노드들 처리
    flushTextNodes();

    return contents.length > 0 ? contents : [{ type: 'text', value: '' } as TextContentItem];
};
