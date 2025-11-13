'use client';
import React, { useEffect, useState, useRef } from 'react';
import { useBusinessStore } from '@/store/business.store';
import { convertEditorJsonToHtml } from '@/lib/business/converter/editorToHtml';
import sections from '@/data/sidebar.json';
import { ItemContent } from '@/types/business/business.store.type';

const Preview = () => {
    const { contents } = useBusinessStore();
    const [title, setTitle] = useState('스타라이트의 사업계획서');
    const [pages, setPages] = useState<Array<{ content: React.ReactNode; showHeader: boolean }>>([]);
    const measureRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const storedTitle = localStorage.getItem('businessPlanTitle');
        if (storedTitle) {
            setTitle(storedTitle);
        }
    }, []);

    // 섹션 데이터 가져오기
    type SidebarItem = { name: string; number: string; title: string; subtitle: string };
    type SidebarSection = { title: string; items: SidebarItem[] };
    const allSections = sections as SidebarSection[];

    // A4 크기: 794px x 1123px (96 DPI 기준)
    const A4_WIDTH = 794;
    const A4_HEIGHT = 1123;
    const PAGE_GAP = 24; // 페이지 사이 간격
    const HEADER_HEIGHT = 80; // 제목 영역 높이
    const CONTENT_PADDING = 48; // 컨텐츠 패딩 (px-12 py-6 = 48px + 24px)
    const MAX_CONTENT_HEIGHT = A4_HEIGHT - HEADER_HEIGHT - CONTENT_PADDING;

    // 컨텐츠 렌더링 함수
    const renderContent = () => {
        return allSections.map((section, sectionIndex) => {
            const sectionNumber = sectionIndex + 1;

            return (
                <div key={sectionIndex} className="mb-[42px]">
                    <div className="px-3 py-1 bg-gray-100 mb-3 flex items-center gap-3">
                        <div className="flex h-[20px] w-[20px] items-center justify-center rounded-full bg-gray-900 ds-caption font-semibold text-white">
                            {sectionNumber}
                        </div>
                        <h2 className="ds-subtitle font-semibold text-gray-900">
                            {section.title.replace(/^\d+\.\s*/, '')}
                        </h2>
                    </div>
                    {section.items.map((item) => {
                        const content: Partial<ItemContent> = contents[item.number] || {};

                        // 개요 섹션 (number === '0')
                        if (item.number === '0') {
                            return (
                                <div key={item.number}>
                                    <div className="mb-4">
                                        <h3 className="ds-subtitle font-semibold mb-2 text-gray-800">아이템명</h3>
                                        {content.itemName ? (
                                            <p className="ds-text text-gray-700">{content.itemName}</p>
                                        ) : (
                                            <p className="ds-text text-gray-400">내용을 입력해주세요.</p>
                                        )}
                                    </div>

                                    <div className="mb-4">
                                        <h3 className="ds-subtitle font-semibold mb-2 text-gray-800">아이템 한줄 소개</h3>
                                        {content.oneLineIntro ? (
                                            <p className="ds-text text-gray-700">{content.oneLineIntro}</p>
                                        ) : (
                                            <p className="ds-text text-gray-400">내용을 입력해주세요.</p>
                                        )}
                                    </div>

                                    {content.editorFeatures && (
                                        <div className="mb-4">
                                            <h3 className="ds-subtitle font-semibold mb-2 text-gray-800">아이템 / 아이디어 주요 기능</h3>
                                            <div
                                                className="ds-text text-gray-700 prose max-w-none [&_table]:w-full [&_table]:border-collapse [&_table]:overflow-hidden [&_table]:border [&_table]:border-gray-300 [&_th]:border-[1px] [&_th]:border-gray-300 [&_th]:border-solid [&_th]:p-2.5 [&_th]:align-top [&_th]:text-left [&_th]:font-semibold [&_th]:bg-gray-50 [&_td]:border-[1px] [&_td]:border-gray-300 [&_td]:border-solid [&_td]:p-2.5 [&_td]:align-top [&_img]:mx-auto [&_img]:block"
                                                dangerouslySetInnerHTML={{
                                                    __html: convertEditorJsonToHtml(content.editorFeatures),
                                                }}
                                            />
                                        </div>
                                    )}

                                    {content.editorSkills && (
                                        <div className="mb-4">
                                            <h3 className="ds-subtitle font-semibold mb-2 text-gray-800">관련 보유 기술</h3>
                                            <div
                                                className="ds-text text-gray-700 prose max-w-none [&_table]:w-full [&_table]:border-collapse [&_table]:overflow-hidden [&_table]:border [&_table]:border-gray-300 [&_th]:border-[1px] [&_th]:border-gray-300 [&_th]:border-solid [&_th]:p-2.5 [&_th]:align-top [&_th]:text-left [&_th]:font-semibold [&_th]:bg-gray-50 [&_td]:border-[1px] [&_td]:border-gray-300 [&_td]:border-solid [&_td]:p-2.5 [&_td]:align-top [&_img]:mx-auto [&_img]:block"
                                                dangerouslySetInnerHTML={{
                                                    __html: convertEditorJsonToHtml(content.editorSkills),
                                                }}
                                            />
                                        </div>
                                    )}

                                    {content.editorGoals && (
                                        <div className="mb-4">
                                            <h3 className="ds-subtitle font-semibold mb-2 text-gray-800">창업 목표</h3>
                                            <div
                                                className="ds-text text-gray-700 prose max-w-none [&_table]:w-full [&_table]:border-collapse [&_table]:overflow-hidden [&_table]:border [&_table]:border-gray-300 [&_th]:border-[1px] [&_th]:border-gray-300 [&_th]:border-solid [&_th]:p-2.5 [&_th]:align-top [&_th]:text-left [&_th]:font-semibold [&_th]:bg-gray-50 [&_td]:border-[1px] [&_td]:border-gray-300 [&_td]:border-solid [&_td]:p-2.5 [&_td]:align-top [&_img]:mx-auto [&_img]:block"
                                                dangerouslySetInnerHTML={{
                                                    __html: convertEditorJsonToHtml(content.editorGoals),
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>
                            );
                        }

                        return (
                            <div key={item.number} className="mb-4">
                                <h3 className="ds-subtitle font-semibold mb-2 text-gray-800">{item.title}</h3>
                                {content.editorContent && (
                                    <div
                                        className="ds-text text-gray-700 prose max-w-none [&_table]:w-full [&_table]:border-collapse [&_table]:overflow-hidden [&_table]:border [&_table]:border-gray-300 [&_th]:border-[1px] [&_th]:border-gray-300 [&_th]:border-solid [&_th]:p-2.5 [&_th]:align-top [&_th]:text-left [&_th]:font-semibold [&_th]:bg-gray-50 [&_td]:border-[1px] [&_td]:border-gray-300 [&_td]:border-solid [&_td]:p-2.5 [&_td]:align-top [&_img]:mx-auto [&_img]:block"
                                        dangerouslySetInnerHTML={{
                                            __html: convertEditorJsonToHtml(content.editorContent),
                                        }}
                                    />
                                )}
                                {!content.editorContent && (
                                    <p className="ds-text text-gray-400">내용을 입력해주세요.</p>
                                )}
                            </div>
                        );
                    })}
                </div>
            );
        });
    };


    // 아이템 렌더링 함수
    const renderItem = (item: SidebarItem, content: Partial<ItemContent>) => {
        if (item.number === '0') {
            return (
                <div key={item.number}>
                    <div className="mb-4">
                        <h3 className="ds-subtitle font-semibold mb-2 text-gray-800">아이템명</h3>
                        {content.itemName ? (
                            <p className="ds-text text-gray-700">{content.itemName}</p>
                        ) : (
                            <p className="ds-text text-gray-400">내용을 입력해주세요.</p>
                        )}
                    </div>
                    <div className="mb-4">
                        <h3 className="ds-subtitle font-semibold mb-2 text-gray-800">아이템 한줄 소개</h3>
                        {content.oneLineIntro ? (
                            <p className="ds-text text-gray-700">{content.oneLineIntro}</p>
                        ) : (
                            <p className="ds-text text-gray-400">내용을 입력해주세요.</p>
                        )}
                    </div>
                    {content.editorFeatures && (
                        <div className="mb-4">
                            <h3 className="ds-subtitle font-semibold mb-2 text-gray-800">아이템 / 아이디어 주요 기능</h3>
                            <div
                                className="ds-text text-gray-700 prose max-w-none [&_table]:w-full [&_table]:border-collapse [&_table]:overflow-hidden [&_table]:border [&_table]:border-gray-300 [&_th]:border-[1px] [&_th]:border-gray-300 [&_th]:border-solid [&_th]:p-2.5 [&_th]:align-top [&_th]:text-left [&_th]:font-semibold [&_th]:bg-gray-50 [&_td]:border-[1px] [&_td]:border-gray-300 [&_td]:border-solid [&_td]:p-2.5 [&_td]:align-top [&_img]:mx-auto [&_img]:block"
                                dangerouslySetInnerHTML={{
                                    __html: convertEditorJsonToHtml(content.editorFeatures),
                                }}
                            />
                        </div>
                    )}
                    {content.editorSkills && (
                        <div className="mb-4">
                            <h3 className="ds-subtitle font-semibold mb-2 text-gray-800">관련 보유 기술</h3>
                            <div
                                className="ds-text text-gray-700 prose max-w-none [&_table]:w-full [&_table]:border-collapse [&_table]:overflow-hidden [&_table]:border [&_table]:border-gray-300 [&_th]:border-[1px] [&_th]:border-gray-300 [&_th]:border-solid [&_th]:p-2.5 [&_th]:align-top [&_th]:text-left [&_th]:font-semibold [&_th]:bg-gray-50 [&_td]:border-[1px] [&_td]:border-gray-300 [&_td]:border-solid [&_td]:p-2.5 [&_td]:align-top [&_img]:mx-auto [&_img]:block"
                                dangerouslySetInnerHTML={{
                                    __html: convertEditorJsonToHtml(content.editorSkills),
                                }}
                            />
                        </div>
                    )}
                    {content.editorGoals && (
                        <div className="mb-4">
                            <h3 className="ds-subtitle font-semibold mb-2 text-gray-800">창업 목표</h3>
                            <div
                                className="ds-text text-gray-700 prose max-w-none [&_table]:w-full [&_table]:border-collapse [&_table]:overflow-hidden [&_table]:border [&_table]:border-gray-300 [&_th]:border-[1px] [&_th]:border-gray-300 [&_th]:border-solid [&_th]:p-2.5 [&_th]:align-top [&_th]:text-left [&_th]:font-semibold [&_th]:bg-gray-50 [&_td]:border-[1px] [&_td]:border-gray-300 [&_td]:border-solid [&_td]:p-2.5 [&_td]:align-top [&_img]:mx-auto [&_img]:block"
                                dangerouslySetInnerHTML={{
                                    __html: convertEditorJsonToHtml(content.editorGoals),
                                }}
                            />
                        </div>
                    )}
                </div>
            );
        }

        return (
            <div key={item.number} className="mb-4">
                <h3 className="ds-subtitle font-semibold mb-2 text-gray-800">{item.title}</h3>
                {content.editorContent && (
                    <div
                        className="ds-text text-gray-700 prose max-w-none [&_table]:w-full [&_table]:border-collapse [&_table]:overflow-hidden [&_table]:border [&_table]:border-gray-300 [&_th]:border-[1px] [&_th]:border-gray-300 [&_th]:border-solid [&_th]:p-2.5 [&_th]:align-top [&_th]:text-left [&_th]:font-semibold [&_th]:bg-gray-50 [&_td]:border-[1px] [&_td]:border-gray-300 [&_td]:border-solid [&_td]:p-2.5 [&_td]:align-top [&_img]:mx-auto [&_img]:block"
                        dangerouslySetInnerHTML={{
                            __html: convertEditorJsonToHtml(content.editorContent),
                        }}
                    />
                )}
                {!content.editorContent && (
                    <p className="ds-text text-gray-400">내용을 입력해주세요.</p>
                )}
            </div>
        );
    };

    // 페이지 분할 로직
    useEffect(() => {
        if (!measureRef.current) return;

        // DOM 렌더링 완료 후 높이 측정
        const timeoutId = setTimeout(() => {
            const sectionElements = measureRef.current?.children;
            if (!sectionElements || sectionElements.length === 0) return;

            const newPages: Array<{ content: React.ReactNode[]; showHeader: boolean }> = [];
            let currentPageContent: React.ReactNode[] = [];
            let currentPageHeight = 0;
            let isFirstPage = true;
            let currentSectionNumber: number | null = null;
            const shownSections = new Set<number>(); // 이미 표시된 섹션 추적

            // 각 섹션을 순회하며 아이템 단위로 페이지 분할
            allSections.forEach((section, sectionIndex) => {
                const sectionElement = sectionElements[sectionIndex] as HTMLElement;
                if (!sectionElement) return;

                const sectionNumber = sectionIndex + 1;
                const sectionTitle = section.title.replace(/^\d+\.\s*/, '');

                // 섹션 제목 높이 측정
                const sectionHeader = sectionElement.firstElementChild as HTMLElement;
                const sectionHeaderHeight = sectionHeader?.offsetHeight || 0;
                const SECTION_HEADER_MARGIN = 3; // mb-3 = 12px
                const SECTION_BOTTOM_MARGIN = 42; // mb-[42px]

                // 섹션의 아이템들을 개별적으로 측정
                const itemElements = Array.from(sectionElement.children).slice(1); // 첫 번째는 섹션 제목

                section.items.forEach((item, itemIndex) => {
                    const content: Partial<ItemContent> = contents[item.number] || {};
                    const itemElement = itemElements[itemIndex] as HTMLElement;
                    if (!itemElement) return;

                    const itemHeight = itemElement.offsetHeight;
                    const ITEM_MARGIN = 16; // mb-4 = 16px

                    // 섹션 제목이 필요한지 확인 (섹션이 처음 나타날 때만)
                    const needsSectionHeader = !shownSections.has(sectionNumber);

                    // 섹션 제목 높이 계산
                    const totalItemHeight = needsSectionHeader
                        ? sectionHeaderHeight + SECTION_HEADER_MARGIN + itemHeight + ITEM_MARGIN
                        : itemHeight + ITEM_MARGIN;

                    // 페이지 분할: 약간의 여유를 두고 분할 (너무 엄격하지 않게)
                    const PAGE_BUFFER = 50; // 약간의 여유 공간
                    if (currentPageHeight + totalItemHeight > MAX_CONTENT_HEIGHT + PAGE_BUFFER && currentPageContent.length > 0) {
                        // 현재 페이지 저장
                        newPages.push({
                            content: [...currentPageContent],
                            showHeader: isFirstPage,
                        });
                        // 새 페이지 시작
                        currentPageContent = [];
                        currentPageHeight = 0;
                        isFirstPage = false;
                        // 새 페이지에서도 섹션 제목은 다시 표시하지 않음 (이미 표시된 섹션이면)
                    }

                    // 섹션 제목 추가 (처음 한 번만)
                    if (needsSectionHeader) {
                        currentPageContent.push(
                            <div key={`section-${sectionIndex}`} className="mb-3">
                                <div className="px-3 py-1 bg-gray-100 flex items-center gap-3">
                                    <div className="flex h-[20px] w-[20px] items-center justify-center rounded-full bg-gray-900 ds-caption font-semibold text-white">
                                        {sectionNumber}
                                    </div>
                                    <h2 className="ds-subtitle font-semibold text-gray-900">
                                        {sectionTitle}
                                    </h2>
                                </div>
                            </div>
                        );
                        currentPageHeight += sectionHeaderHeight + SECTION_HEADER_MARGIN;
                        shownSections.add(sectionNumber);
                        currentSectionNumber = sectionNumber;
                    }

                    // 아이템 추가
                    currentPageContent.push(renderItem(item, content));
                    currentPageHeight += itemHeight + ITEM_MARGIN;
                });

                // 섹션 끝에 여백 추가 (마지막 섹션이 아니면)
                if (sectionIndex < allSections.length - 1) {
                    const ITEM_MARGIN = 16; // mb-4 = 16px
                    currentPageHeight += SECTION_BOTTOM_MARGIN - ITEM_MARGIN; // 마지막 아이템의 mb-4를 제외하고 섹션 여백 추가
                }
            });

            // 마지막 페이지 추가
            if (currentPageContent.length > 0) {
                newPages.push({
                    content: currentPageContent,
                    showHeader: isFirstPage,
                });
            }

            setPages(newPages.map(page => ({ content: <>{page.content}</>, showHeader: page.showHeader })));
        }, 100);

        return () => clearTimeout(timeoutId);
    }, [contents, allSections, MAX_CONTENT_HEIGHT]);

    return (
        <div className="flex h-[calc(100vh-90px)] w-full items-start justify-center overflow-y-auto pb-8">
            <div
                data-preview-content
                className="flex flex-col"
                style={{
                    gap: `${PAGE_GAP}px`,
                    width: `${A4_WIDTH}px`,
                }}
            >
                {/* 컨텐츠 높이 측정용 (숨김) */}
                <div
                    ref={measureRef}
                    style={{
                        position: 'fixed',
                        top: '-9999px',
                        left: '-9999px',
                        width: `${A4_WIDTH - 96}px`, // padding 제외
                        padding: '24px',
                        visibility: 'hidden',
                        pointerEvents: 'none',
                    }}
                >
                    {renderContent()}
                </div>

                {/* A4 페이지들 렌더링 */}
                {pages.length > 0 ? (
                    pages.map((page, pageIndex) => (
                        <div
                            key={pageIndex}
                            className="bg-white shadow-lg"
                            style={{
                                width: `${A4_WIDTH}px`,
                                height: `${A4_HEIGHT}px`,
                                overflow: 'hidden',
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            {/* 제목 영역 - 첫 페이지에만 표시 */}
                            {page.showHeader && (
                                <div className="px-12 pt-10 pb-6 border-b border-gray-200 flex-shrink-0">
                                    <h1 className="ds-subtitle font-semibold text-gray-900 text-center">{title}</h1>
                                </div>
                            )}

                            {/* 컨텐츠 영역 */}
                            <div
                                className="px-12 py-6"
                                style={{
                                    height: page.showHeader ? `${MAX_CONTENT_HEIGHT}px` : `${A4_HEIGHT - 48}px`,
                                    overflow: 'hidden',
                                }}
                            >
                                {page.content}
                            </div>
                        </div>
                    ))
                ) : (
                    // 로딩 중 또는 초기 상태
                    <div
                        className="bg-white shadow-lg"
                        style={{
                            width: `${A4_WIDTH}px`,
                            height: `${A4_HEIGHT}px`,
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        <div className="px-12 pt-10 pb-6 border-b border-gray-200 flex-shrink-0">
                            <h1 className="ds-subtitle font-semibold text-gray-900 text-center">{title}</h1>
                        </div>
                        <div
                            className="px-12 py-6"
                            style={{
                                height: `${MAX_CONTENT_HEIGHT}px`,
                                overflow: 'hidden',
                            }}
                        >
                            {renderContent()}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Preview;

