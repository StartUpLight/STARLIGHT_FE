'use client';

import { useLayoutEffect, useRef, useState } from 'react';

interface MentorCardTagsProps {
  tags: string[];
  name: string;
}

const MentorCardTags = ({ tags, name }: MentorCardTagsProps) => {
  const measureRef = useRef<HTMLDivElement>(null);
  const [firstLineCount, setFirstLineCount] = useState(tags.length);

  useLayoutEffect(() => {
    const measure = () => {
      if (typeof window === 'undefined' || window.innerWidth >= 768) {
        setFirstLineCount(tags.length);
        return;
      }
      if (!measureRef.current || tags.length === 0) return;
      const children = Array.from(measureRef.current.children) as HTMLElement[];
      const firstTop = children[0]?.offsetTop ?? 0;
      let count = 0;
      for (let i = 0; i < children.length; i++) {
        if (children[i].offsetTop > firstTop) break;
        count++;
      }
      setFirstLineCount(count > 0 ? count : tags.length);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [tags]);

  const showOverflow = firstLineCount < tags.length;

  return (
    <div className="relative w-full md:mt-4 mt-[14px]">
      <div
        ref={measureRef}
        aria-hidden
        className="flex flex-wrap gap-1.5 absolute left-0 top-0 w-full opacity-0 pointer-events-none"
      >
        {tags.map((tag, i) => (
          <div
            key={`${name}-m-${tag}-${i}`}
            className="bg-primary-50 items-center rounded-sm px-2 py-0.5 shrink-0"
          >
            <div className="ds-caption text-primary-500 font-medium whitespace-nowrap">
              {tag}
            </div>
          </div>
        ))}
      </div>
      <div className="flex w-full flex-wrap gap-1.5 items-center">
        {tags.map((tag, i) => (
          <div
            key={`${name}-tag-${tag}-${i}`}
            className={`bg-primary-50 items-center rounded-sm px-2 py-0.5 shrink-0 md:shrink overflow-hidden ${
              showOverflow && i >= firstLineCount ? 'hidden md:flex' : ''
            }`}
          >
            <div className="ds-caption text-primary-500 font-medium whitespace-nowrap">
              {tag}
            </div>
          </div>
        ))}
        {showOverflow && (
            <div className="ds-caption text-gray-500 font-medium md:hidden">
              +{tags.length - firstLineCount}개
            </div>
        )}
      </div>
    </div>
  );
};

export default MentorCardTags;
