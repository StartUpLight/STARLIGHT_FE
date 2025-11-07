'use client';
import React, { useEffect, useState } from 'react';
import { useBusinessStore } from '@/store/business.store';
import { convertEditorJsonToHtml } from '@/lib/business/editorToHtml';
import sections from '@/data/sidebar.json';

const Preview = () => {
    const { contents } = useBusinessStore();
    const [title, setTitle] = useState('스타라이트의 사업계획서');

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


    return (
        <div className="flex h-[calc(100vh-90px)] w-full items-center justify-center bg-gray-100 pb-8">
            <div
                data-preview-content
                className="mx-auto h-full max-h-[calc(100vh-90px-4rem)] w-full max-w-[794px] bg-white rounded-[12px] flex flex-col"
            >
                {/* 제목 영역 - 고정 */}
                <div className="flex-shrink-0 px-6 py-4 border-b border-gray-200">
                    <h1 className="ds-subtitle font-semibold text-gray-900">{title}</h1>
                </div>

                {/* 스크롤 가능한 컨텐츠 영역 */}
                <div className="flex-1 overflow-y-auto px-5 py-4">
                    {allSections.map((section, sectionIndex) => {
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
                                    const content = contents[item.number] || {};

                                    // 개요 섹션 (number === '0')
                                    if (item.number === '0') {
                                        return (
                                            <div key={item.number}>
                                                {content.itemName && (
                                                    <div className="mb-4">
                                                        <h3 className="ds-subtitle font-semibold mb-2 text-gray-800">아이템명</h3>
                                                        <p className="ds-text text-gray-700">{content.itemName}</p>
                                                    </div>
                                                )}

                                                {content.oneLineIntro && (
                                                    <div className="mb-4">
                                                        <h3 className="ds-subtitle font-semibold mb-2 text-gray-800">아이템 한줄 소개</h3>
                                                        <p className="ds-text text-gray-700">{content.oneLineIntro}</p>
                                                    </div>
                                                )}

                                                {content.editorFeatures && (
                                                    <div className="mb-4">
                                                        <h3 className="ds-subtitle font-semibold mb-2 text-gray-800">아이템 / 아이디어 주요 기능</h3>
                                                        <div
                                                            className="ds-text text-gray-700 prose max-w-none [&_table]:w-full [&_table]:border-collapse [&_table]:overflow-hidden [&_table]:border [&_table]:border-gray-300 [&_th]:border-[1px] [&_th]:border-gray-300 [&_th]:border-solid [&_th]:p-2.5 [&_th]:align-top [&_th]:text-left [&_th]:font-semibold [&_th]:bg-gray-50 [&_td]:border-[1px] [&_td]:border-gray-300 [&_td]:border-solid [&_td]:p-2.5 [&_td]:align-top"
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
                                                            className="ds-text text-gray-700 prose max-w-none [&_table]:w-full [&_table]:border-collapse [&_table]:overflow-hidden [&_table]:border [&_table]:border-gray-300 [&_th]:border-[1px] [&_th]:border-gray-300 [&_th]:border-solid [&_th]:p-2.5 [&_th]:align-top [&_th]:text-left [&_th]:font-semibold [&_th]:bg-gray-50 [&_td]:border-[1px] [&_td]:border-gray-300 [&_td]:border-solid [&_td]:p-2.5 [&_td]:align-top"
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
                                                            className="ds-text text-gray-700 prose max-w-none [&_table]:w-full [&_table]:border-collapse [&_table]:overflow-hidden [&_table]:border [&_table]:border-gray-300 [&_th]:border-[1px] [&_th]:border-gray-300 [&_th]:border-solid [&_th]:p-2.5 [&_th]:align-top [&_th]:text-left [&_th]:font-semibold [&_th]:bg-gray-50 [&_td]:border-[1px] [&_td]:border-gray-300 [&_td]:border-solid [&_td]:p-2.5 [&_td]:align-top"
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
                                                    className="ds-text text-gray-700 prose max-w-none [&_table]:w-full [&_table]:border-collapse [&_table]:overflow-hidden [&_table]:border [&_table]:border-gray-300 [&_th]:border-[1px] [&_th]:border-gray-300 [&_th]:border-solid [&_th]:p-2.5 [&_th]:align-top [&_th]:text-left [&_th]:font-semibold [&_th]:bg-gray-50 [&_td]:border-[1px] [&_td]:border-gray-300 [&_td]:border-solid [&_td]:p-2.5 [&_td]:align-top"
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
                    })}
                </div>
            </div>
        </div>
    );
};

export default Preview;

