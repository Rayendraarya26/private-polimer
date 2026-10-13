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
@endphp

<div class="row g-4 mb-4">
    <!-- ================= IDENTITAS PEMOHON ================= -->
    <div class="col-md-6">
        <h6 class="text-primary border-bottom pb-2 mb-3">Identitas Pemohon</h6>

        <div class="detail-row">
            <div class="detail-label">Nama Lengkap / Instansi</div>
            <div>:</div>
            <div class="detail-value fw-bold text-dark">{{ $form->pemohon_nama ?: '-' }}</div>
        </div>

        <div class="detail-row">
            <div class="detail-label">NIK / NIB</div>
            <div>:</div>
            <div class="detail-value fw-semibold">{{ $form->pemohon_nik_nib ?: '-' }}</div>
        </div>

        <div class="detail-row">
            <div class="detail-label">No. Telepon / WhatsApp</div>
            <div>:</div>
            <div class="detail-value fw-semibold">{{ $form->pemohon_telepon ?: '-' }}</div>
        </div>

        <div class="detail-row">
            <div class="detail-label">Email Pemohon</div>
            <div>:</div>
            <div class="detail-value">{{ $form->pemohon_email ?: '-' }}</div>
        </div>

        <div class="detail-row">
            <div class="detail-label">Alamat Lengkap</div>
            <div>:</div>
            <div class="detail-value">{{ $form->pemohon_alamat ?: '-' }}</div>
        </div>
    </div>

    <!-- ================= RINCIAN SEWA ASET ================= -->
    <div class="col-md-6">
        <h6 class="text-primary border-bottom pb-2 mb-3">Detail Permohonan Sewa Aset</h6>

        <div class="detail-row">
            <div class="detail-label">Jenis Sewa Aset</div>
            <div>:</div>
            <div class="detail-value fw-semibold text-primary">
                {{ ucwords(str_replace('_', ' ', $form->jenis_sewa ?: '-')) }}
            </div>
        </div>

        <div class="detail-row">
            <div class="detail-label">Tanggal Mulai Sewa</div>
            <div>:</div>
            <div class="detail-value">
                {{ $form->tanggal_mulai ? \Carbon\Carbon::parse($form->tanggal_mulai)->translatedFormat('l, d F Y') : '-' }}
            </div>
        </div>

        <div class="detail-row">
            <div class="detail-label">Tanggal Selesai Sewa</div>
            <div>:</div>
            <div class="detail-value">
                {{ $form->tanggal_selesai ? \Carbon\Carbon::parse($form->tanggal_selesai)->translatedFormat('l, d F Y') : '-' }}
            </div>
        </div>

        <div class="detail-row">
            <div class="detail-label">Durasi Sewa</div>
            <div>:</div>
            <div class="detail-value fw-semibold">
                {{ $form->durasi_hari }} Hari
            </div>
        </div>

        <div class="detail-row">
            <div class="detail-label">Keperluan Penggunaan</div>
            <div>:</div>
            <div class="detail-value" style="white-space: pre-wrap;">{{ $form->keperluan_penggunaan ?: '-' }}</div>
        </div>

        @if(!empty($form->catatan_tambahan))
            <div class="detail-row">
                <div class="detail-label">Catatan Tambahan</div>
                <div>:</div>
                <div class="detail-value text-muted">{{ $form->catatan_tambahan }}</div>
            </div>
        @endif
    </div>
</div>

<!-- ================= DOKUMEN PERMOHONAN ================= -->
<div class="mt-4">
    <h6 class="text-primary border-bottom pb-2 mb-3">Dokumen Permohonan</h6>

    <div class="detail-row">
        <div class="detail-label">Surat Permohonan / Kuasa</div>
        <div>:</div>
        <div class="detail-value">
            @if(!empty($form->file_surat_permohonan))
                <div class="d-flex align-items-center gap-2">
                    <button type="button"
                        class="btn btn-sm btn-primary preview-btn py-1 px-3"
                        data-file="{{ $getFileUrl($form->file_surat_permohonan) }}">
                        Lihat file <i class="fa fa-eye ms-1"></i>
                    </button>
                    <a href="{{ $getFileUrl($form->file_surat_permohonan) }}"
                        download="Surat_Permohonan_Sewa_Aset"
                        class="btn btn-sm btn-outline-secondary py-1 px-3">
                        Unduh <i class="fa fa-download ms-1"></i>
                    </a>
                </div>
            @else
                <span class="text-muted fst-italic">Tidak ada surat permohonan yang diunggah.</span>
            @endif
        </div>
    </div>
</div>

