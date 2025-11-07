import { Extension } from '@tiptap/core';
import type { Node as PMNode } from '@tiptap/pm/model';

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

