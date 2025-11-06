'use client';
import React, { useEffect, useState } from 'react';
import { useBusinessStore } from '@/store/business.store';
import { convertEditorJsonToHtml } from '@/lib/business/editorToHtml';
import sections from '@/data/sidebar.json';
import Button from '@/app/_components/common/Button';

interface PreviewProps {
    onBack: () => void;
}

const Preview = ({ onBack }: PreviewProps) => {
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

    // 섹션 번호 매핑
    const getSectionNumber = (sectionIndex: number): string => {
        const numbers = ['①', '②', '③', '④', '⑤'];
        return numbers[sectionIndex] || `${sectionIndex + 1}`;
    };

    return (
        <div className="min-h-[calc(100vh-60px)] w-full bg-gray-100">
            <main className="pt-0 pb-12">
                <div
                    data-preview-content
                    className="mx-auto mt-8 w-full max-w-[794px] bg-white shadow-lg"
                    style={{ minHeight: '1123px' }}
                >
                    <div className="px-12 py-10">
                        {allSections.map((section, sectionIndex) => (
                            <div key={sectionIndex} className="mb-8 last:mb-0">
                                {section.items.map((item) => {
                                    const content = contents[item.number] || {};
                                    const sectionNumber = getSectionNumber(sectionIndex);

                                    // 개요 섹션 (number === '0')
                                    if (item.number === '0') {
                                        return (
                                            <div key={item.number} className="mb-12 last:mb-0">
                                                <div className="mb-4">
                                                    <h2 className="ds-heading font-bold text-gray-900">
                                                        {sectionNumber} {item.title}
                                                    </h2>
                                                </div>

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
                                                            className="ds-text text-gray-700 prose max-w-none"
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
                                                            className="ds-text text-gray-700 prose max-w-none"
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
                                                            className="ds-text text-gray-700 prose max-w-none"
                                                            dangerouslySetInnerHTML={{
                                                                __html: convertEditorJsonToHtml(content.editorGoals),
                                                            }}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    }

                                    // 일반 섹션
                                    return (
                                        <div key={item.number} className="mb-8 last:mb-0">
                                            <div className="mb-4">
                                                <h2 className="ds-heading font-bold text-gray-900">
                                                    {sectionNumber} {item.title}
                                                </h2>
                                            </div>

                                            {content.editorContent && (
                                                <div
                                                    className="ds-text text-gray-700 prose max-w-none"
                                                    dangerouslySetInnerHTML={{
                                                        __html: convertEditorJsonToHtml(content.editorContent),
                                                    }}
                                                />
                                            )}

                                            {!content.editorContent && (
                                                <p className="ds-text text-gray-400">어쩌구입니다. 어쩌구입니다.</p>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Preview;

