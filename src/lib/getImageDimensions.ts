export const getImageDimensions = (src: string): Promise<{ width: number; height: number }> => {
    return new Promise((resolve) => {
        if (typeof window === 'undefined' || !src) {
            resolve({ width: 0, height: 0 });
            return;
        }

        const img = new Image();
        img.onload = () => {
            resolve({
                width: img.naturalWidth || 0,
                height: img.naturalHeight || 0,
            });
        };
        img.onerror = () => {
            resolve({ width: 0, height: 0 });
        };
        img.src = src;
    });
};

export const clampImageDimensions = (
    width: number | null | undefined,
    height: number | null | undefined,
    maxWidth?: number
): { width: number | null; height: number | null } => {
    if (!width || width <= 0) {
        return { width: null, height: height && height > 0 ? height : null };
    }
    if (!maxWidth || maxWidth <= 0 || width <= maxWidth) {
        return {
            width,
            height: height && height > 0 ? height : null,
        };
    }
    const ratio = height && height > 0 ? height / width : 0;
    const clampedWidth = maxWidth;
    const clampedHeight = ratio ? Math.round(clampedWidth * ratio) : null;
    return {
        width: clampedWidth,
        height: clampedHeight,
    };
};

