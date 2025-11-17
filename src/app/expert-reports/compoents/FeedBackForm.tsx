'use client';
import {
    ChangeEvent,
    forwardRef,
    useEffect,
    useImperativeHandle,
    useMemo,
    useState,
} from 'react';
import { sections, SectionKey, FeedBackFormHandle } from '@/types/feedback/sections';

const FeedBackForm = forwardRef<FeedBackFormHandle>((_, ref) => {
    const initialState = useMemo(
        () =>
            sections.reduce(
                (acc, section) => ({
                    ...acc,
                    [section.key]: '',
                }),
                {} as Record<SectionKey, string>,
            ),
        [],
    );

    const [feedback, setFeedback] = useState<Record<SectionKey, string>>(initialState);

    useImperativeHandle(
        ref,
        () => ({
            getFeedback: () => feedback,
        }),
        [feedback],
    );

    useEffect(() => {
        const textareas = document.querySelectorAll<HTMLTextAreaElement>('[data-feedback-textarea]');
        textareas.forEach((textarea) => {
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;
        });
    }, [feedback]);

    const handleChange = (key: SectionKey) => (e: ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        setFeedback((prev) => ({ ...prev, [key]: value }));
        e.target.style.height = 'auto';
        e.target.style.height = `${e.target.scrollHeight}px`;
    };

    return (
        <div className="bg-gray-100">
            <div className="mx-auto flex max-w-[762px] flex-col py-[30px]">
                <section className="rounded-[12px] bg-white shadow-[0_20px_60px_rgba(20,40,120,0.08)]">
                    <div className="flex px-6 py-4 border-b border-gray-200">
                        <h1 className="ds-title font-semibold text-gray-900">스타라이트의 사업계획서</h1>
                    </div>
                    <div className="flex flex-col px-6 pt-6 pb-9 gap-6">
                        {sections.map((section) => (
                            <div key={section.key}>
                                <p className="ds-subtitle font-semibold text-gray-900 mb-3">{section.title}</p>
                                <textarea
                                    data-feedback-textarea={section.key}
                                    className="min-h-[160px] py-2 px-3 w-full rounded-[4px] bg-gray-100 placeholder:text-gray-400 ds-text font-medium resize-none focus:outline-none focus:ring-0 focus:border-transparent"
                                    placeholder={section.placeholder}
                                    value={feedback[section.key]}
                                    onChange={handleChange(section.key)}
                                />
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
});

FeedBackForm.displayName = 'FeedBackForm';

export default FeedBackForm;

