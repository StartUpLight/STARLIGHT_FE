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

    const textNodes: JSONNode[] = [];
    const tables: JSONNode[] = [];
    const images: JSONNode[] = [];

    (editorJson.content || []).forEach((node) => {
        if (node.type === 'table') tables.push(node);
        else if (node.type === 'image') images.push(node);
        else textNodes.push(node);
    });

    if (textNodes.length > 0) {
        const markdown = textNodes.map((node) => convertToMarkdown(node)).join('').trim();
        if (markdown) contents.push({ type: 'text', value: markdown } as TextContentItem);
    }

    tables.forEach((tableNode) => {
        const tableData = extractTableData(tableNode);
        if (tableData.rows.length > 0) contents.push({ type: 'table', columns: tableData.columns, rows: tableData.rows });
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


