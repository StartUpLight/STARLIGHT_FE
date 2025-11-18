'use client';
import {
  ChangeEvent,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import {
  sections,
  SectionKey,
  FeedBackFormHandle,
} from '@/types/feedback/sections';

const FeedBackForm = forwardRef<FeedBackFormHandle>((_, ref) => {
  const initialState = useMemo(
    () =>
      sections.reduce(
        (acc, section) => ({
          ...acc,
          [section.key]: '',
        }),
        {} as Record<SectionKey, string>
      ),
    []
  );

  const [feedback, setFeedback] =
    useState<Record<SectionKey, string>>(initialState);

  useImperativeHandle(
    ref,
    () => ({
      getFeedback: () => feedback,
    }),
    [feedback]
  );

  useEffect(() => {
    const textareas = document.querySelectorAll<HTMLTextAreaElement>(
      '[data-feedback-textarea]'
    );
    textareas.forEach((textarea) => {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    });
  }, [feedback]);

  const handleChange =
    (key: SectionKey) => (e: ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;
      setFeedback((prev) => ({ ...prev, [key]: value }));
      e.target.style.height = 'auto';
      e.target.style.height = `${e.target.scrollHeight}px`;
    };

  return (
    <div className="bg-gray-100">
      <div className="mx-auto flex max-w-[762px] flex-col py-[30px]">
        <section className="rounded-xl bg-white shadow-[0_20px_60px_rgba(20,40,120,0.08)]">
          <div className="flex border-b border-gray-200 px-6 py-4">
            <h1 className="ds-title font-semibold text-gray-900">
              스타라이트의 사업계획서
            </h1>
          </div>
          <div className="flex flex-col gap-6 px-6 pt-6 pb-9">
            {sections.map((section) => (
              <div key={section.key}>
                <p className="ds-subtitle mb-3 font-semibold text-gray-900">
                  {section.title}
                </p>
                <textarea
                  data-feedback-textarea={section.key}
                  className="ds-text min-h-40 w-full resize-none rounded-sm bg-gray-100 px-3 py-2 font-medium placeholder:text-gray-400 focus:border-transparent focus:ring-0 focus:outline-none"
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
