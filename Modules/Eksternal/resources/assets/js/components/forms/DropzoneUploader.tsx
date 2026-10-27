import React, { useRef, useState } from 'react';
import { Upload, FileText, CheckCircle2, Eye, Trash2, X, AlertCircle } from 'lucide-react';
import { cn } from '../../utils/cn';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

export interface DropzoneUploaderProps {
  value?: File | string | null;
  onChange?: (file: File | null) => void;
  accept?: string;
  maxSizeMB?: number;
  label?: string;
  helperText?: string;
  disabled?: boolean;
  className?: string;
  hasError?: boolean;
}

export const DropzoneUploader: React.FC<DropzoneUploaderProps> = ({
  value,
  onChange,
  accept = '.pdf,.png,.jpg,.jpeg',
  maxSizeMB = 5,
  label = 'Pilih atau Tarik Berkas ke Sini',
  helperText = 'Format didukung: PDF, PNG, JPG (Maks. 5 MB)',
  disabled = false,
  className,
  hasError = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  const validateAndSetFile = (file: File) => {
    setErrorMessage(null);

    // Size check
    if (file.size > maxSizeBytes) {
      setErrorMessage(
        `Ukuran berkas melebihi batas ${maxSizeMB} MB (Berkas Anda: ${(file.size / (1024 * 1024)).toFixed(2)} MB)`
      );
      return;
    }

    // Type check if accept is specified
    if (accept) {
      const allowedExtensions = accept
        .split(',')
        .map((ext) => ext.trim().toLowerCase().replace('.', ''));
      const fileExt = file.name.split('.').pop()?.toLowerCase() || '';

      if (!allowedExtensions.includes(fileExt)) {
        setErrorMessage(`Format berkas tidak didukung. Harap unggah berkas bertipe: ${accept}`);
        return;
      }
    }

    onChange?.(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.(null);
    setErrorMessage(null);
    if (inputRef.current) inputRef.current.value = '';
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
  };

  const handlePreview = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!value) return;

    if (typeof value === 'string') {
      setPreviewUrl(value);
      setPreviewOpen(true);
    } else {
      const url = URL.createObjectURL(value);
      setPreviewUrl(url);
      setPreviewOpen(true);
    }
  };

  // Determine file presentation details
  const isExistingString = typeof value === 'string' && value.length > 0;
  const isFileObject = value instanceof File;
  const hasFile = Boolean(isFileObject || isExistingString);

  const fileName = isFileObject
    ? value.name
    : isExistingString
    ? value.split('/').pop() || 'Berkas Terunggah'
    : '';

  const fileSize = isFileObject
    ? `(${(value.size / 1024).toFixed(1)} KB)`
    : isExistingString
    ? '(Tersimpan di server)'
    : '';

  const isPdf = fileName.toLowerCase().endsWith('.pdf');

  return (
    <div className={cn('w-full space-y-2', className)}>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        disabled={disabled}
        onChange={handleInputChange}
        className="hidden"
      />

      {hasFile ? (
        /* Uploaded File Pill Card */
        <div className="p-3.5 rounded-2xl bg-brand-50/60 border border-brand-200/90 flex items-center justify-between gap-3 text-sm shadow-2xs transition-all">
          <div className="flex items-center gap-3 truncate min-w-0">
            <div className="w-9 h-9 rounded-xl bg-brand-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
              <FileText className="w-5 h-5" />
            </div>

            <div className="truncate min-w-0">
              <p className="font-bold text-slate-900 text-sm truncate">{fileName}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-slate-500 font-mono">{fileSize}</span>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-100/80 px-2 py-0.2 rounded-full">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Siap
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handlePreview}
              className="px-2.5 py-1.5 text-xs font-semibold text-brand-700 border-brand-300 hover:bg-brand-100/50"
              title="Pratinjau berkas"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Pratinjau</span>
            </Button>

            {!disabled && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleRemove}
                className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 p-1.5 rounded-lg h-auto"
                title="Hapus berkas"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      ) : (
        /* Empty Dropzone Card */
        <div
          onClick={() => !disabled && inputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            'p-6 rounded-2xl border-2 border-dashed transition-all cursor-pointer text-center group select-none flex flex-col items-center justify-center',
            isDragging
              ? 'border-brand-600 bg-brand-50/80 scale-[1.01]'
              : 'border-slate-300 hover:border-brand-500 hover:bg-brand-50/20 bg-white',
            hasError && 'border-rose-400 bg-rose-50/20',
            disabled && 'opacity-60 cursor-not-allowed bg-slate-50 border-slate-200'
          )}
        >
          <div className="w-12 h-12 rounded-2xl bg-slate-100 group-hover:bg-brand-100 group-hover:text-brand-600 text-slate-500 flex items-center justify-center mb-2.5 transition-colors shadow-2xs">
            <Upload className="w-6 h-6" />
          </div>

          <p className="text-sm font-bold text-slate-800 group-hover:text-brand-700 transition-colors">
            {label}
          </p>
          <p className="text-xs text-slate-500 mt-1 max-w-sm">{helperText}</p>
        </div>
      )}

      {errorMessage && (
        <div className="flex items-center gap-1.5 text-xs font-medium text-rose-600 mt-1 animate-in fade-in-50 duration-200">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Instant Document Preview Modal */}
      {previewOpen && previewUrl && (
        <Modal
          isOpen={previewOpen}
          onClose={() => setPreviewOpen(false)}
          size="lg"
          title={`Pratinjau Dokumen: ${fileName}`}
        >
          <div className="w-full h-[65vh] flex flex-col items-center justify-center bg-slate-100 rounded-xl overflow-hidden">
            {isPdf ? (
              <iframe
                src={previewUrl}
                title="Preview PDF"
                className="w-full h-full border-0"
              />
            ) : (
              <img
                src={previewUrl}
                alt="Preview Dokumen"
                className="max-h-full max-w-full object-contain p-2"
              />
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default DropzoneUploader;
