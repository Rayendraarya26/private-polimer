import React, { useRef, useState } from "react"
import { toast } from "react-hot-toast"
import {
    UploadCloud,
    FileArchive,
    File,
    FileText,
    FileSpreadsheet,
    Image as ImageIcon,
    Plus,
    Trash2,
    X,
} from "lucide-react"
import { Button } from "../../ui/Button"
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardDescription,
} from "../../ui/Card"

const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50 MB

export interface Step2UnggahDokumenProps {
    uploadedFiles: File[]
    setUploadedFiles: React.Dispatch<React.SetStateAction<File[]>>
    catatanDokumen: string
    setCatatanDokumen: (val: string) => void
    selectedLayananName?: string
}

export const Step2UnggahDokumen: React.FC<Step2UnggahDokumenProps> = ({
    uploadedFiles,
    setUploadedFiles,
    catatanDokumen,
    setCatatanDokumen,
    selectedLayananName,
}) => {
    const fileInputRef = useRef<HTMLInputElement | null>(null)
    const [isDragging, setIsDragging] = useState<boolean>(false)

    const handleAddFiles = (newFiles: FileList | File[]) => {
        const filesArray = Array.from(newFiles)
        const validFiles: File[] = []

        filesArray.forEach((file) => {
            if (file.size > MAX_FILE_SIZE) {
                toast.error(`Ukuran berkas "${file.name}" melebihi batas maksimal 50 MB`)
                return
            }

            const isDuplicate = uploadedFiles.some(
                (existing) => existing.name === file.name && existing.size === file.size
            )
            if (isDuplicate) {
                toast.error(`Berkas "${file.name}" sudah ada dalam daftar`)
                return
            }

            validFiles.push(file)
        })

        if (validFiles.length > 0) {
            setUploadedFiles((prev) => [...prev, ...validFiles])
            toast.success(`${validFiles.length} berkas berhasil ditambahkan`)
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            handleAddFiles(e.target.files)
            e.target.value = ""
        }
    }

    const handleRemoveFile = (index: number) => {
        setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
    }

    const handleClearAllFiles = () => {
        setUploadedFiles([])
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setIsDragging(false)
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleAddFiles(e.dataTransfer.files)
        }
    }

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setIsDragging(false)
    }

    const formatFileSize = (bytes: number): string => {
        if (bytes < 1024) return `${bytes} B`
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
        return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
    }

    const getFileIcon = (filename: string) => {
        const ext = filename.split(".").pop()?.toLowerCase() || ""
        if (["zip", "rar", "7z", "tar", "gz"].includes(ext)) {
            return <FileArchive className="w-4 h-4 text-amber-600" />
        }
        if (ext === "pdf") {
            return <FileText className="w-4 h-4 text-rose-600" />
        }
        if (["doc", "docx"].includes(ext)) {
            return <FileText className="w-4 h-4 text-blue-600" />
        }
        if (["xls", "xlsx", "csv"].includes(ext)) {
            return <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
        }
        if (["jpg", "jpeg", "png", "webp", "svg"].includes(ext)) {
            return <ImageIcon className="w-4 h-4 text-purple-600" />
        }
        return <File className="w-4 h-4 text-slate-600" />
    }

    const totalFileSize = uploadedFiles.reduce((acc, f) => acc + f.size, 0)

    return (
        <Card className="rounded-xl border-slate-200 shadow-xs overflow-hidden">
            <CardHeader className="rounded-t-xl bg-white border-b border-slate-200 pb-4">
                <div className="flex items-center gap-3.5">
                    <div className="w-9 h-9 rounded-lg bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-600 shrink-0">
                        <UploadCloud className="w-4 h-4" />
                    </div>
                    <div>
                        <CardTitle className="text-base text-slate-900">
                            Dokumen Permohonan & Keterangan Teknis
                        </CardTitle>
                        <CardDescription>
                            Unggah berkas dokumen pendukung seperti surat permohonan resmi, profil industri, alur proses, atau proposal teknis.
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-6 space-y-5">
                {/* Ringkasan Layanan yang Dipilih */}
                {selectedLayananName && (
                    <div className="p-3.5 rounded-lg bg-slate-50/70 border border-slate-200 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                            <span className="text-slate-500">Layanan yang Dipilih:</span>
                            <span className="font-bold text-slate-900">{selectedLayananName}</span>
                        </div>
                    </div>
                )}

                {/* Hidden Native File Input */}
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="*/*,.pdf,.zip,.rar,.7z,.tar,.gz,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.jpg,.jpeg,.png"
                    className="hidden"
                    onChange={handleFileChange}
                />

                {/* Main Upload Dropzone Area */}
                {uploadedFiles.length === 0 ? (
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors bg-white ${
                            isDragging
                                ? "border-brand-500 bg-slate-50/80"
                                : "border-slate-300 hover:border-brand-500 hover:bg-slate-50/50"
                        }`}
                    >
                        <div className="w-12 h-12 mx-auto rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center mb-3 transition-colors">
                            <UploadCloud className="w-6 h-6" />
                        </div>
                        <p className="text-xs font-bold text-slate-800">
                            Klik untuk memilih berkas atau seret berkas ke sini
                        </p>
                        <p className="text-[11px] text-slate-400 mt-1 max-w-md mx-auto leading-relaxed">
                            Mendukung format PDF, ZIP, RAR, Word, Excel, Foto/Scan (Maksimal 50 MB per berkas).
                        </p>

                        <div className="mt-4">
                            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-xs font-semibold text-white shadow-xs transition-colors">
                                <Plus className="w-3.5 h-3.5" />
                                Pilih File
                            </span>
                        </div>
                    </div>
                ) : (
                    /* Files List Container */
                    <div className="space-y-3">
                        {/* Summary Bar */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-800">
                                    {uploadedFiles.length} berkas dipilih
                                </span>
                                <span className="text-slate-400">•</span>
                                <span className="text-slate-500 font-medium">
                                    Total: {formatFileSize(totalFileSize)}
                                </span>
                            </div>

                            <div className="flex items-center gap-2 self-end sm:self-auto">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="text-xs rounded-lg flex items-center gap-1.5 h-7 px-2.5 bg-white border-slate-300"
                                >
                                    <Plus className="w-3.5 h-3.5 text-brand-600" />
                                    Tambah Berkas
                                </Button>

                                <button
                                    type="button"
                                    onClick={handleClearAllFiles}
                                    className="text-xs text-rose-600 hover:text-rose-700 hover:underline transition-colors px-2 py-1 cursor-pointer"
                                >
                                    Hapus Semua
                                </button>
                            </div>
                        </div>

                        {/* List of Uploaded Files */}
                        <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
                            {uploadedFiles.map((file, idx) => (
                                <div
                                    key={`${file.name}-${idx}`}
                                    className="rounded-lg border border-slate-200 bg-white p-3 transition-colors hover:border-slate-300 flex items-center justify-between gap-3"
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                                            {getFileIcon(file.name)}
                                        </div>

                                        <div className="min-w-0">
                                            <p className="text-xs font-semibold text-slate-900 truncate max-w-xs sm:max-w-md">
                                                {file.name}
                                            </p>
                                            <p className="text-[11px] text-slate-500">
                                                {formatFileSize(file.size)}
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => handleRemoveFile(idx)}
                                        className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer shrink-0"
                                        title="Hapus berkas ini"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Compact Dropzone Area Below File List */}
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            className={`border border-dashed rounded-lg p-2.5 text-center cursor-pointer transition-colors ${
                                isDragging
                                    ? "border-brand-500 bg-slate-50"
                                    : "border-slate-300 hover:border-brand-500 bg-slate-50/50 hover:bg-slate-50"
                            }`}
                        >
                            <p className="text-[11px] text-slate-600">
                                <span className="text-brand-600 font-semibold cursor-pointer">Klik di sini</span> atau seret berkas untuk menambahkan dokumen lain
                            </p>
                        </div>
                    </div>
                )}

                {/* Catatan Tambahan Dokumen */}
                <div className="space-y-1.5 pt-1 border-t border-slate-200">
                    <label className="block text-xs font-medium text-slate-700">
                        Keterangan / Catatan Tambahan Dokumen (Opsional)
                    </label>
                    <textarea
                        value={catatanDokumen}
                        onChange={(e) => setCatatanDokumen(e.target.value)}
                        rows={3}
                        placeholder="Tuliskan keterangan berkas atau informasi pendukung teknis lainnya jika ada..."
                        className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-brand-600 transition-colors resize-none"
                    />
                    <p className="text-[11px] text-slate-500">
                        Jika berkas terdiri dari beberapa dokumen atau folder, Anda dapat mengarsipkannya menjadi file PDF atau arsip ZIP.
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}

export default Step2UnggahDokumen
