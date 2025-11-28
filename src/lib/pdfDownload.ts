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

        // 각 페이지를 개별적으로 찾기 (Preview.tsx에서 렌더링된 각 페이지 div)
        const pageElements = Array.from(
            previewContent.querySelectorAll('.bg-white.shadow-lg')
        ) as HTMLElement[];

        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4',
            compress: true, // PDF 압축 활성화
        });

        const imgWidth = 210; // A4 너비 (mm)
        const pageHeight = 297; // A4 높이 (mm)

        // 각 페이지를 개별적으로 캡처
        for (let i = 0; i < pageElements.length; i++) {
            const pageElement = pageElements[i];

            // 임시 데이터 속성 추가 (클론된 문서에서 찾기 위해)
            pageElement.setAttribute('data-pdf-page-index', String(i));

            // 각 페이지를 캡처
            const pageCanvas = await html2canvas(pageElement, {
                scale: 2,
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
                    // 클론된 문서에서 해당 페이지 요소 찾기
                    const clonedPage = clonedDoc.querySelector(
                        `[data-pdf-page-index="${i}"]`
                    ) as HTMLElement;
                    if (clonedPage) {
                        // 페이지 스타일 조정
                        clonedPage.style.height = 'auto';
                        clonedPage.style.maxHeight = 'none';
                        clonedPage.style.overflow = 'visible';

                        // 섹션 헤더 스타일 적용
                        const sectionHeaders = clonedPage.querySelectorAll('.bg-gray-100');
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

                        // 하이라이트가 여러 줄일 때 각 줄마다 배경이 보이도록 처리
                        const highlightSpans = clonedPage.querySelectorAll('span[style*="background-color"]');
                        highlightSpans.forEach((span) => {
                            const spanEl = span as HTMLElement;
                            const style = spanEl.getAttribute('style') || '';
                            const colorMatch = style.match(/background-color:\s*([^;]+)/i);
                            if (!colorMatch) return;
                            const bgColor = colorMatch[1].trim();
                            if (!bgColor || bgColor === 'transparent') return;

                            // 이미 처리된 하이라이트는 건너뜀
                            if (spanEl.dataset.pdfHighlightProcessed === 'true') return;
                            spanEl.dataset.pdfHighlightProcessed = 'true';

                            const originalHTML = spanEl.innerHTML;
                            const range = clonedDoc.createRange();
                            range.selectNodeContents(spanEl);
                            const rects = Array.from(range.getClientRects());
                            const spanRect = spanEl.getBoundingClientRect();

                            // 기존 배경은 투명 처리하고 텍스트가 위에 오도록 함
                            spanEl.style.backgroundColor = 'transparent';
                            spanEl.style.position = spanEl.style.position || 'relative';
                            spanEl.style.display = 'inline-block';
                            spanEl.style.zIndex = '0';

                            // 텍스트 레이어 생성 (z-index 1)
                            const textLayer = clonedDoc.createElement('span');
                            textLayer.innerHTML = originalHTML;
                            textLayer.style.position = 'relative';
                            textLayer.style.zIndex = '1';
                            textLayer.style.display = 'inline';
                            spanEl.innerHTML = '';
                            spanEl.appendChild(textLayer);

                            rects.forEach((rect) => {
                                if (!rect.width || !rect.height) return;
                                const overlay = clonedDoc.createElement('span');
                                overlay.style.position = 'absolute';
                                overlay.style.left = `${rect.left - spanRect.left}px`;

                                const offsetTop = rect.top - spanRect.top + rect.height * 0.5;
                                overlay.style.top = `${offsetTop}px`;

                                const overlayHeight = rect.height;
                                overlay.style.width = `${rect.width}px`;
                                overlay.style.height = `${overlayHeight}px`;
                                overlay.style.backgroundColor = bgColor;
                                overlay.style.borderRadius = '2px';
                                overlay.style.pointerEvents = 'none';
                                overlay.style.zIndex = '-1';
                                spanEl.insertBefore(overlay, spanEl.firstChild);
                            });
                        });

                        // 리스트 스타일 적용
                        const listItems = clonedPage.querySelectorAll('li');
                        listItems.forEach((li) => {
                            const liEl = li as HTMLElement;
                            liEl.style.setProperty('display', 'list-item', 'important');
                            liEl.style.setProperty('line-height', '1.6', 'important');
                            liEl.style.setProperty('vertical-align', 'baseline', 'important');
                        });

                        const bulletLists = clonedPage.querySelectorAll('ul');
                        bulletLists.forEach((ul) => {
                            const ulEl = ul as HTMLElement;
                            ulEl.style.setProperty('list-style-type', 'none', 'important');
                            ulEl.style.setProperty('padding-left', '1.2rem', 'important');

                            // ul의 직접 자식 li만 선택 (중첩된 ol 내부의 li는 제외)
                            const bulletItems = Array.from(ulEl.children).filter(
                                (child) => child.tagName === 'LI'
                            ) as HTMLElement[];

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

                                // ul의 li 내부에 중첩된 ol이 있는 경우 처리
                                const nestedOl = liEl.querySelector('ol');
                                if (nestedOl) {
                                    const nestedOlEl = nestedOl as HTMLElement;
                                    nestedOlEl.style.setProperty('list-style-type', 'none', 'important');
                                    nestedOlEl.style.setProperty('padding-left', '1.2rem', 'important');
                                    nestedOlEl.style.setProperty('margin-left', '0.2rem', 'important');

                                    // 중첩된 ol의 직접 자식 li만 선택
                                    const nestedOlItems = Array.from(nestedOlEl.children).filter(
                                        (child) => child.tagName === 'LI'
                                    ) as HTMLElement[];

                                    nestedOlItems.forEach((nestedLi, nestedIndex) => {
                                        const nestedLiEl = nestedLi as HTMLElement;
                                        nestedLiEl.style.setProperty('list-style-type', 'none', 'important');
                                        nestedLiEl.style.setProperty('position', 'relative', 'important');
                                        nestedLiEl.style.setProperty('padding-left', '0.5rem', 'important');

                                        let nestedNumberSpan = nestedLiEl.querySelector('.pdf-number-marker') as HTMLElement | null;
                                        if (!nestedNumberSpan) {
                                            nestedNumberSpan = clonedDoc.createElement('span');
                                            nestedNumberSpan.className = 'pdf-number-marker';
                                            nestedNumberSpan.textContent = `${nestedIndex + 1}.`;
                                            nestedLiEl.insertBefore(nestedNumberSpan, nestedLiEl.firstChild);
                                        } else {
                                            nestedNumberSpan.textContent = `${nestedIndex + 1}.`;
                                        }

                                        nestedNumberSpan.style.setProperty('position', 'absolute', 'important');
                                        nestedNumberSpan.style.setProperty('left', '-0.5rem', 'important');
                                        nestedNumberSpan.style.setProperty('top', '0.72em', 'important');
                                        nestedNumberSpan.style.setProperty('transform', 'translateY(-50%)', 'important');
                                        nestedNumberSpan.style.setProperty('line-height', '1', 'important');
                                        nestedNumberSpan.style.setProperty('font-size', '1rem', 'important');
                                        nestedNumberSpan.style.setProperty('color', '#4b5563', 'important');
                                    });
                                }
                            });
                        });

                        const orderedLists = clonedPage.querySelectorAll('ol');
                        orderedLists.forEach((ol) => {
                            const olEl = ol as HTMLElement;
                            olEl.style.setProperty('list-style-type', 'none', 'important');
                            olEl.style.setProperty('padding-left', '1.2rem', 'important');

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

            // JPEG로 변환
            const pageImgData = pageCanvas.toDataURL('image/jpeg', 0.85);
            // 첫 페이지가 아니면 새 페이지 추가
            if (i > 0) {
                pdf.addPage();
            }

            // 페이지에 이미지 추가 (항상 상단(0)에 배치, 페이지 높이에 맞춤)
            pdf.addImage(pageImgData, 'JPEG', 0, 0, imgWidth, pageHeight);

            // 임시 속성 제거
            pageElement.removeAttribute('data-pdf-page-index');
        }

        // 원래 스크롤 위치로 복원
        if (scrollContainer) {
            scrollContainer.scrollTop = originalScrollTop;
        }

        pdf.save(`${fileName}.pdf`);
    } catch (error) {
        console.error('PDF 다운로드 실패:', error);
        alert('PDF 다운로드에 실패했습니다.');
    }
};
