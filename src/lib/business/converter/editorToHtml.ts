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
                    text = `<span style="background-color: ${color}; padding: 0.1em 0;">${text}</span>`;
                    break;
                case 'textStyle': {
                    const textColor = mark.attrs?.color;
                    if (
                        typeof textColor === 'string' &&
                        textColor.toLowerCase() !== '#6f55ff'
                    ) {
                        text = `<span style="color: ${textColor}">${text}</span>`;
                    }
                    break;
                }
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
        if (!content) return '';

        // heading level에 따른 스타일 설정
        let fontSize: string;
        const fontWeight = '600'; // font-semibold
        const lineHeight = '150%';
        const letterSpacing = '-0.02em';

        switch (level) {
            case 1:
                fontSize = '28px'; // ds-heading (--text-3xl)
                break;
            case 2:
                fontSize = '20px'; // ds-title (--text-2xl)
                break;
            case 3:
                fontSize = '18px'; // ds-subtitle (--text-xl)
                break;
            default:
                fontSize = '18px';
                break;
        }

        const style = `font-size: ${fontSize} !important; line-height: ${lineHeight} !important; font-weight: ${fontWeight} !important; letter-spacing: ${letterSpacing} !important; margin: 0.75rem 0 0.5rem 0 !important;`;
        return `<h${level} style="${style}">${content}</h${level}>`;
    }

    // editorToHtml.ts 수정

    if (node.type === 'bulletList') {
        const items = (node.content || [])
            .map((item) => {
                const itemContent = (item.content || [])
                    .map((child) => {
                        // 빈 paragraph는 빈 문자열로 변환 (빈 줄 방지)
                        if (child.type === 'paragraph') {
                            const paragraphContent = (child.content || [])
                                .map((c) => convertToHtml(c))
                                .join('');
                            // 빈 paragraph는 빈 문자열 반환 (불릿 점은 유지되지만 빈 줄은 생성 안 됨)
                            if (!paragraphContent || paragraphContent.trim() === '') {
                                return '';
                            }
                            return `<p>${paragraphContent}</p>`;
                        }
                        return convertToHtml(child);
                    })
                    .join('');

                // 리스트 아이템은 내용이 없어도 유지 (빈 불릿 점 표시)
                return `<li>${itemContent}</li>`;
            })
            .filter(Boolean);
        const listStyle = 'list-style-type: disc; padding-left: 1.5rem; margin: 0 0 0.75rem 0;';
        return items.length > 0 ? `<ul style="${listStyle}">${items.join('')}</ul>` : '';
    }

    if (node.type === 'orderedList') {
        const items = (node.content || [])
            .map((item) => {
                const itemContent = (item.content || [])
                    .map((child) => {
                        if (child.type === 'paragraph') {
                            const paragraphContent = (child.content || [])
                                .map((c) => convertToHtml(c))
                                .join('');
                            if (!paragraphContent || paragraphContent.trim() === '') {
                                return '';
                            }
                            return `<p>${paragraphContent}</p>`;
                        }
                        return convertToHtml(child);
                    })
                    .join('');

                return `<li>${itemContent}</li>`;
            })
            .filter(Boolean);
        const listStyle = 'list-style-type: decimal; padding-left: 1.5rem; margin: 0 0 0.75rem 0;';
        return items.length > 0 ? `<ol style="${listStyle}">${items.join('')}</ol>` : '';
    }

    if (node.type === 'listItem') {
        const content = (node.content || []).map((child) => convertToHtml(child)).join('');
        return content;
    }

    if (node.type === 'table') {
        const rows: string[] = [];
        const columnWidths: Array<number | null> = [];

        const ensureColumnLength = (count: number) => {
            while (columnWidths.length < count) {
                columnWidths.push(null);
            }
        };

        (node.content || []).forEach((row) => {
            if (row.type !== 'tableRow') return;
            const cells: string[] = [];
            let columnIndex = 0;

            (row.content || []).forEach((cell) => {
                if (cell.type !== 'tableCell' && cell.type !== 'tableHeader') return;

                const colspan = Math.max(1, Number(cell.attrs?.colspan) || 1);
                const rowspan = Math.max(1, Number(cell.attrs?.rowspan) || 1);
                ensureColumnLength(columnIndex + colspan);

                const colwidthArray = Array.isArray(cell.attrs?.colwidth)
                    ? (cell.attrs?.colwidth as Array<number | null | undefined>)
                    : undefined;
                colwidthArray?.forEach((widthValue, idx) => {
                    const targetIndex = columnIndex + idx;
                    if (
                        typeof widthValue === 'number' &&
                        (columnWidths[targetIndex] === null ||
                            columnWidths[targetIndex] === undefined)
                    ) {
                        columnWidths[targetIndex] = widthValue;
                    }
                });

                const cellContent = (cell.content || []).map((child) => convertToHtml(child)).join('');
                const tag = cell.type === 'tableHeader' ? 'th' : 'td';
                const attrs: string[] = [];
                if (colspan > 1) attrs.push(`colspan="${colspan}"`);
                if (rowspan > 1) attrs.push(`rowspan="${rowspan}"`);

                const cellStyle = [
                    'border: 1px solid #E5E7EB',
                    'vertical-align: top',
                    'box-sizing: border-box',
                ].join('; ');
                const contentHtml = [
                    '<div style="min-height: 25px; display: flex; flex-direction: column; justify-content: flex-start; height: 100%;">',
                    cellContent,
                    '</div>',
                ].join('');

                const attrString = attrs.filter(Boolean).join(' ').trim();

                cells.push(
                    `<${tag} ${attrString} style="${cellStyle}">${contentHtml}</${tag}>`
                );
                columnIndex += colspan;
            });

            if (cells.length > 0) {
                rows.push(`<tr>${cells.join('')}</tr>`);
            }
        });

        if (rows.length === 0) return '';

        const colgroup =
            columnWidths.length > 0
                ? `<colgroup>${columnWidths
                    .map((width) =>
                        typeof width === 'number' && width > 0
                            ? `<col style="width: ${width}px">`
                            : '<col>'
                    )
                    .join('')}</colgroup>`
                : '';

        const tableStyle = [
            'border-collapse: collapse',
            'width: 100%',
            'table-layout: fixed',
        ].join('; ');

        return `<table style="${tableStyle}">${colgroup}<tbody>${rows.join('')}</tbody></table>`;
    }

    if (node.type === 'image') {
        const src = node.attrs?.src || '';
        const alt = node.attrs?.alt || node.attrs?.title || '';
        const caption = node.attrs?.caption as string | undefined;
        if (!src) return '';

        // 에디터에서 설정한 이미지 크기 가져오기
        const width = node.attrs?.width as number | undefined;
        const height = node.attrs?.height as number | undefined;

        // width와 height가 있으면 그대로 사용, 없으면 기본 스타일 사용
        let style = '';
        if (width && height) {
            style = `width: ${width}px; height: ${height}px; object-fit: contain;`;
        } else if (width) {
            style = `width: ${width}px; height: auto; object-fit: contain;`;
        } else if (height) {
            style = `width: auto; height: ${height}px; object-fit: contain;`;
        } else {
            style = 'max-width: 400px; height: auto; object-fit: contain;';
        }

        // 캡션이 있으면 포함
        const captionHtml = caption
            ? `<div style="margin-top: 8px; padding: 8px 12px; font-size: 14px; color: #585f69; line-height: 1.5; text-align: center;">${caption}</div>`
            : '';

        // 중앙 정렬을 위한 wrapper div 추가
        return `<div style="text-align: center; margin: 1rem 0;"><img src="${src}" alt="${alt}" style="${style}" />${captionHtml}</div>`;
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

