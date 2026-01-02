import { BusinessPlanSubsectionsResponse } from '@/types/business/business.type';
import { convertEditorJsonToHtml } from './business/converter/editorToHtml';
import { convertResponseToItemContent } from './business/converter/responseMapper';
import { getNumberFromSubSectionType } from './business/mappers/getNumber';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import sections from '@/data/sidebar.json';

type SidebarItem = { name: string; number: string; title: string; subtitle: string };
type SidebarSection = { title: string; items: SidebarItem[] };

const A4_WIDTH = 794; // 96 DPI 기준
const A4_HEIGHT = 1123;
const HEADER_HEIGHT = 80;
const CONTENT_PADDING = 48;
const MAX_CONTENT_HEIGHT = A4_HEIGHT - HEADER_HEIGHT - CONTENT_PADDING;
const waitForElement = async (doc: Document, id: string, timeout = 2000): Promise<HTMLElement> => {
    const start = Date.now();
    return new Promise((resolve, reject) => {
        const check = () => {
            const element = doc.getElementById(id) as HTMLElement | null;
            if (element) {
                resolve(element);
                return;
            }
            if (Date.now() - start > timeout) {
                reject(new Error(`Element with id "${id}" not found`));
                return;
            }
            requestAnimationFrame(check);
        };
        check();
    });
};

// 아이템 렌더링 함수 (Preview.tsx와 동일)
const renderItemHtml = (
    item: SidebarItem,
    content: ReturnType<typeof convertResponseToItemContent>
): string => {
    if (item.number === '0') {
        const itemNameHtml = content.itemName
            ? (typeof content.itemName === 'string'
                ? content.itemName
                : convertEditorJsonToHtml(content.itemName))
            : '';
        const oneLineIntroHtml = content.oneLineIntro
            ? (typeof content.oneLineIntro === 'string'
                ? content.oneLineIntro
                : convertEditorJsonToHtml(content.oneLineIntro))
            : '';

        let html = `
            <div class="mb-4">
                <h3 class="ds-subtitle font-semibold mb-2 text-gray-800">아이템명</h3>
                ${itemNameHtml
                ? `<div class="ds-text text-gray-700 prose max-w-none">${itemNameHtml}</div>`
                : '<p class="ds-text text-gray-400">내용을 입력해주세요.</p>'}
            </div>
            <div class="mb-4">
                <h3 class="ds-subtitle font-semibold mb-2 text-gray-800">아이템 한줄 소개</h3>
                ${oneLineIntroHtml
                ? `<div class="ds-text text-gray-700 prose max-w-none">${oneLineIntroHtml}</div>`
                : '<p class="ds-text text-gray-400">내용을 입력해주세요.</p>'}
            </div>
        `;

        if (content.editorFeatures) {
            html += `
                <div class="mb-4">
                    <h3 class="ds-subtitle font-semibold mb-2 text-gray-800">아이템 / 아이디어 주요 기능</h3>
                    <div class="ds-text text-gray-700 prose max-w-none [&_table]:w-full [&_table]:border-collapse [&_table]:overflow-hidden [&_table]:border [&_table]:border-gray-300 [&_th]:border-[1px] [&_th]:border-gray-300 [&_th]:border-solid [&_th]:p-2.5 [&_th]:align-top [&_th]:text-left [&_th]:font-semibold [&_th]:bg-gray-50 [&_td]:border-[1px] [&_td]:border-gray-300 [&_td]:border-solid [&_td]:p-2.5 [&_td]:align-top [&_img]:mx-auto [&_img]:block">
                        ${convertEditorJsonToHtml(content.editorFeatures)}
                    </div>
                </div>
            `;
        }

        if (content.editorSkills) {
            html += `
                <div class="mb-4">
                    <h3 class="ds-subtitle font-semibold mb-2 text-gray-800">관련 보유 기술</h3>
                    <div class="ds-text text-gray-700 prose max-w-none [&_table]:w-full [&_table]:border-collapse [&_table]:overflow-hidden [&_table]:border [&_table]:border-gray-300 [&_th]:border-[1px] [&_th]:border-gray-300 [&_th]:border-solid [&_th]:p-2.5 [&_th]:align-top [&_th]:text-left [&_th]:font-semibold [&_th]:bg-gray-50 [&_td]:border-[1px] [&_td]:border-gray-300 [&_td]:border-solid [&_td]:p-2.5 [&_td]:align-top [&_img]:mx-auto [&_img]:block">
                        ${convertEditorJsonToHtml(content.editorSkills)}
                    </div>
                </div>
            `;
        }

        if (content.editorGoals) {
            html += `
                <div class="mb-4">
                    <h3 class="ds-subtitle font-semibold mb-2 text-gray-800">창업 목표</h3>
                    <div class="ds-text text-gray-700 prose max-w-none [&_table]:w-full [&_table]:border-collapse [&_table]:overflow-hidden [&_table]:border [&_table]:border-gray-300 [&_th]:border-[1px] [&_th]:border-gray-300 [&_th]:border-solid [&_th]:p-2.5 [&_th]:align-top [&_th]:text-left [&_th]:font-semibold [&_th]:bg-gray-50 [&_td]:border-[1px] [&_td]:border-gray-300 [&_td]:border-solid [&_td]:p-2.5 [&_td]:align-top [&_img]:mx-auto [&_img]:block">
                        ${convertEditorJsonToHtml(content.editorGoals)}
                    </div>
                </div>
            `;
        }

        return html;
    }

    return `
        <div class="mb-4">
            <h3 class="ds-subtitle font-semibold mb-2 text-gray-800">${item.title}</h3>
            ${content.editorContent
            ? `<div class="ds-text text-gray-700 prose max-w-none [&_table]:w-full [&_table]:border-collapse [&_table]:overflow-hidden [&_table]:border [&_table]:border-gray-300 [&_th]:border-[1px] [&_th]:border-gray-300 [&_th]:border-solid [&_th]:p-2.5 [&_th]:align-top [&_th]:text-left [&_th]:font-semibold [&_th]:bg-gray-50 [&_td]:border-[1px] [&_td]:border-gray-300 [&_td]:border-solid [&_td]:p-2.5 [&_td]:align-top [&_img]:mx-auto [&_img]:block">
                        ${convertEditorJsonToHtml(content.editorContent)}
                    </div>`
            : '<p class="ds-text text-gray-400">내용을 입력해주세요.</p>'}
        </div>
    `;
};

