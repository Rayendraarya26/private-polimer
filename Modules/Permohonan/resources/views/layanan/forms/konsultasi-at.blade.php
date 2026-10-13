<style>
.detail-row {
    display: grid;
    grid-template-columns: 200px 10px 1fr;
    margin-bottom: 8px;
}

.detail-label {
    color: #6c757d;
}

.detail-value {
    word-break: break-word;
}
</style>

@php
    $getFileUrl = function($path) {
        if (empty($path)) return null;
        if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://') || str_starts_with($path, '/storage/')) {
            return $path;
        }
        return asset('storage/' . $path);
    };

    $dokumenList = $form->dokumen ?? collect();
@endphp

<div class="row g-4 mb-4">
    <!-- ================= IDENTITAS PEMOHON ================= -->
    <div class="col-md-6">
        <h6 class="text-primary border-bottom pb-2 mb-3">Identitas Pemohon</h6>

        <div class="detail-row">
            <div class="detail-label">Nama Pemohon</div>
            <div>:</div>
            <div class="detail-value fw-bold text-dark">{{ $form->nama_pemohon ?? '-' }}</div>
        </div>

        <div class="detail-row">
            <div class="detail-label">No. Telepon / WhatsApp</div>
            <div>:</div>
            <div class="detail-value fw-semibold">{{ $form->no_telp ?? '-' }}</div>
        </div>

        <div class="detail-row">
            <div class="detail-label">Email Pemohon</div>
            <div>:</div>
            <div class="detail-value">{{ $form->email_pemohon ?? '-' }}</div>
        </div>

        <div class="detail-row">
            <div class="detail-label">Alamat Lengkap</div>
            <div>:</div>
            <div class="detail-value">{{ $form->alamat_pemohon ?? '-' }}</div>
        </div>
    </div>

    <!-- ================= RINCIAN LAYANAN ================= -->
    <div class="col-md-6">
        <h6 class="text-primary border-bottom pb-2 mb-3">Detail Permohonan</h6>

        @if(!empty($form->master?->kategori))
            <div class="detail-row">
                <div class="detail-label">Kategori Layanan</div>
                <div>:</div>
                <div class="detail-value">{{ ucwords(str_replace('_', ' ', $form->master->kategori)) }}</div>
            </div>
        @endif

        <div class="detail-row">
            <div class="detail-label">Layanan yang Dipilih</div>
            <div>:</div>
            <div class="detail-value fw-semibold text-dark">{{ $form->layanan_nama ?? '-' }}</div>
        </div>

        @if(!empty($form->layanan_lainnya))
            <div class="detail-row">
                <div class="detail-label">Rincian Layanan Lainnya</div>
                <div>:</div>
                <div class="detail-value text-primary fw-semibold">{{ $form->layanan_lainnya }}</div>
            </div>
        @endif

        @if(!empty($form->master?->deskripsi))
            <div class="detail-row">
                <div class="detail-label">Deskripsi Layanan</div>
                <div>:</div>
                <div class="detail-value text-muted">{{ $form->master->deskripsi }}</div>
            </div>
        @endif

        <div class="detail-row">
            <div class="detail-label">Status Layanan</div>
            <div>:</div>
            <div class="detail-value">
                <span class="badge bg-light text-dark border">{{ ucfirst($form->status_layanan ?? 'Pengajuan') }}</span>
            </div>
        </div>
    </div>
</div>

<!-- ================= CATATAN PEMOHON ================= -->
@if(!empty($form->catatan_dokumen))
<div class="mt-4">
    <h6 class="text-primary border-bottom pb-2 mb-3">Catatan / Keterangan Dokumen</h6>

    <div class="detail-row">
        <div class="detail-label">Catatan Tambahan</div>
        <div>:</div>
        <div class="detail-value" style="white-space: pre-line;">{{ $form->catatan_dokumen }}</div>
    </div>
</div>
@endif

<!-- ================= FILE & DOKUMEN PENDUKUNG ================= -->
<div class="mt-4">
    <h6 class="text-primary border-bottom pb-2 mb-3">Dokumen Teknis & Pendukung</h6>

    @if($dokumenList->count() > 0)
        <div class="row g-2">
            @foreach($dokumenList as $doc)
                <div class="col-md-6">
                    <div class="detail-row mb-2">
                        <div class="detail-label text-truncate" title="{{ $doc->nama_file_asli }}">
                            {{ $doc->nama_file_asli }}
                        </div>
                        <div>:</div>
                        <div class="detail-value d-flex align-items-center gap-2">
                            @if(!empty($doc->file_path))
                                <button type="button"
                                    class="btn btn-sm btn-primary preview-btn py-1 px-3"
                                    data-file="{{ $getFileUrl($doc->file_path) }}">
                                    Lihat file <i class="fa fa-eye ms-1"></i>
                                </button>
                                <a href="{{ $getFileUrl($doc->file_path) }}"
                                    download="{{ $doc->nama_file_asli }}"
                                    class="btn btn-sm btn-outline-secondary py-1 px-3">
                                    Unduh <i class="fa fa-download ms-1"></i>
                                </a>
                            @else
                                <span class="text-muted">-</span>
                            @endif
                        </div>
                    </div>
                </div>
            @endforeach
        </div>
    @else
        <div class="alert alert-light border text-muted mb-0">
            <i class="fa fa-info-circle me-1"></i> Tidak ada dokumen yang dilampirkan oleh pemohon.
        </div>
    @endif
</div>
