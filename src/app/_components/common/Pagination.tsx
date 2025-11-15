import React from 'react';
import ArrowLeftIcon from '@/assets/icons/arrow_left.svg';

interface PaginationProps {
    current: number;
    total: number;
    onChange?: (page: number) => void;
}

export default function Pagination({ current, total, onChange }: PaginationProps) {
    const pages = Array.from({ length: total }, (_, i) => i + 1);

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