const renderSectionHeaderHtml = (sectionNumber: number, sectionTitle: string) => `
    <div
        class="px-3 py-1 bg-gray-100 mb-3"
        style="
            position: relative;
            padding: 0.25rem 0.75rem;
            background-color: #f3f4f6;
            margin-bottom: 0.75rem;
            height: 28px;
        "
    >
        <div
            class="rounded-full bg-gray-900"
            style="
                position: absolute;
                left: 12px;
                top: 50%;
                transform: translateY(-50%);
                height: 20px;
                width: 20px;
                border-radius: 9999px;
                background-color: #111827;
            "
        >
            <span
                class="ds-caption font-semibold text-white"
                style="
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%);
                    font-size: 12px;
                    line-height: 16px;
                    font-weight: 600;
                    color: #ffffff;
                "
            >
                ${sectionNumber}
            </span>
        </div>
        <h2
            class="ds-subtitle font-semibold text-gray-900"
            style="
                position: absolute;
                left: 40px;
                top: 50%;
                transform: translateY(-50%);
                font-size: 18px;
                line-height: 150%;
                font-weight: 600;
                color: #111827;
                letter-spacing: -0.02em;
                margin: 0;
            "
        >
            ${sectionTitle}
        </h2>
    </div>
`;

// Preview와 동일한 HTML 생성 (측정용)
const renderPreviewHtml = (
    response: BusinessPlanSubsectionsResponse
): string => {
    const allSections = sections as SidebarSection[];
    const contentMap: Record<string, ReturnType<typeof convertResponseToItemContent>> = {};

    // API 응답을 contentMap으로 변환
    if (response.result === 'SUCCESS' && response.data?.subSectionDetailList) {
        response.data.subSectionDetailList.forEach((detail) => {
            const subSectionType = detail.subSectionType;
            const number = getNumberFromSubSectionType(subSectionType);
            const itemContent = convertResponseToItemContent(
                detail.content.blocks,
                detail.content.checks
            );
            contentMap[number] = itemContent;
        });
    }

    // Preview와 동일한 구조로 HTML 생성 (측정용)
    let html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Pretendard:wght@400;500;600;700&display=swap');
                * {
                    font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                }
                body {
                    margin: 0;
                    padding: 0;
                    background: white;
                }
                .ds-caption { font-size: 12px; line-height: 150%; letter-spacing: 0; }
                .ds-subtext { font-size: 14px; line-height: 150%; letter-spacing: 0; }
                .ds-text { font-size: 16px; line-height: 150%; letter-spacing: -0.01em; }
                .ds-subtitle { font-size: 18px; line-height: 150%; letter-spacing: -0.02em; }
                .prose img { display: block; margin: 0 auto; }
                .prose ul { list-style-type: disc; padding-left: 1.25rem; margin: 0 0 0.4rem 0; }
                .prose ol { list-style-type: decimal; padding-left: 1.25rem; margin: 0 0 0.4rem 0; }
                .prose li { margin: 0.15rem 0; }
                .prose table {
                    width: 100%;
                    border-collapse: collapse;
                    table-layout: fixed;
                    border: 1px solid #E5E7EB;
                }
                .prose th,
                .prose td {
                    padding: 8px;
                    border: 1px solid #E5E7EB;
                    min-height: 25px;
                    vertical-align: top;
                    box-sizing: border-box;
                }
                .prose th > div,
                .prose td > div {
                    min-height: 25px;
                    display: flex;
                    flex-direction: column;
                    justify-content: flex-start;
                    height: 100%;
                }
            </style>
        </head>
        <body>
            <div id="measure-content" style="width: ${A4_WIDTH}px; padding: 24px 48px; box-sizing: border-box; visibility: hidden; position: absolute; top: -9999px;">
    `;

    // 섹션별로 렌더링 (측정용)
    allSections.forEach((section, sectionIndex) => {
        const sectionNumber = sectionIndex + 1;
        const sectionTitle = section.title.replace(/^\d+\.\s*/, '');

        html += `
            <div class="mb-[42px]">
                ${renderSectionHeaderHtml(sectionNumber, sectionTitle)}
        `;

        section.items.forEach((item) => {
            const content = contentMap[item.number] || {};
            html += renderItemHtml(item, content);
        });

        html += `</div>`;
    });

    html += `
            </div>
        </body>
        </html>
    `;

    return html;
};

// 페이지 HTML 생성 함수
const renderPageHtml = (
    pageContent: string,
    showHeader: boolean,
    title: string
): string => {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Pretendard:wght@400;500;600;700&display=swap');
                * {
                    font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                }
                body {
                    margin: 0;
                    padding: 0;
                    background: white;
                }
                .ds-caption { font-size: 12px; line-height: 150%; letter-spacing: 0; }
                .ds-subtext { font-size: 14px; line-height: 150%; letter-spacing: 0; }
                .ds-text { font-size: 16px; line-height: 150%; letter-spacing: -0.01em; }
                .ds-subtitle { font-size: 18px; line-height: 150%; letter-spacing: -0.02em; }
                .prose img { display: block; margin: 0 auto; }
                .prose ul { list-style-type: disc; padding-left: 1.25rem; margin: 0 0 0.4rem 0; }
                .prose ol { list-style-type: decimal; padding-left: 1.25rem; margin: 0 0 0.4rem 0; }
                .prose li { margin: 0.15rem 0; }
                .prose table {
                    width: 100%;
                    border-collapse: collapse;
                    table-layout: fixed;
                    border: 1px solid #E5E7EB;
                }
                .prose th,
                .prose td {
                    padding: 8px;
                    border: 1px solid #E5E7EB;
                    min-height: 25px;
                    vertical-align: top;
                    box-sizing: border-box;
                }
                .prose th > div,
                .prose td > div {
                    min-height: 25px;
                    display: flex;
                    flex-direction: column;
                    justify-content: flex-start;
                    height: 100%;
                }
            </style>
        </head>
        <body>
            <div id="pdf-page-root" class="bg-white shadow-lg" style="width: ${A4_WIDTH}px; height: ${A4_HEIGHT}px; overflow: hidden; display: flex; flex-direction: column;">
                ${showHeader
            ? `<div class="px-12 pt-10 pb-6 border-b border-gray-200 flex-shrink-0">
                        <h1 class="ds-subtitle font-semibold text-gray-900 text-center">${title}</h1>
                    </div>`
            : ''}
                <div class="px-12 py-6" style="height: ${showHeader ? MAX_CONTENT_HEIGHT : A4_HEIGHT - 48}px; overflow: hidden;">
                    ${pageContent}
                </div>
            </div>
        </body>
        </html>
    `;
};

