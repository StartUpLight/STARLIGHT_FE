import { BusinessPlanSubsectionsResponse, SubSectionType } from '@/types/business/business.type';
import { convertEditorJsonToHtml } from './converter/editorToHtml';
import { convertResponseToItemContent } from './converter/responseMapper';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import sections from '@/data/sidebar.json';

type SidebarItem = { name: string; number: string; title: string; subtitle: string };
type SidebarSection = { title: string; items: SidebarItem[] };

const A4_WIDTH = 794; // 96 DPI 기준
const A4_HEIGHT = 1123;
const PAGE_GAP = 24;
const HEADER_HEIGHT = 80;
const CONTENT_PADDING = 48;
const MAX_CONTENT_HEIGHT = A4_HEIGHT - HEADER_HEIGHT - CONTENT_PADDING;

// subSectionType을 number로 매핑
const getNumberFromSubSectionType = (subSectionType: SubSectionType): string => {
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

// 이미지를 base64로 변환 (pdfDownload.ts와 동일한 방식)
const convertImageToBase64 = async (img: HTMLImageElement): Promise<void> => {
    if (!img.src || img.src.startsWith('data:')) {
        return;
    }

    try {
        // fetch를 사용하여 이미지를 blob으로 가져오기
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
};

// Preview와 동일한 HTML 생성 (Tailwind 클래스 사용)
const renderPreviewHtml = (
    response: BusinessPlanSubsectionsResponse,
    title?: string
): string => {
    const allSections = sections as SidebarSection[];
    const contentMap: Record<string, ReturnType<typeof convertResponseToItemContent>> = {};

    const finalTitle = title || response.data?.title || '스타라이트의 사업계획서';

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

    // Preview와 동일한 구조로 HTML 생성
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
            </style>
        </head>
        <body>
            <div data-preview-content class="flex flex-col" style="gap: ${PAGE_GAP}px; width: ${A4_WIDTH}px;">
    `;

    // 각 페이지 렌더링 (Preview와 동일한 로직)
    allSections.forEach((section, sectionIndex) => {
        const sectionNumber = sectionIndex + 1;
        const sectionTitle = section.title.replace(/^\d+\.\s*/, '');
        const isFirstSection = sectionIndex === 0;

        html += `
            <div class="bg-white shadow-lg" style="width: ${A4_WIDTH}px; height: ${A4_HEIGHT}px; overflow: hidden; display: flex; flex-direction: column;">
        `;

        // 첫 페이지에만 헤더 표시
        if (isFirstSection) {
            html += `
                <div class="px-12 pt-10 pb-6 border-b border-gray-200 flex-shrink-0">
                    <h1 class="ds-subtitle font-semibold text-gray-900 text-center">${finalTitle}</h1>
                </div>
            `;
        }

        html += `
            <div class="px-12 py-6" style="height: ${isFirstSection ? MAX_CONTENT_HEIGHT : A4_HEIGHT - 48}px; overflow: hidden;">
        `;

        // 섹션 헤더
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

        // 아이템 렌더링
        section.items.forEach((item) => {
            const content = contentMap[item.number] || {};

            if (item.number === '0') {
                html += `
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
            } else {
                html += `
                    <div class="mb-4">
                        <h3 class="ds-subtitle font-semibold mb-2 text-gray-800">${item.title}</h3>
                        ${content.editorContent
                        ? `<div class="ds-text text-gray-700 prose max-w-none [&_table]:w-full [&_table]:border-collapse [&_table]:overflow-hidden [&_table]:border [&_table]:border-gray-300 [&_th]:border-[1px] [&_th]:border-gray-300 [&_th]:border-solid [&_th]:p-2.5 [&_th]:align-top [&_th]:text-left [&_th]:font-semibold [&_th]:bg-gray-50 [&_td]:border-[1px] [&_td]:border-gray-300 [&_td]:border-solid [&_td]:p-2.5 [&_td]:align-top [&_img]:mx-auto [&_img]:block">
                                ${convertEditorJsonToHtml(content.editorContent)}
                            </div>`
                        : '<p class="ds-text text-gray-400">내용을 입력해주세요.</p>'}
                    </div>
                `;
            }
        });

        html += `
            </div>
            </div>
        `;
    });

    html += `
            </div>
        </body>
        </html>
    `;

    return html;
};

