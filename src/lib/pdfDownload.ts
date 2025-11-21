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

                    // 섹션 헤더 스타일 적용
                    const sectionHeaders = clonedDoc.querySelectorAll('.bg-gray-100');
                    sectionHeaders.forEach((header) => {
                        const sectionNumberContainer = header.querySelector('.bg-gray-900.rounded-full') as HTMLElement;
                        if (sectionNumberContainer) {
                            const sectionNumberText = sectionNumberContainer.querySelector('span') as HTMLElement;
                            if (sectionNumberText) {
                                sectionNumberText.style.setProperty('top', '20%', 'important');
                            }
                        }
                        const sectionTitle = header.querySelector('h2.ds-subtitle') as HTMLElement;
                        if (sectionTitle) {
                            sectionTitle.style.setProperty('top', '20%', 'important');
                        }
                    });

                    // 하이라이트 배경색 위치 조정 (텍스트는 그대로, 배경만 조정)
                    const highlightWrappers = clonedDoc.querySelectorAll('span[style*="position: relative"][style*="display: inline-block"]');
                    highlightWrappers.forEach((wrapper) => {
                        const wrapperEl = wrapper as HTMLElement;
                        // 첫 번째 자식이 배경색 span
                        const bgSpan = wrapperEl.firstElementChild as HTMLElement;
                        if (bgSpan && bgSpan.style.backgroundColor) {
                            // 배경색 span의 top 값 조정 가능
                            bgSpan.style.setProperty('top', '0.8em', 'important');
                            bgSpan.style.setProperty('left', '0', 'important');
                            bgSpan.style.setProperty('right', '0', 'important');
                            bgSpan.style.setProperty('bottom', '0', 'important');
                            bgSpan.style.setProperty('z-index', '0', 'important');
                            bgSpan.style.setProperty('pointer-events', 'none', 'important');
                            bgSpan.style.setProperty('background-color', bgSpan.style.backgroundColor || '', 'important');
                        }
                    });

                    const listItems = clonedDoc.querySelectorAll('li');
                    listItems.forEach((li) => {
                        const liEl = li as HTMLElement;
                        liEl.style.setProperty('display', 'list-item', 'important');
                        liEl.style.setProperty('line-height', '1.6', 'important');
                        liEl.style.setProperty('vertical-align', 'baseline', 'important');
                    });

                    const bulletLists = clonedDoc.querySelectorAll('ul');
                    bulletLists.forEach((ul) => {
                        const ulEl = ul as HTMLElement;
                        ulEl.style.setProperty('list-style-type', 'none', 'important');
                        ulEl.style.setProperty('padding-left', '1.2rem', 'important');

                        const bulletItems = ulEl.querySelectorAll('li');
                        bulletItems.forEach((li) => {
                            const liEl = li as HTMLElement;
                            liEl.style.setProperty('list-style-type', 'none', 'important');
                            liEl.style.setProperty('position', 'relative', 'important');
                            liEl.style.setProperty('padding-left', '0.5rem', 'important');

                            let bulletSpan = liEl.querySelector('.pdf-bullet-marker') as HTMLElement | null;
                            if (!bulletSpan) {
                                bulletSpan = clonedDoc.createElement('span');
                                bulletSpan.className = 'pdf-bullet-marker';
                                bulletSpan.textContent = '•';
                                liEl.insertBefore(bulletSpan, liEl.firstChild);
                            }

                            bulletSpan.style.setProperty('position', 'absolute', 'important');
                            bulletSpan.style.setProperty('left', '-0.5rem', 'important');
                            bulletSpan.style.setProperty('top', '0.3em', 'important');
                            bulletSpan.style.setProperty('transform', 'translateY(-50%)', 'important');
                            bulletSpan.style.setProperty('line-height', '1', 'important');
                            bulletSpan.style.setProperty('font-size', '1.5rem', 'important');
                            bulletSpan.style.setProperty('color', '#4b5563', 'important');
                        });
                    });

                    const orderedLists = clonedDoc.querySelectorAll('ol');
                    orderedLists.forEach((ol) => {
                        const olEl = ol as HTMLElement;
                        olEl.style.setProperty('list-style-type', 'none', 'important');
                        olEl.style.setProperty('padding-left', '1.2rem', 'important');

                        // ol의 직접 자식 li만 선택 (중첩된 ul 내부의 li는 제외)
                        const orderedItems = Array.from(olEl.children).filter(
                            (child) => child.tagName === 'LI'
                        ) as HTMLElement[];

                        orderedItems.forEach((li, index) => {
                            const liEl = li as HTMLElement;
                            liEl.style.setProperty('list-style-type', 'none', 'important');
                            liEl.style.setProperty('position', 'relative', 'important');
                            liEl.style.setProperty('padding-left', '0.5rem', 'important');

                            let numberSpan = liEl.querySelector('.pdf-number-marker') as HTMLElement | null;
                            if (!numberSpan) {
                                numberSpan = clonedDoc.createElement('span');
                                numberSpan.className = 'pdf-number-marker';
                                numberSpan.textContent = `${index + 1}.`;
                                liEl.insertBefore(numberSpan, liEl.firstChild);
                            } else {
                                numberSpan.textContent = `${index + 1}.`;
                            }

                            numberSpan.style.setProperty('position', 'absolute', 'important');
                            numberSpan.style.setProperty('left', '-0.5rem', 'important');
                            numberSpan.style.setProperty('top', '0.72em', 'important');
                            numberSpan.style.setProperty('transform', 'translateY(-50%)', 'important');
                            numberSpan.style.setProperty('line-height', '1', 'important');
                            numberSpan.style.setProperty('font-size', '1rem', 'important');
                            numberSpan.style.setProperty('color', '#4b5563', 'important');

                            // 중첩된 ul이 있으면 padding-left 조정하여 겹치지 않도록
                            const nestedUl = liEl.querySelector('ul');
                            if (nestedUl) {
                                const nestedUlEl = nestedUl as HTMLElement;
                                nestedUlEl.style.setProperty('margin-left', '0.2rem', 'important');
                                nestedUlEl.style.setProperty('padding-left', '0.6rem', 'important');
                            }
                        });
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