// PDF 생성 함수 (Preview와 동일한 페이지 분할 로직)
export const generatePdfFromSubsections = async (
    response: BusinessPlanSubsectionsResponse,
    title?: string
): Promise<File> => {
    return new Promise((resolve, reject) => {
        try {
            const allSections = sections as SidebarSection[];
            const contentMap: Record<string, ReturnType<typeof convertResponseToItemContent>> = {};
            const finalTitle = title || response.data?.title || '사업계획서';

            // API 응답을 contentMap으로 변환
            if (response.result === 'SUCCESS' && response.data?.subSectionDetailList) {
                response.data.subSectionDetailList.forEach((detail) => {
                    const subSectionType = detail.subSectionType;
                    const number = getNumberFromSubSectionType(subSectionType);
                    const itemContent = convertResponseToItemContent(
                        detail.content.blocks,
                        detail.content.checks
                    );
                    contentMap[number] = itemContent;
                });
            }

            // 측정용 iframe 생성
            const measureIframe = document.createElement('iframe');
            measureIframe.style.position = 'fixed';
            measureIframe.style.top = '-9999px';
            measureIframe.style.left = '-9999px';
            measureIframe.style.width = `${A4_WIDTH}px`;
            measureIframe.style.height = `${A4_HEIGHT * 10}px`;
            measureIframe.style.border = 'none';
            document.body.appendChild(measureIframe);

            const measureHtml = renderPreviewHtml(response);

            measureIframe.onload = async () => {
                try {
                    const measureDoc = measureIframe.contentDocument || measureIframe.contentWindow?.document;
                    if (!measureDoc) {
                        throw new Error('iframe document not accessible');
                    }

                    measureDoc.open();
                    measureDoc.write(measureHtml);
                    measureDoc.close();

                    // 이미지 로드 대기
                    await new Promise((resolve) => {
                        const images = measureDoc.querySelectorAll('img');
                        let loadedCount = 0;
                        const totalImages = images.length;

                        if (totalImages === 0) {
                            resolve(undefined);
                            return;
                        }

                        images.forEach((img) => {
                            if (img.complete) {
                                loadedCount++;
                                if (loadedCount === totalImages) resolve(undefined);
                            } else {
                                img.onload = () => {
                                    loadedCount++;
                                    if (loadedCount === totalImages) resolve(undefined);
                                };
                                img.onerror = () => {
                                    loadedCount++;
                                    if (loadedCount === totalImages) resolve(undefined);
                                };
                            }
                        });
                    });

                    // DOM 렌더링 완료 대기 (requestAnimationFrame으로 최소화)
                    await new Promise((resolve) => {
                        requestAnimationFrame(() => {
                            requestAnimationFrame(() => {
                                resolve(undefined);
                            });
                        });
                    });

                    // Preview.tsx와 동일한 페이지 분할 로직
                    const measureContent = await waitForElement(measureDoc, 'measure-content');

                    const sectionElements = Array.from(measureContent.children);
                    const pages: Array<{ content: string; showHeader: boolean }> = [];
                    let currentPageContent: string[] = [];
                    let currentPageHeight = 0;
                    let isFirstPage = true;
                    const shownSections = new Set<number>();

                    allSections.forEach((section, sectionIndex) => {
                        const sectionElement = sectionElements[sectionIndex] as HTMLElement;
                        if (!sectionElement) return;

                        const sectionNumber = sectionIndex + 1;
                        const sectionTitle = section.title.replace(/^\d+\.\s*/, '');

                        const sectionHeader = sectionElement.firstElementChild as HTMLElement;
                        const sectionHeaderHeight = sectionHeader?.offsetHeight || 0;
                        const SECTION_HEADER_MARGIN = 12; // mb-3 = 12px
                        const SECTION_BOTTOM_MARGIN = 42; // mb-[42px]

                        const itemElements = Array.from(sectionElement.children).slice(1);

                        section.items.forEach((item, itemIndex) => {
                            const content = contentMap[item.number] || {};
                            const itemElement = itemElements[itemIndex] as HTMLElement;
                            if (!itemElement) return;

                            const itemHeight = itemElement.offsetHeight;
                            const ITEM_MARGIN = 16; // mb-4 = 16px

                            const needsSectionHeader = !shownSections.has(sectionNumber);

                            // 섹션 제목 높이 계산
                            const totalItemHeight = needsSectionHeader
                                ? sectionHeaderHeight + SECTION_HEADER_MARGIN + itemHeight + ITEM_MARGIN
                                : itemHeight + ITEM_MARGIN;

                            // 페이지 분할: 특정 섹션은 강제로 새 페이지, 나머지는 여유 공간 고려
                            const PAGE_BUFFER = -10; // 오버플로 방지를 위해 여유를 덜 사용
                            if (currentPageContent.length > 0 && currentPageHeight + totalItemHeight > MAX_CONTENT_HEIGHT + PAGE_BUFFER) {
                                // 현재 페이지 저장
                                if (currentPageContent.length > 0) {
                                    pages.push({
                                        content: currentPageContent.join(''),
                                        showHeader: isFirstPage,
                                    });
                                    isFirstPage = false;
                                }
                                // 새 페이지 시작
                                currentPageContent = [];
                                currentPageHeight = 0;
                            }

                            // 섹션 헤더 추가 (처음 한 번만)
                            if (needsSectionHeader) {
                                currentPageContent.push(renderSectionHeaderHtml(sectionNumber, sectionTitle));
                                currentPageHeight += sectionHeaderHeight + SECTION_HEADER_MARGIN;
                                shownSections.add(sectionNumber);
                            }

                            // 아이템 추가
                            currentPageContent.push(renderItemHtml(item, content));
                            currentPageHeight += itemHeight + ITEM_MARGIN;
                        });

                        // 섹션 끝에 여백 추가 (마지막 섹션이 아니면) - Preview.tsx와 동일
                        if (sectionIndex < allSections.length - 1) {
                            const ITEM_MARGIN = 16; // mb-4 = 16px
                            currentPageHeight += SECTION_BOTTOM_MARGIN - ITEM_MARGIN; // 마지막 아이템의 mb-4를 제외하고 섹션 여백 추가
                        }

                        // 개요 섹션(1번)은 다른 섹션과 페이지를 공유하지 않도록 강제 분리
                        if (sectionNumber === 1 && currentPageContent.length > 0) {
                            pages.push({
                                content: currentPageContent.join(''),
                                showHeader: isFirstPage,
                            });
                            isFirstPage = false;
                            currentPageContent = [];
                            currentPageHeight = 0;
                        }
                    });

                    if (currentPageContent.length > 0) {
                        pages.push({
                            content: currentPageContent.join(''),
                            showHeader: isFirstPage,
                        });
                        isFirstPage = false;
                    }

                    // 측정용 iframe 제거
                    document.body.removeChild(measureIframe);

                    // 각 페이지를 개별적으로 렌더링하고 PDF에 추가
                    const pdf = new jsPDF({
                        orientation: 'portrait',
                        unit: 'mm',
                        format: 'a4',
                        compress: true,
                    });

                    const renderPage = async (pageIndex: number): Promise<void> => {
                        return new Promise((resolve, reject) => {
                            const pageIframe = document.createElement('iframe');
                            pageIframe.style.position = 'fixed';
                            pageIframe.style.top = '-9999px';
                            pageIframe.style.left = '-9999px';
                            pageIframe.style.width = `${A4_WIDTH}px`;
                            pageIframe.style.height = `${A4_HEIGHT}px`;
                            pageIframe.style.border = 'none';
                            document.body.appendChild(pageIframe);

                            const pageHtml = renderPageHtml(
                                pages[pageIndex].content,
                                pages[pageIndex].showHeader,
                                finalTitle
                            );

                            pageIframe.onload = async () => {
                                try {
                                    const pageDoc = pageIframe.contentDocument || pageIframe.contentWindow?.document;
                                    if (!pageDoc) {
                                        throw new Error('iframe document not accessible');
                                    }

                                    pageDoc.open();
                                    pageDoc.write(pageHtml);
                                    pageDoc.close();

                                    // 이미지를 미리 로드하여 CORS 문제 해결 (pdfDownload.ts와 동일한 방식)
                                    const images = Array.from(pageDoc.querySelectorAll('img')) as HTMLImageElement[];
                                    const imagePromises = images.map(async (img) => {
                                        if (!img.src || img.src.startsWith('data:')) {
                                            return;
                                        }

                                        try {
                                            // fetch를 사용하여 이미지를 blob으로 가져오기 (CORS 헤더가 있는 경우)
                                            const separator = img.src.includes('?') ? '&' : '?';
                                            const imageUrl = img.src + separator + '_t=' + new Date().getTime();

                                            const response = await fetch(imageUrl, {
                                                mode: 'cors',
                                                credentials: 'omit',
                                            });

                                            if (response.ok) {
                                                const blob = await response.blob();
                                                const blobUrl = URL.createObjectURL(blob);

                                                // blob URL을 사용하여 이미지 로드
                                                const imgElement = new Image();
                                                imgElement.crossOrigin = 'anonymous';

                                                await new Promise<void>((resolve, reject) => {
                                                    imgElement.onload = () => {
                                                        try {
                                                            // 이미지를 base64로 변환하여 CORS 문제 완전히 우회
                                                            const canvas = document.createElement('canvas');
                                                            canvas.width = imgElement.width;
                                                            canvas.height = imgElement.height;
                                                            const ctx = canvas.getContext('2d');
                                                            if (ctx) {
                                                                ctx.drawImage(imgElement, 0, 0);
                                                                const dataUrl = canvas.toDataURL('image/png');
                                                                img.src = dataUrl;
                                                                URL.revokeObjectURL(blobUrl);
                                                            }
                                                        } catch (e) {
                                                            console.warn('이미지 변환 실패:', e);
                                                        }
                                                        resolve();
                                                    };

                                                    imgElement.onerror = () => {
                                                        URL.revokeObjectURL(blobUrl);
                                                        reject(new Error('이미지 로드 실패'));
                                                    };

                                                    imgElement.src = blobUrl;
                                                });
                                            } else {
                                                // fetch 실패 시 원본 이미지에 crossOrigin 설정만 추가
                                                img.crossOrigin = 'anonymous';
                                                const separator2 = img.src.includes('?') ? '&' : '?';
                                                img.src = img.src + separator2 + '_t=' + new Date().getTime();
                                            }
                                        } catch (e) {
                                            // fetch 실패 시 원본 이미지에 crossOrigin 설정만 추가
                                            console.warn('이미지 fetch 실패, 원본 URL 사용:', e);
                                            img.crossOrigin = 'anonymous';
                                            const separator = img.src.includes('?') ? '&' : '?';
                                            img.src = img.src + separator + '_t=' + new Date().getTime();
                                        }
                                    });

                                    // 모든 이미지 로드 완료 대기
                                    await Promise.all(imagePromises);

                                    // DOM 렌더링 완료 대기 (requestAnimationFrame으로 최소화)
                                    await new Promise((resolve) => {
                                        requestAnimationFrame(() => {
                                            requestAnimationFrame(() => {
                                                resolve(undefined);
                                            });
                                        });
                                    });

                                    const pageElement = await waitForElement(pageDoc, 'pdf-page-root');

                                    const canvas = await html2canvas(pageElement, {
                                        scale: 2,
                                        useCORS: true,
                                        allowTaint: false,
                                        logging: false,
                                        backgroundColor: '#ffffff',
                                        width: A4_WIDTH,
                                        height: A4_HEIGHT,
                                        onclone: (clonedDoc) => {
                                            // 전역 스타일 주입 - 위로 쏠리는 현상 방지
                                            const styleEl = clonedDoc.createElement('style');
                                            styleEl.innerHTML = `
                                                /* 인라인 요소 정렬 수정 */
                                                mark, strong, em, code, span {
                                                    vertical-align: baseline !important;
                                                    display: inline !important;
                                                    line-height: inherit !important;
                                                }
                                                
                                                /* 하이라이트 추가 여백 */
                                                mark {
                                                    padding-top: 0.1em !important;
                                                    padding-bottom: 0.05em !important;
                                                    margin: 0 !important;
                                                }
                                                
                                                /* 리스트 스타일 강제 */
                                                ul, ol {
                                                    list-style-position: outside !important;
                                                    padding-left: 1.5rem !important;
                                                    margin: 0 0 0.75rem 0 !important;
                                                }
                                                
                                                ul {
                                                    list-style-type: disc !important;
                                                }
                                                
                                                ol {
                                                    list-style-type: decimal !important;
                                                }
                                                
                                                li {
                                                    display: list-item !important;
                                                    line-height: 1.6 !important;
                                                    vertical-align: baseline !important;
                                                    padding: 0 !important;
                                                    margin: 0 !important;
                                                }
                                                
                                                /* 문단 스타일 */
                                                p {
                                                    line-height: 1.6 !important;
                                                    margin: 0 0 0.75rem 0 !important;
                                                }
                                            `;
                                            clonedDoc.head.appendChild(styleEl);

                                            // 섹션 헤더 스타일 적용
                                            const sectionHeaders = clonedDoc.querySelectorAll('.bg-gray-100');
                                            sectionHeaders.forEach((header) => {
                                                const sectionNumberContainer = header.querySelector('.bg-gray-900.rounded-full') as HTMLElement;
                                                if (sectionNumberContainer) {
                                                    const sectionNumberText = sectionNumberContainer.querySelector('span') as HTMLElement;
                                                    if (sectionNumberText) {
                                                        sectionNumberText.style.setProperty('top', '20%', 'important');
                                                    }
                                                }
                                                const sectionTitle = header.querySelector('h2.ds-subtitle') as HTMLElement;
                                                if (sectionTitle) {
                                                    sectionTitle.style.setProperty('top', '20%', 'important');
                                                }
                                            });

                                            // 하이라이트가 여러 줄일 때 각 줄마다 배경이 보이도록 처리
                                            const highlightSpans = clonedDoc.querySelectorAll('span[style*="background-color"]');
                                            highlightSpans.forEach((span) => {
                                                const spanEl = span as HTMLElement;
                                                const style = spanEl.getAttribute('style') || '';
                                                const colorMatch = style.match(/background-color:\s*([^;]+)/i);
                                                if (!colorMatch) return;
                                                const bgColor = colorMatch[1].trim();
                                                if (!bgColor || bgColor === 'transparent') return;

                                                if (spanEl.dataset.pdfHighlightProcessed === 'true') return;
                                                spanEl.dataset.pdfHighlightProcessed = 'true';

                                                const originalHTML = spanEl.innerHTML;
                                                const range = clonedDoc.createRange();
                                                range.selectNodeContents(spanEl);
                                                const rects = Array.from(range.getClientRects());
                                                const spanRect = spanEl.getBoundingClientRect();

                                                spanEl.style.backgroundColor = 'transparent';
                                                spanEl.style.position = spanEl.style.position || 'relative';
                                                spanEl.style.display = 'inline-block';
                                                spanEl.style.zIndex = '0';

                                                const textLayer = clonedDoc.createElement('span');
                                                textLayer.innerHTML = originalHTML;
                                                textLayer.style.position = 'relative';
                                                textLayer.style.zIndex = '1';
                                                textLayer.style.display = 'inline';
                                                spanEl.innerHTML = '';
                                                spanEl.appendChild(textLayer);

                                                rects.forEach((rect) => {
                                                    if (!rect.width || !rect.height) return;
                                                    const overlay = clonedDoc.createElement('span');
                                                    overlay.style.position = 'absolute';
                                                    overlay.style.left = `${rect.left - spanRect.left}px`;
                                                    const offsetTop = rect.top - spanRect.top + rect.height * 0.5;
                                                    overlay.style.top = `${offsetTop}px`;
                                                    const overlayHeight = rect.height;
                                                    overlay.style.width = `${rect.width}px`;
                                                    overlay.style.height = `${overlayHeight}px`;
                                                    overlay.style.backgroundColor = bgColor;
                                                    overlay.style.borderRadius = '2px';
                                                    overlay.style.pointerEvents = 'none';
                                                    overlay.style.zIndex = '-1';
                                                    spanEl.insertBefore(overlay, spanEl.firstChild);
                                                });
                                            });

                                            const listItems = clonedDoc.querySelectorAll('li');
                                            listItems.forEach((li) => {
                                                const liEl = li as HTMLElement;
                                                liEl.style.setProperty('display', 'list-item', 'important');
                                                liEl.style.setProperty('line-height', '1.6', 'important');
                                                liEl.style.setProperty('vertical-align', 'baseline', 'important');
                                            });

                                            const bulletLists = clonedDoc.querySelectorAll('ul');
                                            bulletLists.forEach((ul) => {
                                                const ulEl = ul as HTMLElement;
                                                ulEl.style.setProperty('list-style-type', 'none', 'important');
                                                ulEl.style.setProperty('padding-left', '1.2rem', 'important');

                                                // ul의 직접 자식 li만 선택 (중첩된 ol 내부의 li는 제외)
                                                const bulletItems = Array.from(ulEl.children).filter(
                                                    (child) => child.tagName === 'LI'
                                                ) as HTMLElement[];

                                                bulletItems.forEach((li) => {
                                                    const liEl = li as HTMLElement;
                                                    liEl.style.setProperty('list-style-type', 'none', 'important');
                                                    liEl.style.setProperty('position', 'relative', 'important');
                                                    liEl.style.setProperty('padding-left', '0.5rem', 'important');

                                                    let bulletSpan = liEl.querySelector('.pdf-bullet-marker') as HTMLElement | null;
                                                    if (!bulletSpan) {
                                                        bulletSpan = clonedDoc.createElement('span');
                                                        bulletSpan.className = 'pdf-bullet-marker';
                                                        bulletSpan.textContent = '•';
                                                        liEl.insertBefore(bulletSpan, liEl.firstChild);
                                                    }

                                                    bulletSpan.style.setProperty('position', 'absolute', 'important');
                                                    bulletSpan.style.setProperty('left', '-0.5rem', 'important');
                                                    bulletSpan.style.setProperty('top', '0.3em', 'important');
                                                    bulletSpan.style.setProperty('transform', 'translateY(-50%)', 'important');
                                                    bulletSpan.style.setProperty('line-height', '1', 'important');
                                                    bulletSpan.style.setProperty('font-size', '1.5rem', 'important');
                                                    bulletSpan.style.setProperty('color', '#4b5563', 'important');

                                                    // ul의 li 내부에 중첩된 ol이 있는 경우 처리
                                                    const nestedOl = liEl.querySelector('ol');
                                                    if (nestedOl) {
                                                        const nestedOlEl = nestedOl as HTMLElement;
                                                        nestedOlEl.style.setProperty('list-style-type', 'none', 'important');
                                                        nestedOlEl.style.setProperty('padding-left', '1.2rem', 'important');
                                                        nestedOlEl.style.setProperty('margin-left', '0.2rem', 'important');

                                                        // 중첩된 ol의 직접 자식 li만 선택
                                                        const nestedOlItems = Array.from(nestedOlEl.children).filter(
                                                            (child) => child.tagName === 'LI'
                                                        ) as HTMLElement[];

                                                        nestedOlItems.forEach((nestedLi, nestedIndex) => {
                                                            const nestedLiEl = nestedLi as HTMLElement;
                                                            nestedLiEl.style.setProperty('list-style-type', 'none', 'important');
                                                            nestedLiEl.style.setProperty('position', 'relative', 'important');
                                                            nestedLiEl.style.setProperty('padding-left', '0.5rem', 'important');

                                                            let nestedNumberSpan = nestedLiEl.querySelector('.pdf-number-marker') as HTMLElement | null;
                                                            if (!nestedNumberSpan) {
                                                                nestedNumberSpan = clonedDoc.createElement('span');
                                                                nestedNumberSpan.className = 'pdf-number-marker';
                                                                nestedNumberSpan.textContent = `${nestedIndex + 1}.`;
                                                                nestedLiEl.insertBefore(nestedNumberSpan, nestedLiEl.firstChild);
                                                            } else {
                                                                nestedNumberSpan.textContent = `${nestedIndex + 1}.`;
                                                            }

                                                            nestedNumberSpan.style.setProperty('position', 'absolute', 'important');
                                                            nestedNumberSpan.style.setProperty('left', '-0.5rem', 'important');
                                                            nestedNumberSpan.style.setProperty('top', '0.72em', 'important');
                                                            nestedNumberSpan.style.setProperty('transform', 'translateY(-50%)', 'important');
                                                            nestedNumberSpan.style.setProperty('line-height', '1', 'important');
                                                            nestedNumberSpan.style.setProperty('font-size', '1rem', 'important');
                                                            nestedNumberSpan.style.setProperty('color', '#4b5563', 'important');
                                                        });
                                                    }
                                                });
                                            });

                                            const orderedLists = clonedDoc.querySelectorAll('ol');
                                            orderedLists.forEach((ol) => {
                                                const olEl = ol as HTMLElement;
                                                olEl.style.setProperty('list-style-type', 'none', 'important');
                                                olEl.style.setProperty('padding-left', '1.2rem', 'important');

                                                // ol의 직접 자식 li만 선택 (중첩된 ul 내부의 li는 제외)
                                                const orderedItems = Array.from(olEl.children).filter(
                                                    (child) => child.tagName === 'LI'
                                                ) as HTMLElement[];

                                                orderedItems.forEach((li, index) => {
                                                    const liEl = li as HTMLElement;
                                                    liEl.style.setProperty('list-style-type', 'none', 'important');
                                                    liEl.style.setProperty('position', 'relative', 'important');
                                                    liEl.style.setProperty('padding-left', '0.5rem', 'important');

                                                    let numberSpan = liEl.querySelector('.pdf-number-marker') as HTMLElement | null;
                                                    if (!numberSpan) {
                                                        numberSpan = clonedDoc.createElement('span');
                                                        numberSpan.className = 'pdf-number-marker';
                                                        numberSpan.textContent = `${index + 1}.`;
                                                        liEl.insertBefore(numberSpan, liEl.firstChild);
                                                    } else {
                                                        numberSpan.textContent = `${index + 1}.`;
                                                    }

                                                    numberSpan.style.setProperty('position', 'absolute', 'important');
                                                    numberSpan.style.setProperty('left', '-0.5rem', 'important');
                                                    numberSpan.style.setProperty('top', '0.72em', 'important');
                                                    numberSpan.style.setProperty('transform', 'translateY(-50%)', 'important');
                                                    numberSpan.style.setProperty('line-height', '1', 'important');
                                                    numberSpan.style.setProperty('font-size', '1rem', 'important');
                                                    numberSpan.style.setProperty('color', '#4b5563', 'important');

                                                    // 중첩된 ul이 있으면 padding-left 조정하여 겹치지 않도록
                                                    const nestedUl = liEl.querySelector('ul');
                                                    if (nestedUl) {
                                                        const nestedUlEl = nestedUl as HTMLElement;
                                                        nestedUlEl.style.setProperty('margin-left', '0.2rem', 'important');
                                                        nestedUlEl.style.setProperty('padding-left', '0.6rem', 'important');
                                                    }
                                                });
                                            });
                                        },
                                    });

                                    const imgData = canvas.toDataURL('image/jpeg', 0.9);
                                    const imgWidth = 210; // A4 width in mm
                                    const imgHeight = 297; // A4 height in mm

                                    if (pageIndex > 0) {
                                        pdf.addPage();
                                    }

                                    pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);

                                    document.body.removeChild(pageIframe);
                                    resolve();
                                } catch (error) {
                                    if (document.body.contains(pageIframe)) {
                                        document.body.removeChild(pageIframe);
                                    }
                                    reject(error);
                                }
                            };

                            pageIframe.onerror = () => {
                                if (document.body.contains(pageIframe)) {
                                    document.body.removeChild(pageIframe);
                                }
                                reject(new Error('Failed to load iframe'));
                            };

                            pageIframe.src = 'about:blank';
                        });
                    };

                    // 모든 페이지를 순차적으로 렌더링
                    for (let i = 0; i < pages.length; i++) {
                        await renderPage(i);
                    }

                    const pdfBlob = pdf.output('blob');

                    // 파일 이름에서 특수문자 제거 (파일 시스템에서 허용되지 않는 문자)
                    const sanitizedTitle = finalTitle
                        .replace(/[<>:"/\\|?*]/g, '') // 파일명에 사용할 수 없는 문자 제거
                        .replace(/\s+/g, '_') // 공백을 언더스코어로 변경
                        .trim() || '사업계획서'; // 빈 문자열이면 기본값 사용

                    const pdfFile = new File([pdfBlob], `${sanitizedTitle}.pdf`, {
                        type: 'application/pdf',
                    });

                    resolve(pdfFile);
                } catch (error) {
                    if (document.body.contains(measureIframe)) {
                        document.body.removeChild(measureIframe);
                    }
                    reject(error);
                }
            };

            measureIframe.onerror = () => {
                if (document.body.contains(measureIframe)) {
                    document.body.removeChild(measureIframe);
                }
                reject(new Error('Failed to load iframe'));
            };

            measureIframe.src = 'about:blank';
        } catch (error) {
            reject(error);
        }
    });
};