// PDF 생성 함수 (Preview와 동일한 방식)
export const generatePdfFromSubsections = async (
    response: BusinessPlanSubsectionsResponse,
    title?: string
): Promise<File> => {
    return new Promise((resolve, reject) => {
        try {
            // iframe 생성 및 화면 밖으로 이동
            const iframe = document.createElement('iframe');
            iframe.style.position = 'fixed';
            iframe.style.top = '-9999px';
            iframe.style.left = '-9999px';
            iframe.style.width = `${A4_WIDTH}px`;
            iframe.style.height = `${A4_HEIGHT * 10}px`; // 충분한 높이
            iframe.style.border = 'none';
            document.body.appendChild(iframe);

            const htmlContent = renderPreviewHtml(response, title);

            iframe.onload = async () => {
                try {
                    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
                    if (!iframeDoc) {
                        throw new Error('iframe document not accessible');
                    }

                    iframeDoc.open();
                    iframeDoc.write(htmlContent);
                    iframeDoc.close();

                    // 이미지 로드 및 base64 변환 (pdfDownload.ts와 동일한 방식)
                    const images = Array.from(iframeDoc.querySelectorAll('img')) as HTMLImageElement[];
                    const imagePromises = images.map((img) => convertImageToBase64(img));
                    await Promise.all(imagePromises);

                    // 추가 대기 시간 (이미지 렌더링 완료)
                    await new Promise((resolve) => setTimeout(resolve, 500));

                    const previewContent = iframeDoc.querySelector('[data-preview-content]') as HTMLElement;
                    if (!previewContent) {
                        throw new Error('Preview content not found');
                    }

                    // html2canvas로 캔버스 생성 (pdfDownload.ts와 동일한 옵션)
                    const canvas = await html2canvas(previewContent, {
                        scale: 1.5,
                        useCORS: true,
                        allowTaint: false,
                        logging: false,
                        backgroundColor: '#ffffff',
                        scrollX: 0,
                        scrollY: 0,
                        imageTimeout: 15000,
                        removeContainer: true,
                        foreignObjectRendering: false,
                        onclone: (clonedDoc) => {
                            const clonedPreview = clonedDoc.querySelector('[data-preview-content]') as HTMLElement;
                            if (clonedPreview) {
                                clonedPreview.style.height = 'auto';
                                clonedPreview.style.maxHeight = 'none';
                            }
                        },
                    });

                    // jsPDF로 PDF 생성 (pdfDownload.ts와 동일한 방식)
                    const imgData = canvas.toDataURL('image/jpeg', 0.85);
                    const pdf = new jsPDF({
                        orientation: 'portrait',
                        unit: 'mm',
                        format: 'a4',
                        compress: true,
                    });

                    const imgWidth = 210;
                    const pageHeight = 297;
                    const imgHeight = (canvas.height * imgWidth) / canvas.width;
                    let heightLeft = imgHeight;
                    let position = 0;

                    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
                    heightLeft -= pageHeight;

                    while (heightLeft > 0) {
                        position = heightLeft - imgHeight;
                        pdf.addPage();
                        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
                        heightLeft -= pageHeight;
                    }

                    // PDF를 Blob으로 변환
                    const pdfBlob = pdf.output('blob');
                    const pdfFile = new File([pdfBlob], 'business-plan.pdf', {
                        type: 'application/pdf',
                    });

                    // iframe 제거
                    document.body.removeChild(iframe);

                    resolve(pdfFile);
                } catch (error) {
                    if (document.body.contains(iframe)) {
                        document.body.removeChild(iframe);
                    }
                    reject(error);
                }
            };

            iframe.onerror = () => {
                if (document.body.contains(iframe)) {
                    document.body.removeChild(iframe);
                }
                reject(new Error('Failed to load iframe'));
            };

            // iframe에 HTML 로드
            iframe.src = 'about:blank';
        } catch (error) {
            reject(error);
        }
    });
};
