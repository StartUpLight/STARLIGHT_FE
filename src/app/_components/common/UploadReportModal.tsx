'use client';
import React, { useEffect, useRef, useState } from 'react';
import PdfIcon from '@/assets/icons/pdf_icon.svg';
import CloseIcon from '@/assets/icons/close.svg';
import WarningIcon from '@/assets/icons/warning.svg';
import { useRouter } from 'next/navigation';
import { usePdfGrade } from '@/hooks/mutation/usePdfGrade';

type UploadReportModalProps = {
  open: boolean;
  onClose: () => void;
};

const UploadReportModal: React.FC<UploadReportModalProps> = ({
  open,
  onClose,
}) => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const { mutateAsync: gradePdf, isPending } = usePdfGrade();

  const triggerFileDialog = () => fileInputRef.current?.click();

  const validateAndSetFile = (file: File) => {
    setValidationError(null);

    if (file.type !== 'application/pdf') {
      setValidationError('PDF 형식의 파일만 업로드할 수 있어요.');
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setValidationError(
        '파일 용량이 너무 커서 업로드할 수 없어요. (최대 20MB)'
      );
      return;
    }
    setSelectedFile(file);
  };

  const onInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    if (file) validateAndSetFile(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const onDragOver: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const onDragLeave: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const onDrop: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) validateAndSetFile(file);
  };

  const formatFileSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    return `${mb % 1 === 0 ? mb.toFixed(0) : mb.toFixed(1)}MB`;
  };

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const resetState = () => {
    setSelectedFile(null);
    setValidationError(null);
  };

  const handleUpload = async () => {
    if (!selectedFile || isPending) return;

    try {
      setValidationError(null);

      const title = selectedFile.name.replace(/\.pdf$/i, '');

      const result = gradePdf({
        title,
        file: selectedFile,
      });

      onClose();
      router.push('/report/loading');

      await result;

      resetState();
      router.push('/report');
    } catch (e) {
      console.error(e);
      setValidationError(
        '업로드 중 문제가 발생했어요. 잠시 후 다시 시도해 주세요.'
      );
    }
  };

  const disabled = !selectedFile || !!validationError || isPending;

  return (
    <div className="fixed inset-0 z-60">
      <div
        className="absolute inset-x-0 top-[60px] bottom-0 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full max-w-[586px] rounded-xl bg-white p-6 shadow-[0_0_20px_0_rgba(0,0,0,0.15)]">
          <div className="flex flex-col gap-1">
            <h2 className="ds-title font-semibold text-gray-900">
              내 사업계획서 업로드
            </h2>
            <p className="ds-text font-medium text-gray-600">
              최대 20MB의 용량 제한이 있어요.
            </p>
          </div>

          <div className="mt-6">
            <div
              className={`relative rounded-xl border border-dashed ${
                dragActive
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-300'
              } bg-gray-80`}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
            >
              <div className="flex h-56 flex-col items-center justify-center text-center">
                <PdfIcon />
                {selectedFile ? (
                  <div className="mt-1.5 space-y-[2px]">
                    <p className="ds-subtext max-w-[360px] truncate font-semibold text-gray-900">
                      {selectedFile.name}
                    </p>
                    <p className="ds-subtext font-medium text-gray-500">
                      {formatFileSize(selectedFile.size)}
                    </p>
                    <button
                      type="button"
                      aria-label="파일 제거"
                      onClick={() => setSelectedFile(null)}
                      className="absolute top-[15px] right-3.5 cursor-pointer rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                    >
                      <CloseIcon />
                    </button>
                  </div>
                ) : (
                  <div className="mt-2.5 space-y-[2px]">
                    <p className="ds-subtext font-semibold text-gray-800">
                      PDF 파일을 업로드 하세요.
                    </p>
                    <p className="ds-subtext font-medium text-gray-500">
                      파일을 이곳에 드래그하거나{' '}
                      <button
                        type="button"
                        onClick={triggerFileDialog}
                        className="cursor-pointer underline"
                      >
                        파일 선택
                      </button>
                      을 눌러서 업로드하세요.
                    </p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf"
                  onChange={onInputChange}
                  className="hidden"
                />
              </div>
            </div>
          </div>

          {validationError && (
            <div className="mt-6 flex items-center gap-1">
              <WarningIcon />
              <p className="ds-subtext font-medium text-[#FF4B6B]">
                {validationError}
              </p>
            </div>
          )}

          <div className="mt-6 flex items-center gap-4">
            <button
              type="button"
              onClick={() => {
                resetState();
                onClose();
              }}
              className="ds-text h-11 flex-1 cursor-pointer rounded-lg border border-gray-300 bg-white px-8 py-2.5 font-medium text-gray-700 hover:bg-gray-100"
            >
              취소하기
            </button>
            <button
              type="button"
              className={`ds-text h-11 flex-1 rounded-lg px-8 py-2.5 font-medium ${
                disabled
                  ? 'cursor-not-allowed bg-gray-200 text-gray-500'
                  : 'bg-primary-500 hover:bg-primary-600 cursor-pointer text-white'
              }`}
              disabled={disabled}
              onClick={handleUpload}
            >
              {isPending ? '업로드 중...' : '업로드하기'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadReportModal;
