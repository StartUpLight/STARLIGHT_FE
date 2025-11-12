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

        const canvas = await html2canvas(previewContent, {
            scale: 1.5, // 해상도 낮춰서 용량 감소 (2 -> 1.5)
            useCORS: true,
            allowTaint: false, // CORS 이미지 사용 시 필요
            logging: false,
            backgroundColor: '#ffffff',
            scrollX: 0,
            scrollY: 0,
            imageTimeout: 15000, // 이미지 로딩 타임아웃 증가
            removeContainer: true,
            foreignObjectRendering: false, // CORS 문제 해결을 위해 비활성화
            onclone: (clonedDoc) => {
                // 클론된 문서에서 모든 관련 요소 찾기
                const clonedPreview = clonedDoc.querySelector('[data-preview-content]') as HTMLElement;
                if (clonedPreview) {
                    // 부모 컨테이너의 높이 제한 제거
                    clonedPreview.style.height = 'auto';
                    clonedPreview.style.maxHeight = 'none';

                    // 외부 flex 컨테이너도 확인
                    const parentContainer = clonedPreview.parentElement;
                    if (parentContainer) {
                        parentContainer.style.height = 'auto';
                        parentContainer.style.maxHeight = 'none';
                    }

                    // 스크롤 컨테이너 찾기 및 스타일 변경
                    const clonedScrollContainer = clonedPreview.querySelector('.overflow-y-auto') as HTMLElement;
                    if (clonedScrollContainer) {
                        clonedScrollContainer.style.overflow = 'visible';
                        clonedScrollContainer.style.height = 'auto';
                        clonedScrollContainer.style.maxHeight = 'none';
                        clonedScrollContainer.style.flex = 'none';
                        clonedScrollContainer.scrollTop = 0;
                    }

                    // 모든 이미지에 crossOrigin 속성 설정 (CORS 문제 해결)
                    const images = clonedDoc.querySelectorAll('img');
                    images.forEach((img) => {
                        const imgElement = img as HTMLImageElement;
                        // 이미 crossOrigin이 설정되어 있지 않은 경우에만 설정
                        if (!imgElement.crossOrigin) {
                            imgElement.crossOrigin = 'anonymous';
                        }
                    });
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
