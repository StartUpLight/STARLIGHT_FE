export const downloadPDF = async (fileName: string = '사업계획서') => {
    try {
        const html2canvas = (await import('html2canvas')).default;
        const { jsPDF } = await import('jspdf') as { jsPDF: typeof import('jspdf').jsPDF };

        const previewContent = document.querySelector('[data-preview-content]') as HTMLElement;
        if (!previewContent) {
            alert('미리보기 내용을 찾을 수 없습니다.');
            return;
        }

        // 스크롤을 맨 위로 이동
        const scrollContainer = previewContent.querySelector('.overflow-y-auto') as HTMLElement;
        const originalScrollTop = scrollContainer?.scrollTop || 0;
        if (scrollContainer) {
            scrollContainer.scrollTop = 0;
        }

        // 이미지를 미리 로드하여 CORS 문제 해결
        const images = Array.from(previewContent.querySelectorAll('img')) as HTMLImageElement[];
        const imagePromises = images.map(async (img) => {
            if (!img.src || img.src.startsWith('data:')) {
                return;
            }

            try {
                // fetch를 사용하여 이미지를 blob으로 가져오기 (CORS 헤더가 있는 경우)
                const separator = img.src.includes('?') ? '&' : '?';
                const imageUrl = img.src + separator + '_t=' + new Date().getTime();

                const response = await fetch(imageUrl, {
                    mode: 'cors',
                    credentials: 'omit',
                });

                if (response.ok) {
                    const blob = await response.blob();
                    const blobUrl = URL.createObjectURL(blob);

                    // blob URL을 사용하여 이미지 로드
                    const imgElement = new Image();
                    imgElement.crossOrigin = 'anonymous';

                    await new Promise<void>((resolve, reject) => {
                        imgElement.onload = () => {
                            try {
                                // 이미지를 base64로 변환하여 CORS 문제 완전히 우회
                                const canvas = document.createElement('canvas');
                                canvas.width = imgElement.width;
                                canvas.height = imgElement.height;
                                const ctx = canvas.getContext('2d');
                                if (ctx) {
                                    ctx.drawImage(imgElement, 0, 0);
                                    const dataUrl = canvas.toDataURL('image/png');
                                    img.src = dataUrl;
                                    URL.revokeObjectURL(blobUrl);
                                }
                            } catch (e) {
                                console.warn('이미지 변환 실패:', e);
                            }
                            resolve();
                        };

                        imgElement.onerror = () => {
                            URL.revokeObjectURL(blobUrl);
                            reject(new Error('이미지 로드 실패'));
                        };

                        imgElement.src = blobUrl;
                    });
                } else {
                    // fetch 실패 시 원본 이미지에 crossOrigin 설정만 추가
                    img.crossOrigin = 'anonymous';
                    const separator2 = img.src.includes('?') ? '&' : '?';
                    img.src = img.src + separator2 + '_t=' + new Date().getTime();
                }
            } catch (e) {
                // fetch 실패 시 원본 이미지에 crossOrigin 설정만 추가
                console.warn('이미지 fetch 실패, 원본 URL 사용:', e);
                img.crossOrigin = 'anonymous';
                const separator = img.src.includes('?') ? '&' : '?';
                img.src = img.src + separator + '_t=' + new Date().getTime();
            }
        });

        // 모든 이미지 로드 완료 대기
        await Promise.all(imagePromises);

        const canvas = await html2canvas(previewContent, {
            scale: 1.5,
            useCORS: true,
            allowTaint: false,
            logging: false,
            backgroundColor: '#ffffff',
            scrollX: 0,
            scrollY: 0,
            imageTimeout: 15000,
            removeContainer: true,
            foreignObjectRendering: false,
            onclone: (clonedDoc) => {
                const clonedPreview = clonedDoc.querySelector('[data-preview-content]') as HTMLElement;
                if (clonedPreview) {
                    clonedPreview.style.height = 'auto';
                    clonedPreview.style.maxHeight = 'none';
                    const parentContainer = clonedPreview.parentElement;
                    if (parentContainer) {
                        parentContainer.style.height = 'auto';
                        parentContainer.style.maxHeight = 'none';
                    }
                    const clonedScrollContainer = clonedPreview.querySelector('.overflow-y-auto') as HTMLElement;
                    if (clonedScrollContainer) {
                        clonedScrollContainer.style.overflow = 'visible';
                        clonedScrollContainer.style.height = 'auto';
                        clonedScrollContainer.style.maxHeight = 'none';
                        clonedScrollContainer.style.flex = 'none';
                        clonedScrollContainer.scrollTop = 0;
                    }
                }
            },
        });

        // 원래 스크롤 위치로 복원
        if (scrollContainer) {
            scrollContainer.scrollTop = originalScrollTop;
        }

        // JPEG로 변환하여 용량 감소 (품질 0.85로 설정)
        const imgData = canvas.toDataURL('image/jpeg', 0.85);
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4',
            compress: true, // PDF 압축 활성화
        });

        const imgWidth = 210;
        const pageHeight = 297;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft > 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }

        pdf.save(`${fileName}.pdf`);
    } catch (error) {
        console.error('PDF 다운로드 실패:', error);
        alert('PDF 다운로드에 실패했습니다.');
    }
};
