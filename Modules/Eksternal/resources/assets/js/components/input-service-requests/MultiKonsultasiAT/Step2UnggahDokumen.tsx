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
}

export const Step2UnggahDokumen: React.FC<Step2UnggahDokumenProps> = ({
    uploadedFiles,
    setUploadedFiles,
    catatanDokumen,
    setCatatanDokumen,
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

    const getFileDetails = (filename: string) => {
        const ext = filename.split(".").pop()?.toLowerCase() || ""
        if (["zip", "rar", "7z", "tar", "gz"].includes(ext)) {
            return {
                icon: FileArchive,
                iconBg: "bg-amber-600 text-white shadow-amber-500/20",
            }
        }
        if (ext === "pdf") {
            return {
                icon: FileText,
                iconBg: "bg-rose-600 text-white shadow-rose-500/20",
            }
        }
        if (["doc", "docx"].includes(ext)) {
            return {
                icon: FileText,
                iconBg: "bg-blue-600 text-white shadow-blue-500/20",
            }
        }
        if (["xls", "xlsx", "csv"].includes(ext)) {
            return {
                icon: FileSpreadsheet,
                iconBg: "bg-emerald-600 text-white shadow-emerald-500/20",
            }
        }
        if (["jpg", "jpeg", "png", "webp", "svg"].includes(ext)) {
            return {
                icon: ImageIcon,
                iconBg: "bg-purple-600 text-white shadow-purple-500/20",
            }
        }
        return {
            icon: File,
            iconBg: "bg-slate-600 text-white shadow-slate-500/20",
        }
    }

    const totalFileSize = uploadedFiles.reduce((acc, f) => acc + f.size, 0)

    return (
        <Card className="border-slate-200/80 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-brand-50/60 via-sky-50/40 to-white pb-4">
                <div>
                    <CardTitle className="text-base flex items-center gap-2">
                        Unggah Dokumen Permohonan
                    </CardTitle>
                    <CardDescription>
                        Unggah berkas dokumen pendukung seperti surat permohonan, spesifikasi teknis, alur proses, proposal, atau berkas pendukung lainnya. Mendukung semua format berkas (PDF, ZIP, RAR, Dokumen, Gambar, dll.).
                    </CardDescription>
                </div>
            </CardHeader>

            <CardContent className="pt-5 space-y-5">
                {/* Hidden Native File Input */}
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="*/*,.pdf,.zip,.rar,.7z,.tar,.gz,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.jpg,.jpeg,.png"
                    className="hidden"
                    onChange={handleFileChange}
                />

                {/* Main Upload Dropzone Area (Shown if no files selected yet) */}
                {uploadedFiles.length === 0 ? (
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-10 text-center cursor-pointer transition-all duration-200 ${
                            isDragging
                                ? "border-brand-500 bg-brand-50/70 ring-4 ring-brand-500/10 scale-[1.01]"
                                : "border-slate-300 hover:border-brand-500 bg-slate-50/40 hover:bg-brand-50/20"
                        }`}
                    >
                        <div className="w-16 h-16 mx-auto rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mb-3.5 shadow-xs">
                            <UploadCloud className="w-8 h-8" />
                        </div>
                        <p className="text-sm font-bold text-slate-800">
                            Klik untuk memilih berkas atau seret ke area ini
                        </p>
                        <p className="text-xs text-slate-500 mt-1.5 max-w-lg mx-auto leading-relaxed">
                            Mendukung format <strong className="text-slate-700 font-semibold">PDF, ZIP, RAR</strong>, Word, Excel, Foto/Scan, dll. (Maksimal 50 MB per berkas).
                        </p>

                        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-xs font-semibold text-white shadow-sm transition-colors">
                                <Plus className="w-4 h-4" />
                                Pilih File
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Files List Container */
                    <div className="space-y-4">
                        {/* Summary bar */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                            <div className="flex items-center gap-2 text-xs">
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
                                    className="text-xs rounded-xl flex items-center gap-1.5 h-8 bg-white"
                                >
                                    <Plus className="w-3.5 h-3.5 text-brand-600" />
                                    Tambah Berkas
                                </Button>

                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleClearAllFiles}
                                    className="text-xs rounded-xl text-rose-600 hover:text-rose-700 hover:bg-rose-50 h-8"
                                >
                                    <Trash2 className="w-3.5 h-3.5 mr-1" />
                                    Hapus Semua
                                </Button>
                            </div>
                        </div>

                        {/* List of uploaded file cards */}
                        <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
                            {uploadedFiles.map((file, idx) => {
                                const details = getFileDetails(file.name)
                                const IconComp = details.icon

                                return (
                                    <div
                                        key={`${file.name}-${idx}`}
                                        className="group rounded-xl border border-slate-200 bg-white hover:border-brand-300 p-3.5 transition-all shadow-2xs hover:shadow-xs flex items-center justify-between gap-3"
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div
                                                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${details.iconBg}`}
                                            >
                                                <IconComp className="w-5 h-5" />
                                            </div>

                                            <div className="min-w-0 space-y-0.5">
                                                <p className="text-xs font-bold text-slate-900 truncate max-w-xs sm:max-w-md">
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
                                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer shrink-0"
                                            title="Hapus berkas ini"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                )
                            })}
                        </div>

                        {/* Compact dropzone below files */}
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            className={`border border-dashed rounded-xl p-3 text-center cursor-pointer transition-colors ${
                                isDragging
                                    ? "border-brand-500 bg-brand-50/70"
                                    : "border-slate-300 hover:border-brand-400 bg-slate-50/50 hover:bg-brand-50/20"
                            }`}
                        >
                            <p className="text-[11px] text-slate-600">
                                <strong className="text-brand-600 font-semibold cursor-pointer">Klik di sini</strong> atau seret berkas tambahan untuk menambahkan berkas lainnya
                            </p>
                        </div>
                    </div>
                )}

                {/* Catatan Tambahan Dokumen (Opsional) */}
                <div className="space-y-1.5 pt-2">
                    <label className="block text-xs font-semibold text-slate-700">
                        Keterangan / Catatan Tambahan Dokumen <span className="text-slate-400 font-normal">(Opsional)</span>
                    </label>
                    <textarea
                        value={catatanDokumen}
                        onChange={(e) => setCatatanDokumen(e.target.value)}
                        rows={3}
                        placeholder="Tuliskan keterangan berkas atau informasi pendukung lainnya jika ada..."
                        className="w-full text-xs rounded-xl border border-slate-300 bg-white p-3 text-slate-800 placeholder-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all shadow-xs resize-none"
                    />
                    <p className="text-[11px] text-slate-500">
                        Jika berkas Anda terdiri dari banyak dokumen atau folder, Anda dapat mengompresnya menjadi satu arsip <strong className="font-semibold text-slate-700">ZIP / RAR</strong> atau dokumen <strong className="font-semibold text-slate-700">PDF</strong>.
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}

export default Step2UnggahDokumen
