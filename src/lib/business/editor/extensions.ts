import { Extension } from '@tiptap/core';
import type { Node as PMNode } from '@tiptap/pm/model';
import type { EditorState, Selection } from '@tiptap/pm/state';
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

            const updateImageSize = (width: number, height: number) => {
                const pos = typeof getPos === 'function' ? getPos() : null;
                if (pos !== null && pos !== undefined) {
                    editor
                        .chain()
                        .setNodeSelection(pos)
                        .updateAttributes('image', { width, height })
                        .run();
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

