import React from 'react';
import ArrowLeftIcon from '@/assets/icons/arrow_left.svg';

interface PaginationProps {
    current: number;
    total: number;
    onChange?: (page: number) => void;
}

const MAX_VISIBLE_PAGES = 6;

export default function Pagination({ current, total, onChange }: PaginationProps) {
    const totalPages = Math.max(1, total);
    const visibleCount = Math.min(totalPages, MAX_VISIBLE_PAGES);
    const half = Math.floor(visibleCount / 2);

    let start = Math.max(1, current - half);
    let end = start + visibleCount - 1;

    if (end > totalPages) {
        end = totalPages;
        start = Math.max(1, end - visibleCount + 1);
    }

    const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

    const go = (p: number) => {
        if (p < 1 || p > total) return;
        onChange?.(p);
    };

    return (
        <div className="flex w-full items-center justify-center gap-2">
            <button
                type="button"
                onClick={() => go(current - 1)}
                className="cursor-pointer p-1"
            >
                <ArrowLeftIcon />
            </button>
            {pages.map((p) => {
                const isActive = p === current;
                return (
                    <button
                        key={p}
                        type="button"
                        onClick={() => go(p)}
                        className={`h-6 w-6 cursor-pointer flex items-center justify-center ds-caption font-medium transition ${isActive
                            ? 'text-primary-500'
                            : 'text-gray-500  hover:underline'
                            }`}
                    >
                        {p}
                    </button>
                );
            })}
            <button
                type="button"
                onClick={() => go(current + 1)}
                className="cursor-pointer p-1 rotate-180"
            >
                <ArrowLeftIcon />
            </button>
        </div>
    );
}


