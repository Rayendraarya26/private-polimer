import React, { useRef, useState, useEffect } from 'react';
import {
  Upload,
  FileText,
  CheckCircle2,
  Eye,
  Trash2,
  X,
  AlertCircle,
  ExternalLink,
  Download,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { cn } from '../../utils/cn';
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
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Esc key and body overflow lock when modal is open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && previewOpen) {
        setPreviewOpen(false);
        setIsFullscreen(false);
      }
    };
    if (previewOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [previewOpen]);

  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  const getFileUrl = (path: string) => {
    if (!path) return '';
    if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('blob:') || path.startsWith('data:')) return path;
    if (path.startsWith('/')) return `${window.location.origin}${path}`;
    return `${window.location.origin}/storage/${path}`;
  };

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
      setPreviewUrl(getFileUrl(value));
      setPreviewOpen(true);
    } else {
      const url = URL.createObjectURL(value);
      setPreviewUrl(url);
      setPreviewOpen(true);
    }
  };

  const handleOpenNewTab = () => {
    if (!previewUrl) return;
    window.open(previewUrl, '_blank');
  };

  const handleDownload = () => {
    if (!previewUrl) return;
    const a = document.createElement('a');
    a.href = previewUrl;
    a.download = fileName || 'dokumen';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Determine file presentation details
  const isExistingString = typeof value === 'string' && value.length > 0;
  const isFileObject = value instanceof File;
  const hasFile = Boolean(isFileObject || isExistingString);

  // Clean path without query parameters or hashes (e.g. S3/MinIO presigned URLs)
  const cleanPath = isFileObject
    ? value.name
    : isExistingString
    ? value.split('?')[0].split('#')[0]
    : '';

  const fileName = isFileObject
    ? value.name
    : isExistingString
    ? cleanPath.split('/').pop() || 'Berkas Terunggah'
    : '';

  const fileSize = isFileObject
    ? `${(value.size / 1024).toFixed(1)} KB`
    : '';

  const isPdf = isFileObject
    ? value.type === 'application/pdf' || value.name.toLowerCase().endsWith('.pdf')
    : cleanPath.toLowerCase().endsWith('.pdf');

  const isImage = isFileObject
    ? value.type.startsWith('image/')
    : /\.(png|jpe?g|webp|gif|svg)$/i.test(cleanPath);

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
                <button
                  type="button"
                  onClick={handlePreview}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700 hover:underline transition-colors cursor-pointer p-0 bg-transparent border-0"
                  title="Lihat file dokumen"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Lihat file</span>
                </button>

                {!disabled && (
                  <>
                    <span className="text-slate-300 text-xs">•</span>
                    <button
                      type="button"
                      onClick={() => inputRef.current?.click()}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-brand-600 hover:underline transition-colors cursor-pointer p-0 bg-transparent border-0"
                      title="Unggah berkas baru untuk mengganti dokumen ini"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Ubah berkas</span>
                    </button>
                  </>
                )}

                {fileSize && (
                  <span className="text-[11px] text-slate-400 font-mono">({fileSize})</span>
                )}
              </div>
            </div>
          </div>

          {/* {!disabled && (
            <button
              type="button"
              onClick={handleRemove}
              className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 p-2 rounded-xl transition-colors cursor-pointer shrink-0"
              title="Hapus berkas"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )} */}
        </div>
      ) : (
        /* Empty File Pill Card (Desain Seragam dengan Card Berkas Terunggah) */
        <div
          onClick={() => !disabled && inputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            'p-3.5 rounded-2xl border flex items-center justify-between gap-3 text-sm shadow-2xs transition-all cursor-pointer group select-none',
            isDragging
              ? 'border-brand-500 bg-brand-50/80 scale-[1.01]'
              : 'border-slate-200/90 bg-slate-50/70 hover:bg-slate-100/80 hover:border-brand-300',
            hasError && 'border-rose-400 bg-rose-50/20',
            disabled && 'opacity-60 cursor-not-allowed bg-slate-50 border-slate-200'
          )}
        >
          <div className="flex items-center gap-3 truncate min-w-0">
            <div className="w-9 h-9 rounded-xl bg-slate-200/80 group-hover:bg-brand-100 text-slate-400 group-hover:text-brand-600 flex items-center justify-center shrink-0 shadow-2xs transition-colors">
              <FileText className="w-5 h-5" />
            </div>

            <div className="truncate min-w-0">
              <p className="font-bold text-slate-700 text-sm truncate">Belum unggah</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 group-hover:text-brand-700 group-hover:underline transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Unggah file</span>
                </span>
                {helperText && (
                  <span className="text-[11px] text-slate-400 truncate">({helperText})</span>
                )}
              </div>
            </div>
          </div>

          {!disabled && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                inputRef.current?.click();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-brand-700 bg-brand-100/70 hover:bg-brand-200/80 border border-brand-200 transition-colors cursor-pointer shrink-0 shadow-2xs"
              title="Unggah berkas"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Unggah</span>
            </button>
          )}
        </div>
      )}

      {errorMessage && (
        <div className="flex items-center gap-1.5 text-xs font-medium text-rose-600 mt-1 animate-in fade-in-50 duration-200">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Modal Standar Pratinjau Dokumen / PDF (Desain Seragam dengan Dashboard) */}
      {previewOpen && previewUrl && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center ${
            isFullscreen ? 'p-0' : 'p-3 sm:p-4 md:p-6'
          } animate-in fade-in duration-150`}
        >
          {/* Backdrop Overlay Hitam */}
          <div
            className="fixed inset-0 transition-opacity"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.65)', backdropFilter: 'blur(2px)' }}
            onClick={() => {
              setPreviewOpen(false);
              setIsFullscreen(false);
            }}
          />

          {/* Modal Dialog Box */}
          <div
            className={`relative bg-white ${
              isFullscreen ? 'rounded-none border-0' : 'rounded-2xl border border-slate-200/90 shadow-2xl'
            } overflow-hidden flex flex-col z-10 transition-all duration-150`}
            style={{
              width: isFullscreen ? '100vw' : 'min(880px, 94vw)',
              height: isFullscreen ? '100vh' : '82vh',
              minHeight: isFullscreen ? '100vh' : '520px',
              maxHeight: isFullscreen ? '100vh' : '84vh',
            }}
          >
            {/* Toolbar Header (48px) */}
            <div
              className="px-4 md:px-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between gap-3 shrink-0"
              style={{ height: '48px', minHeight: '48px' }}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-brand-100 text-brand-700 flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                    Pratinjau Dokumen
                  </h3>
                  <p className="text-[10px] text-slate-500 truncate font-mono hidden sm:block">
                    {fileName}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  className="hidden sm:inline-flex px-2 text-slate-600 hover:text-slate-900"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  title={isFullscreen ? 'Kecilkan Tampilan' : 'Layar Penuh'}
                >
                  {isFullscreen ? (
                    <Minimize2 className="w-3.5 h-3.5" />
                  ) : (
                    <Maximize2 className="w-3.5 h-3.5" />
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  leftIcon={<ExternalLink className="w-3.5 h-3.5" />}
                  onClick={handleOpenNewTab}
                  title="Buka dokumen di tab browser baru"
                >
                  Tab Baru
                </Button>
                <Button
                  size="sm"
                  variant="primary"
                  leftIcon={<Download className="w-3.5 h-3.5" />}
                  onClick={handleDownload}
                  title="Unduh berkas dokumen"
                >
                  Unduh
                </Button>
                <button
                  type="button"
                  onClick={() => {
                    setPreviewOpen(false);
                    setIsFullscreen(false);
                  }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors ml-0.5 cursor-pointer"
                  title="Tutup Pratinjau (Esc)"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>

            {/* Viewer Container */}
            <div
              className="w-full bg-slate-100 p-0 relative overflow-hidden flex flex-col"
              style={{
                height: 'calc(100% - 48px)',
                minHeight: 'calc(100% - 48px)',
                flex: '1 1 auto',
              }}
            >
              {isPdf ? (
                <object
                  data={`${previewUrl}#view=FitH`}
                  type="application/pdf"
                  style={{
                    width: '100%',
                    height: '100%',
                    minHeight: '100%',
                    border: 'none',
                    display: 'block',
                  }}
                >
                  <iframe
                    src={`${previewUrl}#view=FitH`}
                    style={{
                      width: '100%',
                      height: '100%',
                      minHeight: '100%',
                      border: 'none',
                      display: 'block',
                    }}
                    title={fileName}
                  />
                </object>
              ) : isImage ? (
                <div className="w-full h-full flex items-center justify-center p-4 overflow-auto">
                  <img
                    src={previewUrl}
                    alt={fileName}
                    className="max-h-full max-w-full object-contain rounded shadow-sm"
                  />
                </div>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-slate-500 p-8 text-center">
                  <FileText className="w-12 h-12 text-slate-400" />
                  <p className="text-sm font-semibold text-slate-700">{fileName}</p>
                  <p className="text-xs text-slate-500 max-w-md">
                    Format berkas ini tidak dapat dipratinjau langsung di dalam browser. Silakan klik tombol "Unduh" atau "Tab Baru" di atas untuk melihat isi berkas.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DropzoneUploader;
