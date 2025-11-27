'use client';
import { useLayoutEffect, useState } from 'react';
import WarningIcon from '@/assets/icons/warning.svg';
import ToastCloseIcon from '@/assets/icons/toast_close.svg';

type ToastMessageProps = {
    message: string;
    onClose: () => void;
    anchorSelector?: string;
    verticalOffset?: number;
    horizontalOffset?: number;
};

const ToastMessage = ({
    message,
    onClose,
    anchorSelector = '[data-toast-anchor]',
    verticalOffset = 74,
    horizontalOffset = 22,
}: ToastMessageProps) => {
    const [position, setPosition] = useState<{ left: number; top: number } | null>(
        null
    );

    useLayoutEffect(() => {
        if (typeof window === 'undefined') return;

        const updatePosition = () => {
            const anchor = document.querySelector(anchorSelector) as HTMLElement | null;
            if (!anchor) {
                setPosition(null);
                return;
            }
            const rect = anchor.getBoundingClientRect();
            const left = Math.max(16, rect.left + horizontalOffset);
            const top = Math.min(
                window.innerHeight - 80,
                rect.bottom - verticalOffset
            );
            setPosition({ left, top });
        };

        updatePosition();
        window.addEventListener('resize', updatePosition);
        window.addEventListener('scroll', updatePosition, true);
        return () => {
            window.removeEventListener('resize', updatePosition);
            window.removeEventListener('scroll', updatePosition, true);
        };
    }, [anchorSelector, verticalOffset, horizontalOffset, message]);

    const baseClass =
        'fixed z-[150] flex w-[748px] max-w-[90vw] items-center gap-2 rounded-[12px] bg-gray-900 px-[12px] py-[10px] text-center';

    const inlineStyle = position
        ? { left: position.left, top: position.top }
        : { left: '50%', bottom: '100px', transform: 'translateX(-50%)' };

    return (
        <div className={baseClass} style={inlineStyle}>
            <WarningIcon />
            <p className="ds-text font-medium text-white">{message}</p>
            <button
                type="button"
                aria-label="토스트 닫기"
                onClick={onClose}
                className="ml-auto cursor-pointer flex items-center justify-center rounded-full px-[6px] py-[2px] transition hover:bg-white/10"
            >
                <ToastCloseIcon />
            </button>
        </div>
    );
};

export default ToastMessage;