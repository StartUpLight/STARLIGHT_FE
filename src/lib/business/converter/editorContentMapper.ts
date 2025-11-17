import { BlockContentItem, TextContentItem } from '@/types/business/business.type';

export type JSONAttrs = { [key: string]: string | number | boolean | null | undefined };
export type JSONMark = { type: string; attrs?: JSONAttrs };
export type JSONNode = { type?: string; text?: string; marks?: JSONMark[]; attrs?: JSONAttrs; content?: JSONNode[] };

// TipTap JSON 노드를 마크다운 문자열로 변환합니다.
export const convertToMarkdown = (node: JSONNode | null | undefined): string => {
    if (!node) return '';
    if (node.type === 'text') {
        let text = node.text || '';
        const marks = node.marks || [];
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
                    {
                        const color = mark.attrs?.color as string | undefined;
                        if (color) {
                            text = `<span style="color:${color}">${text}</span>`;
                        }
                    }
                    break;
                case 'code':
                    text = `\`${text}\``;
                    break;
                case 'spellError':
                    // 맞춤법 오류 마크는 클래스 기반 span으로 래핑하여 보존
                    text = `<span class="spell-error">${text}</span>`;
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
        const content = (node.content || []).map((child) => convertToMarkdown(child)).join('');
        return content;
    }

    if (node.type === 'heading') {
        const level = (node.attrs?.level as number) || 1;
        const content = (node.content || []).map((child) => convertToMarkdown(child)).join('');
        return content ? `${'#'.repeat(level)} ${content.trim()}` : '';
    }

    if (node.type === 'bulletList' || node.type === 'orderedList') {
        const contentArray = node.content || [];
        const items = contentArray
            .map((item, index: number) => {
                const itemContent = (item.content || []).map((child) => convertToMarkdown(child)).join('').trim();
                const prefix = node.type === 'orderedList' ? `${index + 1}. ` : '- ';
                const isLast = index === contentArray.length - 1;
                return itemContent ? `${prefix}${itemContent}${isLast ? '' : '\n'}` : '';
            })
            .join('');
        return items ? `${items}` : '';
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
        return src ? `![${alt}](${src})` : '';
    }

    if (node.content && Array.isArray(node.content)) {
        return node.content.map((child) => convertToMarkdown(child)).join('');
    }
    return '';
};

// TipTap 문서(JSON)를 API 전송용 BlockContentItem 배열로 변환합니다.
export const convertEditorJsonToContent = (editorJson: { content?: JSONNode[] } | null): BlockContentItem[] => {
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
                    if (rowData.length > 0) rows.push(rowData);
                }
            });
        }
        if (columns.length === 0 && rows.length > 0) columns = rows[0] || [];
        return { columns, rows };
    };

    // 노드의 순서를 유지하면서 처리
    let currentTextNodes: JSONNode[] = [];

    const flushTextNodes = () => {
        if (currentTextNodes.length > 0) {
            const markdownParts: string[] = [];
            currentTextNodes.forEach((node, index) => {
                const content = convertToMarkdown(node);
                markdownParts.push(content);

                // 노드 사이에 줄바꿈 추가
                if (index < currentTextNodes.length - 1) {
                    markdownParts.push('\n');
                }
            });

            const markdown = markdownParts.join('');
            if (markdown) {
                contents.push({ type: 'text', value: markdown } as TextContentItem);
            }
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
            contents.push({
                type: 'image',
                src: (node.attrs?.src as string) || '',
                caption: (node.attrs?.alt as string) || (node.attrs?.title as string) || '',
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
