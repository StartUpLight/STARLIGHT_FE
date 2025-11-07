import { Extension } from '@tiptap/core';
import type { Node as PMNode } from '@tiptap/pm/model';
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
        return {
            'Mod-x': ({ editor }) => {
                const { state } = editor;
                const { selection } = state;
                const { $from } = selection;

                // 선택된 노드가 이미지인지 확인
                let imageNode: PMNode | null = null;
                let imagePos = -1;

                if (selection.empty) {
                    // 커서 위치에서 이미지 찾기
                    for (let d = $from.depth; d > 0; d--) {
                        const node = $from.node(d);
                        if (node.type.name === 'image') {
                            imageNode = node;
                            imagePos = $from.before(d);
                            break;
                        }
                    }
                } else {
                    // 선택 범위에서 이미지 찾기
                    state.doc.nodesBetween(
                        selection.from,
                        selection.to,
                        (node: PMNode, pos: number) => {
                            if (node.type.name === 'image') {
                                imageNode = node;
                                imagePos = pos;
                            }
                        }
                    );
                }

                if (imageNode) {
                    const imageSrc = imageNode.attrs.src;

                    // 클립보드에 이미지 복사 (잘라내기용)
                    if (
                        imageSrc &&
                        typeof navigator !== 'undefined' &&
                        navigator.clipboard &&
                        navigator.clipboard.write
                    ) {
                        if (imageSrc.startsWith('data:')) {
                            // base64 이미지를 Blob으로 변환
                            const base64resonse = fetch(imageSrc);
                            base64resonse
                                .then((res) => res.blob())
                                .then((blob) => {
                                    const clipboardItem = new ClipboardItem({
                                        [blob.type || 'image/png']: blob,
                                    });
                                    return navigator.clipboard.write([clipboardItem]);
                                })
                                .catch(() => {
                                    // 복사 실패 시에도 잘라내기 진행
                                });
                        } else {
                            // URL 이미지
                            fetch(imageSrc)
                                .then((res) => res.blob())
                                .then((blob) => {
                                    const clipboardItem = new ClipboardItem({
                                        [blob.type || 'image/png']: blob,
                                    });
                                    return navigator.clipboard.write([clipboardItem]);
                                })
                                .catch(() => {
                                    // 복사 실패 시에도 잘라내기 진행
                                });
                        }
                    }

                    // 이미지 삭제 (잘라내기)
                    const _imageNode = imageNode; // capture for type-narrowing in async closure
                    const _imagePos = imagePos;
                    setTimeout(() => {
                        if (!_imageNode) return;
                        editor
                            .chain()
                            .focus()
                            .setTextSelection({
                                from: _imagePos,
                                to: _imagePos + _imageNode.nodeSize,
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
                const { $from } = selection;

                // 선택된 노드가 이미지인지 확인
                let imageNode: PMNode | null = null;

                if (selection.empty) {
                    // 커서 위치에서 이미지 찾기
                    for (let d = $from.depth; d > 0; d--) {
                        const node = $from.node(d);
                        if (node.type.name === 'image') {
                            imageNode = node;
                            break;
                        }
                    }
                } else {
                    // 선택 범위에서 이미지 찾기
                    state.doc.nodesBetween(
                        selection.from,
                        selection.to,
                        (node: PMNode) => {
                            if (node.type.name === 'image') {
                                imageNode = node;
                            }
                        }
                    );
                }

                if (imageNode && imageNode.attrs.src) {
                    const imageSrc = imageNode.attrs.src;

                    // 클립보드에 이미지 복사
                    if (
                        typeof navigator !== 'undefined' &&
                        navigator.clipboard &&
                        navigator.clipboard.write
                    ) {
                        if (imageSrc.startsWith('data:')) {
                            fetch(imageSrc)
                                .then((res) => res.blob())
                                .then((blob) => {
                                    const clipboardItem = new ClipboardItem({
                                        [blob.type || 'image/png']: blob,
                                    });
                                    return navigator.clipboard.write([clipboardItem]);
                                })
                                .catch(() => { });
                        } else {
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
                    }

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

            if (node.attrs.width) {
                img.style.width = `${node.attrs.width}px`;
                imgContainer.style.width = `${node.attrs.width}px`;
            } else {
                // 이미지 로드 후 컨테이너 너비 설정
                const updateContainerWidth = () => {
                    if (!node.attrs.width && img.offsetWidth > 0) {
                        imgContainer.style.width = `${img.offsetWidth}px`;
                    }
                };
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
            let startY = 0;
            let startWidth = 0;
            let startHeight = 0;

            const updateImageSize = (width: number, height: number) => {
                if (typeof getPos === 'function') {
                    const pos = getPos();
                    if (pos !== null && pos !== undefined) {
                        editor
                            .chain()
                            .setNodeSelection(pos)
                            .updateAttributes('image', { width, height })
                            .run();
                    }
                }
            };

            const handleMouseDown = (e: MouseEvent) => {
                e.preventDefault();
                e.stopPropagation();
                isResizing = true;
                startX = e.clientX;
                startY = e.clientY;
                startWidth = img.offsetWidth;
                startHeight = img.offsetHeight;

                document.addEventListener('mousemove', handleMouseMove);
                document.addEventListener('mouseup', handleMouseUp);
            };

            const handleMouseMove = (e: MouseEvent) => {
                if (!isResizing) return;

                const deltaX = e.clientX - startX;
                const deltaY = e.clientY - startY;

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
                if (typeof getPos === 'function') {
                    const pos = getPos();
                    if (pos !== null && pos !== undefined) {
                        editor.chain().setNodeSelection(pos).run();
                    }
                }
            };

            img.addEventListener('click', handleImageClick);

            const updateResizeHandle = () => {
                if (typeof getPos === 'function') {
                    const pos = getPos();
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
                        // 이미지 로드 후 컨테이너 너비 업데이트
                        const updateContainerWidth = () => {
                            if (img.offsetWidth > 0) {
                                imgContainer.style.width = `${img.offsetWidth}px`;
                            }
                        };
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

