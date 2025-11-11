import { EditorJSON } from '@/types/business/business.store.type';

type JSONNode = EditorJSON;

// TipTap JSON 노드를 HTML로 변환합니다.
export const convertToHtml = (node: JSONNode | null | undefined): string => {
    if (!node) return '';

    if (node.type === 'text') {
        let text = node.text || '';
        const marks = node.marks || [];

        marks.forEach((mark) => {
            switch (mark.type) {
                case 'bold':
                    text = `<strong>${text}</strong>`;
                    break;
                case 'italic':
                    text = `<em>${text}</em>`;
                    break;
                case 'highlight':
                    const color = mark.attrs?.color || '#FFF59D';
                    text = `<mark style="background-color: ${color}">${text}</mark>`;
                    break;
                case 'textStyle':
                    const textColor = mark.attrs?.color;
                    if (textColor) {
                        text = `<span style="color: ${textColor}">${text}</span>`;
                    }
                    break;
                case 'code':
                    text = `<code>${text}</code>`;
                    break;
                default:
                    break;
            }
        });
        return text;
    }

    if (node.type === 'paragraph') {
        const content = (node.content || []).map((child) => convertToHtml(child)).join('');
        return content ? `<p>${content}</p>` : '<p><br></p>';
    }

    if (node.type === 'heading') {
        const level = (node.attrs?.level as number) || 1;
        const content = (node.content || []).map((child) => convertToHtml(child)).join('');
        return content ? `<h${level}>${content}</h${level}>` : '';
    }

    if (node.type === 'bulletList') {
        const items = (node.content || [])
            .map((item) => {
                const itemContent = (item.content || []).map((child) => convertToHtml(child)).join('');
                return itemContent ? `<li>${itemContent}</li>` : '';
            })
            .filter(Boolean);
        return items.length > 0 ? `<ul>${items.join('')}</ul>` : '';
    }

    if (node.type === 'orderedList') {
        const items = (node.content || [])
            .map((item) => {
                const itemContent = (item.content || []).map((child) => convertToHtml(child)).join('');
                return itemContent ? `<li>${itemContent}</li>` : '';
            })
            .filter(Boolean);
        return items.length > 0 ? `<ol>${items.join('')}</ol>` : '';
    }

    if (node.type === 'listItem') {
        const content = (node.content || []).map((child) => convertToHtml(child)).join('');
        return content;
    }

    if (node.type === 'table') {
        const rows: string[] = [];
        (node.content || []).forEach((row) => {
            if (row.type === 'tableRow') {
                const cells: string[] = [];
                (row.content || []).forEach((cell) => {
                    if (cell.type === 'tableCell' || cell.type === 'tableHeader') {
                        const cellContent = (cell.content || []).map((child) => convertToHtml(child)).join('');
                        const tag = cell.type === 'tableHeader' ? 'th' : 'td';
                        cells.push(`<${tag}>${cellContent || '&nbsp;'}</${tag}>`);
                    }
                });
                if (cells.length > 0) {
                    rows.push(`<tr>${cells.join('')}</tr>`);
                }
            }
        });
        return rows.length > 0 ? `<table><tbody>${rows.join('')}</tbody></table>` : '';
    }

    if (node.type === 'image') {
        const src = node.attrs?.src || '';
        const alt = node.attrs?.alt || node.attrs?.title || '';
        if (!src) return '';
        return `<img src="${src}" alt="${alt}" style="max-width: 100%; height: auto;" />`;
    }

    if (node.content && Array.isArray(node.content)) {
        return node.content.map((child) => convertToHtml(child)).join('');
    }

    return '';
};

// TipTap 문서(JSON)를 HTML 문자열로 변환합니다.
export const convertEditorJsonToHtml = (editorJson: EditorJSON | null | undefined): string => {
    if (!editorJson || !Array.isArray(editorJson.content)) return '';
    return editorJson.content.map((node) => convertToHtml(node)).join('');
};

