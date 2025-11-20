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

type FeedbackMap = Record<SectionKey, string>;

type FeedBackFormProps = {
  initialFeedback?: Partial<FeedbackMap>;
  loading?: boolean;
  isSubmitted?: boolean;
};

const FeedBackForm = forwardRef<FeedBackFormHandle, FeedBackFormProps>(
  ({ initialFeedback, loading, isSubmitted }, ref) => {
    const initialState = useMemo<FeedbackMap>(
      () =>
        sections.reduce(
          (acc, section) => ({
            ...acc,
            [section.key]: '',
          }),
          {} as FeedbackMap
        ),
      []
    );

    const [feedback, setFeedback] = useState<FeedbackMap>(initialState);

    useEffect(() => {
      if (!initialFeedback) return;
      setFeedback((prev) => ({
        ...prev,
        ...initialFeedback,
      }));
    }, [initialFeedback]);

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
      (key: SectionKey) => (event: ChangeEvent<HTMLTextAreaElement>) => {
        const { value } = event.target;
        setFeedback((prev) => ({ ...prev, [key]: value }));
        event.target.style.height = 'auto';
        event.target.style.height = `${event.target.scrollHeight}px`;
      };

    return (
      <div className="bg-gray-100">
        <div className="mx-auto flex min-h-screen max-w-[762px] flex-col py-[30px]">
          <section className="rounded-xl bg-white shadow-[0_20px_60px_rgba(20,40,120,0.08)]">
            <div className="flex flex-row items-center gap-2 border-b border-gray-200 px-6 py-4">
              <div
                className={`ds-caption flex items-center rounded-full px-2 py-0.5 font-medium ${
                  isSubmitted
                    ? 'text-primary-500 bg-purple-50'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {isSubmitted ? '제출완료' : '제출전'}
              </div>
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
                    className="ds-text min-h-40 w-full resize-none rounded-sm bg-gray-100 px-3 py-2 font-medium text-gray-800 placeholder:text-gray-400 focus:border-transparent focus:ring-0 focus:outline-none"
                    placeholder={section.placeholder}
                    value={feedback[section.key]}
                    onChange={handleChange(section.key)}
                    disabled={loading || isSubmitted}
                  />
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    );
  }
);

FeedBackForm.displayName = 'FeedBackForm';

export default FeedBackForm;
