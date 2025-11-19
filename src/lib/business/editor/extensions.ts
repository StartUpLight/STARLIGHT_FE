import { Extension } from '@tiptap/core';
import type { Node as PMNode } from '@tiptap/pm/model';
import type { EditorState, Selection } from '@tiptap/pm/state';
import { Plugin } from '@tiptap/pm/state';
import { TextSelection } from '@tiptap/pm/state';
import { EditorView } from '@tiptap/pm/view';
import Image from '@tiptap/extension-image';

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
        };
    },

    addNodeView() {
        return ({ node, getPos, editor }) => {
            const dom = document.createElement('div');
            dom.className = 'image-wrapper';

            const imgContainer = document.createElement('div');
            imgContainer.className = 'image-container';
            imgContainer.style.display = 'inline-block';
            imgContainer.style.position = 'relative';

            const img = document.createElement('img');
            img.src = node.attrs.src;
            img.alt = node.attrs.alt || '';
            img.style.display = 'block';
            img.style.maxWidth = '100%';
            img.style.height = 'auto';
            img.style.cursor = 'pointer';

            const updateContainerWidth = () => {
                if (img.offsetWidth > 0) {
                    imgContainer.style.width = `${img.offsetWidth}px`;
                }
            };

            if (node.attrs.width) {
                img.style.width = `${node.attrs.width}px`;
                imgContainer.style.width = `${node.attrs.width}px`;
            } else {
                if (img.complete) {
                    setTimeout(updateContainerWidth, 0);
                } else {
                    img.onload = updateContainerWidth;
                }
            }

            if (node.attrs.height) {
                img.style.height = `${node.attrs.height}px`;
            }

            const resizeHandle = document.createElement('div');
            resizeHandle.className = 'image-resize-handle';
            resizeHandle.style.display = 'none';

            let isResizing = false;
            let startX = 0;
            let startWidth = 0;
            let startHeight = 0;

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
                const newWidth = Math.max(50, startWidth + deltaX);
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

            img.addEventListener('click', handleImageClick);

            const updateResizeHandle = () => {
                const pos = typeof getPos === 'function' ? getPos() : null;
                if (pos !== null && pos !== undefined) {
                    const isSelected = editor.state.selection.from === pos;
                    if (isSelected) {
                        resizeHandle.style.display = 'block';
                        img.classList.add('selected');
                    } else {
                        resizeHandle.style.display = 'none';
                        img.classList.remove('selected');
                    }
                }
            };

            editor.on('selectionUpdate', updateResizeHandle);
            updateResizeHandle();

            imgContainer.appendChild(img);
            imgContainer.appendChild(resizeHandle);
            dom.appendChild(imgContainer);

            return {
                dom,
                update: (updatedNode) => {
                    if (updatedNode.type.name !== 'image') {
                        return false;
                    }

                    img.src = updatedNode.attrs.src;
                    img.alt = updatedNode.attrs.alt || '';

                    if (updatedNode.attrs.width) {
                        img.style.width = `${updatedNode.attrs.width}px`;
                        imgContainer.style.width = `${updatedNode.attrs.width}px`;
                    } else {
                        img.style.width = '';
                        imgContainer.style.width = '';
                        if (img.complete) {
                            setTimeout(updateContainerWidth, 0);
                        } else {
                            img.onload = updateContainerWidth;
                        }
                    }

                    if (updatedNode.attrs.height) {
                        img.style.height = `${updatedNode.attrs.height}px`;
                    } else {
                        img.style.height = '';
                    }

                    return true;
                },
                destroy: () => {
                    editor.off('selectionUpdate', updateResizeHandle);
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

