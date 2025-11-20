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
        let html = `
            <div class="mb-4">
                <h3 class="ds-subtitle font-semibold mb-2 text-gray-800">아이템명</h3>
                ${content.itemName
                ? `<p class="ds-text text-gray-700">${content.itemName}</p>`
                : '<p class="ds-text text-gray-400">내용을 입력해주세요.</p>'}
            </div>
            <div class="mb-4">
                <h3 class="ds-subtitle font-semibold mb-2 text-gray-800">아이템 한줄 소개</h3>
                ${content.oneLineIntro
                ? `<p class="ds-text text-gray-700">${content.oneLineIntro}</p>`
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
                .ds-caption { font-size: 12px; line-height: 16px; }
                .ds-subtext { font-size: 13px; line-height: 18px; }
                .ds-text { font-size: 14px; line-height: 20px; }
                .ds-subtitle { font-size: 16px; line-height: 24px; }
                .prose img { display: block; margin: 0 auto; }
                .prose ul { list-style-type: disc; padding-left: 1.5rem; margin: 0 0 0.75rem 0; }
                .prose ol { list-style-type: decimal; padding-left: 1.5rem; margin: 0 0 0.75rem 0; }
            </style>
        </head>
        <body>
            <div id="measure-content" style="width: ${A4_WIDTH - 96}px; padding: 24px; visibility: hidden; position: absolute; top: -9999px;">
    `;

    // 섹션별로 렌더링 (측정용)
    allSections.forEach((section, sectionIndex) => {
        const sectionNumber = sectionIndex + 1;
        const sectionTitle = section.title.replace(/^\d+\.\s*/, '');

        html += `
            <div class="mb-[42px]">
                <div class="px-3 py-1 bg-gray-100 mb-3 flex items-center gap-3">
                    <div class="flex h-[20px] w-[20px] items-center justify-center rounded-full bg-gray-900 ds-caption font-semibold text-white">
                        ${sectionNumber}
                    </div>
                    <h2 class="ds-subtitle font-semibold text-gray-900">
                        ${sectionTitle}
                    </h2>
                </div>
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
                .ds-caption { font-size: 12px; line-height: 16px; }
                .ds-subtext { font-size: 13px; line-height: 18px; }
                .ds-text { font-size: 14px; line-height: 20px; }
                .ds-subtitle { font-size: 16px; line-height: 24px; }
                .prose img { display: block; margin: 0 auto; }
                .prose ul { list-style-type: disc; padding-left: 1.5rem; margin: 0 0 0.75rem 0; }
                .prose ol { list-style-type: decimal; padding-left: 1.5rem; margin: 0 0 0.75rem 0; }
            </style>
        </head>
        <body>
            <div id="pdf-page-root" class="bg-white shadow-lg" style="width: ${A4_WIDTH}px; height: ${A4_HEIGHT}px; overflow: hidden; display: flex; flex-direction: column;">
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

                            // 개요(sectionNumber 1) 또는 개요 다음 영역(sectionNumber 2, "1. 문제 인식")이 시작될 때는 무조건 새 페이지에서 시작
                            const shouldForceNewPage = needsSectionHeader && (sectionNumber === 1 || sectionNumber === 2);

                            // 섹션 제목 높이 계산
                            const totalItemHeight = needsSectionHeader
                                ? sectionHeaderHeight + SECTION_HEADER_MARGIN + itemHeight + ITEM_MARGIN
                                : itemHeight + ITEM_MARGIN;

                            // 페이지 분할: 특정 섹션은 강제로 새 페이지, 나머지는 여유 공간 고려
                            const PAGE_BUFFER = 50; // 약간의 여유 공간
                            if (shouldForceNewPage || (currentPageContent.length > 0 && currentPageHeight + totalItemHeight > MAX_CONTENT_HEIGHT + PAGE_BUFFER)) {
                                // 현재 페이지 저장
                                if (currentPageContent.length > 0) {
                                    pages.push({
                                        content: currentPageContent.join(''),
                                        showHeader: isFirstPage,
                                    });
                                }
                                // 새 페이지 시작
                                currentPageContent = [];
                                currentPageHeight = 0;
                                // 개요(sectionNumber 1)는 첫 페이지이므로 제목 표시, 그 외는 false
                                isFirstPage = sectionNumber === 1;
                                // 새 페이지에서도 섹션 헤더는 다시 표시하지 않음 (이미 표시된 섹션이면)
                            }

                            // 섹션 헤더 추가 (처음 한 번만)
                            if (needsSectionHeader) {
                                currentPageContent.push(`
                                    <div class="mb-3">
                                        <div class="px-3 py-1 bg-gray-100 flex items-center gap-3">
                                            <div class="flex h-[20px] w-[20px] items-center justify-center rounded-full bg-gray-900 ds-caption font-semibold text-white">
                                                ${sectionNumber}
                                            </div>
                                            <h2 class="ds-subtitle font-semibold text-gray-900">
                                                ${sectionTitle}
                                            </h2>
                                        </div>
                                    </div>
                                `);
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
                    });

                    if (currentPageContent.length > 0) {
                        pages.push({
                            content: currentPageContent.join(''),
                            showHeader: isFirstPage,
                        });
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
