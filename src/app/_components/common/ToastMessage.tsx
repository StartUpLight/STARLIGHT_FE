'use client';
import { useLayoutEffect, useState } from 'react';
import WarningIcon from '@/assets/icons/warning.svg';
import InfoIcon from '@/assets/icons/info.svg';
import ToastCloseIcon from '@/assets/icons/toast_close.svg';

type ToastMessageProps = {
    message: string;
    onClose: () => void;
    anchorSelector?: string;
    verticalOffset?: number;
    horizontalOffset?: number;
    variant?: 'warning' | 'notification';
};

const ToastMessage = ({
    message,
    onClose,
    anchorSelector = '[data-toast-anchor]',
    verticalOffset = 74,
    horizontalOffset = 22,
    variant = 'warning',
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

    const isNotification = variant === 'notification';
    const baseClass = isNotification
        ? 'fixed z-[150] flex w-[360px] max-w-[90vw] items-start gap-3 rounded-[14px] border border-gray-200 bg-white px-4 py-3 text-left shadow-[0_12px_28px_rgba(15,23,42,0.14)]'
        : 'fixed z-[150] flex w-[748px] max-w-[90vw] items-center gap-2 rounded-[12px] bg-gray-900 px-[12px] py-[10px] text-center';

    const inlineStyle = position
        ? { left: position.left, top: position.top }
        : { left: '50%', bottom: '100px', transform: 'translateX(-50%)' };

    return (
        <div
            className={baseClass}
            style={inlineStyle}
            role="status"
            aria-live="polite"
        >
            {isNotification ? (
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-500">
                    <InfoIcon />
                </div>
            ) : (
                <WarningIcon />
            )}
            <p
                className={
                    isNotification
                        ? 'ds-subtext flex-1 font-medium text-gray-900'
                        : 'ds-text font-medium text-white'
                }
            >
                {message}
            </p>
            <button
                type="button"
                aria-label="토스트 닫기"
                onClick={onClose}
                className={`ml-auto flex cursor-pointer items-center justify-center rounded-full px-[6px] py-[2px] transition ${
                    isNotification ? 'hover:bg-gray-100' : 'hover:bg-white/10'
                }`}
            >
                <ToastCloseIcon />
            </button>
        </div>
    );
};

export default ToastMessage;
