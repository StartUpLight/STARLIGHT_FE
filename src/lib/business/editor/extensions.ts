import { Extension } from '@tiptap/core';
import type { Node as PMNode } from '@tiptap/pm/model';
import type { EditorState, Selection } from '@tiptap/pm/state';
import { NodeSelection, Plugin, TextSelection } from '@tiptap/pm/state';
import { EditorView } from '@tiptap/pm/view';
import Image from '@tiptap/extension-image';

const CaptionIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
  <path d="M15.5186 18.2002C15.9604 18.2002 16.3184 18.5582 16.3184 19C16.3184 19.4418 15.9604 19.7998 15.5186 19.7998H5.51855C5.07673 19.7998 4.71875 19.4418 4.71875 19C4.71875 18.5582 5.07673 18.2002 5.51855 18.2002H15.5186ZM18.5186 14.5703C18.9604 14.5703 19.3184 14.9283 19.3184 15.3701C19.3184 15.8119 18.9604 16.1699 18.5186 16.1699H5.51855C5.07673 16.1699 4.71875 15.8119 4.71875 15.3701C4.71875 14.9283 5.07673 14.5703 5.51855 14.5703H18.5186ZM15.9629 4C16.5356 4 17 4.46437 17 5.03711V11.9629C17 12.5356 16.5356 13 15.9629 13H6.03711L5.93066 12.9951C5.40787 12.9419 5 12.4997 5 11.9629V5.03711C5 4.50027 5.40787 4.05812 5.93066 4.00488L6.03711 4H15.9629ZM6.59961 11.4004H15.4004V5.59961H6.59961V11.4004Z" fill="#585F69"/>
</svg>`
const CaptionActiveIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
  <path d="M15.5186 18.2002C15.9604 18.2002 16.3184 18.5582 16.3184 19C16.3184 19.4418 15.9604 19.7998 15.5186 19.7998H5.51855C5.07673 19.7998 4.71875 19.4418 4.71875 19C4.71875 18.5582 5.07673 18.2002 5.51855 18.2002H15.5186ZM18.5186 14.5703C18.9604 14.5703 19.3184 14.9283 19.3184 15.3701C19.3184 15.8119 18.9604 16.1699 18.5186 16.1699H5.51855C5.07673 16.1699 4.71875 15.8119 4.71875 15.3701C4.71875 14.9283 5.07673 14.5703 5.51855 14.5703H18.5186ZM15.9629 4C16.5356 4 17 4.46437 17 5.03711V11.9629C17 12.5356 16.5356 13 15.9629 13H6.03711L5.93066 12.9951C5.40787 12.9419 5 12.4997 5 11.9629V5.03711C5 4.50027 5.40787 4.05812 5.93066 4.00488L6.03711 4H15.9629ZM6.59961 11.4004H15.4004V5.59961H6.59961V11.4004Z" fill="#6F55FF"/>
</svg>`
const CaptionTooltipSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="49" height="45" viewBox="0 0 49 45" fill="none">
  <path d="M24.293 0.292804C24.6835 -0.0976015 25.3165 -0.0976014 25.707 0.292804L32.7148 7.30059H41C45.4182 7.30059 48.9999 10.8824 49 15.3006V36.3005C49 40.7187 45.4183 44.3005 41 44.3005H8C3.58172 44.3005 0 40.7187 0 36.3005V15.3006C7.35107e-05 10.8824 3.58177 7.30059 8 7.30059H17.2852L24.293 0.292804Z" fill="#191F28"/>
</svg>`

export const DeleteTableOnDelete = Extension.create({
    name: 'delete-table-on-delete',
    addKeyboardShortcuts() {
        return {
            Delete: ({ editor }) => {
                if (editor.isActive('table')) {
                    return editor.commands.deleteTable();
                }
                return false;
            },
        };
    },
});

// 이미지 잘라내기/복사 Extension
export const ImageCutPaste = Extension.create({
    name: 'imageCutPaste',
    addKeyboardShortcuts() {
        const copyImageToClipboard = (imageSrc: string) => {
            if (
                typeof navigator !== 'undefined' &&
                navigator.clipboard &&
                navigator.clipboard.write
            ) {
                fetch(imageSrc)
                    .then((res) => res.blob())
                    .then((blob) => {
                        const clipboardItem = new ClipboardItem({
                            [blob.type || 'image/png']: blob,
                        });
                        return navigator.clipboard.write([clipboardItem]);
                    })
                    .catch(() => { });
            }
        };

        const findImageNode = (state: EditorState, selection: Selection) => {
            const { $from } = selection;
            let imageNode: PMNode | null = null;
            let imagePos = -1;

            if (selection.empty) {
                for (let d = $from.depth; d > 0; d--) {
                    const node = $from.node(d);
                    if (node.type.name === 'image') {
                        imageNode = node;
                        imagePos = $from.before(d);
                        break;
                    }
                }
            } else {
                state.doc.nodesBetween(selection.from, selection.to, (node: PMNode, pos: number) => {
                    if (node.type.name === 'image') {
                        imageNode = node;
                        imagePos = pos;
                    }
                });
            }

            return { imageNode, imagePos };
        };

        return {
            'Mod-x': ({ editor }) => {
                const { state } = editor;
                const { selection } = state;
                const { imageNode, imagePos } = findImageNode(state, selection);

                if (imageNode && imageNode.attrs.src) {
                    copyImageToClipboard(imageNode.attrs.src);

                    setTimeout(() => {
                        editor
                            .chain()
                            .focus()
                            .setTextSelection({
                                from: imagePos,
                                to: imagePos + imageNode.nodeSize,
                            })
                            .deleteSelection()
                            .run();
                    }, 10);

                    return true;
                }

                return false;
            },
            'Mod-c': ({ editor }) => {
                const { state } = editor;
                const { selection } = state;
                const { imageNode } = findImageNode(state, selection);

                if (imageNode && imageNode.attrs.src) {
                    copyImageToClipboard(imageNode.attrs.src);
                    return true;
                }

                return false;
            },
        };
    },
});

// 리사이즈 가능한 이미지 Extension
export const ResizableImage = Image.extend({
    addAttributes() {
        return {
            ...this.parent?.(),
            width: {
                default: null,
                renderHTML: (attributes) => {
                    if (!attributes.width) {
                        return {};
                    }
                    return {
                        width: attributes.width,
                    };
                },
            },
            height: {
                default: null,
                renderHTML: (attributes) => {
                    if (!attributes.height) {
                        return {};
                    }
                    return {
                        height: attributes.height,
                    };
                },
            },
            caption: {
                default: null,
            },
        };
    },

    addNodeView() {
        return ({ node, getPos, editor }) => {
            let currentNode = node;
            const dom = document.createElement('div');
            dom.className = 'image-wrapper';

            const imgContainer = document.createElement('div');
            imgContainer.className = 'image-container';
            imgContainer.style.display = 'inline-block';
            imgContainer.style.position = 'relative';

            const img = document.createElement('img');
            img.src = node.attrs.src;
            img.alt = node.attrs.alt || '';
            img.style.display = 'inline-block';
            img.style.maxWidth = '100%';
            img.style.height = 'auto';
            img.style.cursor = 'pointer';

            const getAvailableWidth = () => {
                const cell = img.closest('td, th') as HTMLElement | null;
                if (cell) {
                    const computed = window.getComputedStyle(cell);
                    const paddingLeft = parseFloat(computed.paddingLeft || '0');
                    const paddingRight = parseFloat(computed.paddingRight || '0');
                    const available = cell.clientWidth - paddingLeft - paddingRight - 8;
                    return Math.max(50, available);
                }
                const editorDom = editor.view.dom as HTMLElement | null;
                if (editorDom) {
                    const padding = 48;
                    return Math.max(50, editorDom.clientWidth - padding);
                }
                return null;
            };

            const clampWidth = (width: number, height: number) => {
                const availableWidth = getAvailableWidth();
                if (availableWidth) {
                    const maxWidth = Math.max(50, availableWidth);
                    if (width > maxWidth) {
                        const ratio = height > 0 ? height / width : 0;
                        return {
                            width: maxWidth,
                            height: ratio ? Math.round(maxWidth * ratio) : height,
                        };
                    }
                }
                return { width, height };
            };

            const toNumber = (value: unknown): number | null => {
                if (typeof value === 'number' && !Number.isNaN(value)) return value;
                if (typeof value === 'string') {
                    const parsed = parseFloat(value);
                    return Number.isNaN(parsed) ? null : parsed;
                }
                return null;
            };

            const applyExplicitSize = (width?: number | null, height?: number | null) => {
                if (typeof width === 'number' && !Number.isNaN(width)) {
                    img.style.width = `${width}px`;
                    imgContainer.style.width = `${width}px`;
                } else {
                    img.style.width = '';
                    imgContainer.style.width = 'auto';
                }

                if (typeof height === 'number' && !Number.isNaN(height)) {
                    img.style.height = `${height}px`;
                } else {
                    img.style.height = '';
                }
            };

            const updateImageSize = async (width: number, height: number) => {
                const pos = typeof getPos === 'function' ? getPos() : null;
                if (pos === null || pos === undefined) return;
                editor
                    .chain()
                    .setNodeSelection(pos)
                    .updateAttributes('image', { width, height })
                    .run();
                const transaction = editor.state.tr;
                editor.emit('update', { editor, transaction });
            };

            const ensureSizeWithinBounds = (sourceWidth?: number | null, sourceHeight?: number | null) => {
                if (!img.naturalWidth || !img.naturalHeight) return;
                const baseWidth = sourceWidth ?? img.naturalWidth;
                const baseHeight = sourceHeight ?? img.naturalHeight;
                const { width, height } = clampWidth(baseWidth, baseHeight);
                const attrWidth = toNumber(currentNode.attrs.width);
                const attrHeight = toNumber(currentNode.attrs.height);

                applyExplicitSize(width, height);

                if (attrWidth !== width || attrHeight !== height || attrWidth === null) {
                    updateImageSize(width, height);
                }
            };

            const initializeSize = () => {
                const currentWidth = toNumber(currentNode.attrs.width);
                const currentHeight = toNumber(currentNode.attrs.height);
                ensureSizeWithinBounds(currentWidth, currentHeight);
            };

            if (img.complete) {
                initializeSize();
            } else {
                img.addEventListener('load', initializeSize, { once: true });
            }

            const resizeHandle = document.createElement('div');
            resizeHandle.className = 'image-resize-handle';
            resizeHandle.style.display = 'none';

            let isResizing = false;
            let startX = 0;
            let startWidth = 0;
            let startHeight = 0;
            let hasUserInteraction = false;

            const handlePointerDown = () => {
                hasUserInteraction = true;
                if (!editor.view.hasFocus()) {
                    editor.view.focus();
                }
            };

            const handleMouseDown = (e: MouseEvent) => {
                e.preventDefault();
                e.stopPropagation();
                isResizing = true;
                startX = e.clientX;
                startWidth = img.offsetWidth;
                startHeight = img.offsetHeight;

                document.addEventListener('mousemove', handleMouseMove);
                document.addEventListener('mouseup', handleMouseUp);
            };

            const handleMouseMove = (e: MouseEvent) => {
                if (!isResizing) return;

                const deltaX = e.clientX - startX;
                const aspectRatio = startHeight / startWidth;
                let newWidth = Math.max(50, startWidth + deltaX);
                const availableWidth = getAvailableWidth();
                if (availableWidth) {
                    newWidth = Math.min(newWidth, availableWidth);
                }
                const newHeight = newWidth * aspectRatio;

                img.style.width = `${newWidth}px`;
                img.style.height = `${newHeight}px`;
                imgContainer.style.width = `${newWidth}px`;
            };

            const handleMouseUp = () => {
                if (isResizing) {
                    isResizing = false;
                    const finalWidth = img.offsetWidth;
                    const finalHeight = img.offsetHeight;
                    updateImageSize(finalWidth, finalHeight);
                }

                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };

            resizeHandle.addEventListener('mousedown', handleMouseDown);

            const handleImageClick = () => {
                const pos = typeof getPos === 'function' ? getPos() : null;
                if (pos !== null && pos !== undefined) {
                    editor.chain().setNodeSelection(pos).run();
                }
            };

            img.addEventListener('pointerdown', handlePointerDown);
            img.addEventListener('click', handleImageClick);
            editor.on('focus', handlePointerDown);

            const updateResizeHandle = () => {
                const pos = typeof getPos === 'function' ? getPos() : null;
                if (pos === null || pos === undefined) return;

                const selection = editor.state.selection;
                const viewFocused = editor.view.hasFocus();

                if (
                    !hasUserInteraction &&
                    !viewFocused &&
                    selection instanceof NodeSelection &&
                    selection.from === pos
                ) {
                    editor.commands.setTextSelection(selection.from);
                    return;
                }

                const allowSelection = viewFocused || hasUserInteraction;
                const isSelected =
                    allowSelection &&
                    selection instanceof NodeSelection &&
                    selection.from === pos;
                if (isSelected) {
                    img.classList.add('selected');
                    resizeHandle.style.display = 'block';
                } else {
                    img.classList.remove('selected');
                    resizeHandle.style.display = 'none';
                }
            };

            editor.on('selectionUpdate', updateResizeHandle);
            updateResizeHandle();

            imgContainer.appendChild(img);
            imgContainer.appendChild(resizeHandle);
            dom.appendChild(imgContainer);

            // 캡션 기능 (표 안에 있으면 제외)
            const isInTable = () => {
                const pos = typeof getPos === 'function' ? getPos() : null;
                if (pos === null) return img.closest('td, th') !== null;
                const { state } = editor;
                const resolved = state.doc.resolve(pos);
                for (let d = resolved.depth; d > 0; d--) {
                    if (resolved.node(d).type.name === 'table') return true;
                }
                return false;
            };

            if (!isInTable()) {
                // 버튼
                const btn = document.createElement('div');
                btn.className = 'image-caption-btn';
                btn.style.cssText = 'position:absolute;top:12px;right:12px;width:28px;height:28px;background:#fff;border-radius:4px;display:none;align-items:center;justify-content:center;cursor:pointer;z-index:20;';
                const iconDiv = document.createElement('div');
                iconDiv.style.cssText = 'width:24px;height:24px;display:flex;align-items:center;justify-content:center';
                iconDiv.innerHTML = CaptionIconSvg;
                btn.appendChild(iconDiv);

                // 툴팁
                const tooltip = document.createElement('div');
                tooltip.className = 'image-caption-tooltip';
                tooltip.style.cssText = 'position:absolute;top:44px;right:2px;z-index:21;display:none;pointer-events:none';
                const tooltipSvg = document.createElement('div');
                tooltipSvg.style.cssText = 'position:relative;display:inline-block';
                tooltipSvg.innerHTML = CaptionTooltipSvg;
                const tooltipText = document.createElement('div');
                tooltipText.textContent = '캡션';
                tooltipText.style.cssText = 'position:absolute;top:55%;left:50%;transform:translate(-50%,-50%);color:#fff;font-size:14px;white-space:nowrap;pointer-events:none';
                tooltipSvg.appendChild(tooltipText);
                tooltip.appendChild(tooltipSvg);
                // 입력 필드
                const input = document.createElement('input');
                input.type = 'text';
                input.placeholder = '캡션을 입력하세요';
                input.style.cssText = 'margin-top:8px;padding:8px 12px;width:100%;font-size:14px;border:1px solid #dadfe7;border-radius:6px;outline:none;display:none;box-sizing:border-box';

                // 이벤트
                let isEditing = false;
                imgContainer.addEventListener('mouseenter', () => {
                    if (!isEditing) btn.style.display = 'flex';
                });
                imgContainer.addEventListener('mouseleave', () => {
                    if (!isEditing) {
                        btn.style.display = 'none';
                        tooltip.style.display = 'none';
                        iconDiv.innerHTML = CaptionIconSvg;
                    }
                });
                btn.addEventListener('mouseenter', () => {
                    if (!isEditing) {
                        tooltip.style.display = 'block';
                        iconDiv.innerHTML = CaptionActiveIconSvg;
                        btn.style.backgroundColor = '#EAE5FF';
                    }
                });
                btn.addEventListener('mouseleave', () => {
                    if (!isEditing) {
                        tooltip.style.display = 'none';
                        iconDiv.innerHTML = CaptionIconSvg;
                        btn.style.backgroundColor = '#fff';
                    }
                });
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    isEditing = true;
                    input.value = currentNode.attrs.caption || '';
                    input.style.display = 'block';
                    btn.style.display = 'none';
                    tooltip.style.display = 'none';
                    setTimeout(() => input.focus(), 0);
                });
                const saveCaption = () => {
                    const newCaption = input.value.trim();
                    const pos = typeof getPos === 'function' ? getPos() : null;
                    if (pos !== null) {
                        editor.chain().setNodeSelection(pos).updateAttributes('image', { caption: newCaption || null }).run();
                    }
                    input.style.display = 'none';
                    isEditing = false;
                };
                input.addEventListener('blur', saveCaption);
                input.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        saveCaption();
                    } else if (e.key === 'Escape') {
                        input.style.display = 'none';
                        isEditing = false;
                    }
                });

                imgContainer.appendChild(btn);
                imgContainer.appendChild(tooltip);
                dom.appendChild(input);
            }

            const waitAndInitialize = () => {
                if (!img.isConnected) return;
                initializeSize();
            };

            requestAnimationFrame(() => {
                requestAnimationFrame(waitAndInitialize);
            });

            return {
                dom,
                update: (updatedNode) => {
                    if (updatedNode.type.name !== 'image') {
                        return false;
                    }

                    currentNode = updatedNode;
                    img.src = updatedNode.attrs.src;
                    img.alt = updatedNode.attrs.alt || '';
                    const updatedWidth = toNumber(updatedNode.attrs.width);
                    const updatedHeight = toNumber(updatedNode.attrs.height);
                    ensureSizeWithinBounds(updatedWidth, updatedHeight);

                    return true;
                },
                destroy: () => {
                    editor.off('selectionUpdate', updateResizeHandle);
                    editor.off('focus', handlePointerDown);
                    img.removeEventListener('pointerdown', handlePointerDown);
                    document.removeEventListener('mousemove', handleMouseMove);
                    document.removeEventListener('mouseup', handleMouseUp);
                },
            };
        };
    },
});

// 표 테두리 클릭 시 전체 선택 Extension
export const SelectTableOnBorderClick = Extension.create({
    name: 'select-table-on-border-click',
    addProseMirrorPlugins() {
        // 표 전체 선택 상태를 추적하는 함수
        const updateTableSelection = (view: EditorView) => {
            const { state } = view;
            const { selection, doc } = state;

            if (selection.empty) {
                // 선택이 없으면 모든 표에서 클래스 제거
                const tables = view.dom.querySelectorAll('table.table-selected');
                tables.forEach((table: Element) => {
                    if (table instanceof HTMLElement) {
                        table.classList.remove('table-selected');
                    }
                });
                return;
            }

            // 선택 범위 내의 모든 표 찾기
            const selectedTables = new Set<HTMLElement>();

            doc.nodesBetween(selection.from, selection.to, (node: PMNode, pos: number) => {
                if (node.type.name === 'table') {
                    const dom = view.nodeDOM(pos);
                    if (dom && dom instanceof HTMLElement) {
                        const tableElement = dom.closest('table') as HTMLElement;
                        if (tableElement) {
                            // 표 전체가 선택되었는지 확인
                            const tableStart = pos + 1;
                            const tableEnd = pos + node.nodeSize - 1;

                            // 선택 범위가 표 전체를 포함하는지 확인
                            if (selection.from <= tableStart && selection.to >= tableEnd) {
                                selectedTables.add(tableElement);
                            }
                        }
                    }
                }
            });

            // 모든 표에서 클래스 제거
            const allTables = view.dom.querySelectorAll('table');
            allTables.forEach((table: Element) => {
                if (table instanceof HTMLElement) {
                    table.classList.remove('table-selected');
                }
            });

            // 선택된 표에 클래스 추가
            selectedTables.forEach((table) => {
                table.classList.add('table-selected');
            });
        };

        return [
            new Plugin({
                view(editorView) {
                    return {
                        update: (view, prevState) => {
                            if (view.state.selection !== prevState.selection) {
                                updateTableSelection(view);
                            }
                        },
                        destroy: () => {
                            // 정리 작업
                            const tables = editorView.dom.querySelectorAll('table.table-selected');
                            tables.forEach((table) => {
                                if (table instanceof HTMLElement) {
                                    table.classList.remove('table-selected');
                                }
                            });
                        },
                    };
                },
                props: {
                    handleDOMEvents: {
                        mousemove: (view, event) => {
                            const target = event.target as HTMLElement;
                            const tableElement = target.closest('table');

                            if (!tableElement) return false;

                            // 테두리 영역인지 확인
                            const rect = tableElement.getBoundingClientRect();
                            const mouseX = event.clientX;
                            const mouseY = event.clientY;

                            const borderThreshold = 8; // 테두리 영역으로 간주할 픽셀 수
                            const isOnBorder =
                                mouseX <= rect.left + borderThreshold ||
                                mouseX >= rect.right - borderThreshold ||
                                mouseY <= rect.top + borderThreshold ||
                                mouseY >= rect.bottom - borderThreshold;

                            // 테두리 영역에 cursor-pointer 적용
                            if (isOnBorder) {
                                tableElement.style.cursor = 'pointer';
                            } else {
                                tableElement.style.cursor = '';
                            }

                            return false;
                        },
                        mousedown: (view, event) => {
                            const target = event.target as HTMLElement;
                            const tableElement = target.closest('table');

                            if (!tableElement) return false;

                            // 테두리 영역인지 확인
                            const rect = tableElement.getBoundingClientRect();
                            const clickX = event.clientX;
                            const clickY = event.clientY;

                            const borderThreshold = 8; // 테두리 영역으로 간주할 픽셀 수
                            const isOnBorder =
                                clickX <= rect.left + borderThreshold ||
                                clickX >= rect.right - borderThreshold ||
                                clickY <= rect.top + borderThreshold ||
                                clickY >= rect.bottom - borderThreshold;

                            // 테두리 영역이 아니면 처리하지 않음
                            if (!isOnBorder) return false;

                            // 클릭 위치에서 표 노드 찾기
                            const pos = view.posAtCoords({ left: clickX, top: clickY });
                            if (!pos) return false;

                            const { state } = view;
                            const { doc } = state;
                            const $pos = doc.resolve(pos.pos);

                            // 표 내부인지 확인
                            let tableNode: PMNode | null = null;
                            let tablePos = -1;

                            for (let d = $pos.depth; d > 0; d--) {
                                const node = $pos.node(d);
                                if (node.type.name === 'table') {
                                    tableNode = node;
                                    tablePos = $pos.before(d);
                                    break;
                                }
                            }

                            if (!tableNode) return false;

                            // 표의 첫 번째 셀과 마지막 셀 찾기
                            const tableStart = tablePos + 1;
                            const tableEnd = tableStart + tableNode.nodeSize - 1;

                            let firstCellStart = -1;
                            let lastCellEnd = -1;

                            // 표의 모든 셀을 순회하며 첫 번째와 마지막 셀 찾기
                            doc.nodesBetween(tableStart, tableEnd, (node, pos) => {
                                if (node.type.name === 'tableCell' || node.type.name === 'tableHeader') {
                                    // 첫 번째 셀의 시작 위치 찾기
                                    if (firstCellStart === -1) {
                                        // 셀 내부의 첫 번째 텍스트 노드 찾기
                                        let found = false;
                                        node.descendants((child, childPos) => {
                                            if (child.isText && !found) {
                                                firstCellStart = pos + childPos + 1;
                                                found = true;
                                            }
                                        });
                                        // 텍스트 노드가 없으면 셀 시작 위치 사용
                                        if (firstCellStart === -1) {
                                            firstCellStart = pos + 1;
                                        }
                                    }
                                    // 마지막 셀의 끝 위치 업데이트
                                    lastCellEnd = pos + node.nodeSize - 1;
                                }
                            });

                            if (firstCellStart !== -1 && lastCellEnd !== -1) {
                                event.preventDefault();
                                event.stopPropagation();

                                // 표 전체를 텍스트 선택으로 선택
                                const tr = view.state.tr;
                                try {
                                    const selection = TextSelection.create(tr.doc, firstCellStart, lastCellEnd);
                                    tr.setSelection(selection);
                                    view.dispatch(tr);
                                    view.focus();

                                    // 선택 후 표에 클래스 추가
                                    setTimeout(() => {
                                        updateTableSelection(view);
                                    }, 0);

                                    return true;
                                } catch (e) {
                                    // 선택 실패 시 무시
                                    console.warn('표 선택 실패:', e);
                                    return false;
                                }
                            }

                            return false;
                        },
                    },
                },
            }),
        ];
    },
});

