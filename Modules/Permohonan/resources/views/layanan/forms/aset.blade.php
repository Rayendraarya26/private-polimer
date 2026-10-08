<style>
    .detail-aset-row {
        display: grid;
        grid-template-columns: 200px 10px 1fr;
        margin-bottom: 8px;
        font-size: 13px;
    }

    .detail-aset-label {
        color: #64748b;
        font-weight: 500;
    }

    .detail-aset-value {
        word-break: break-word;
        color: #1e293b;
    }

    .aset-section-title {
        font-size: 14px;
        font-weight: 700;
        color: #0f172a;
        border-bottom: 2px solid #e2e8f0;
        padding-bottom: 8px;
        margin-bottom: 16px;
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .aset-stat-card {
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 10px;
        padding: 14px 18px;
    }
</style>

<div class="space-y-4">

    {{-- ── 1. STATISTIC HIGHLIGHT CARDS ── --}}
    <div class="row g-3 mb-4">
        <div class="col-md-3">
            <div class="aset-stat-card border-start border-4 border-primary">
                <span class="text-uppercase text-muted" style="font-size: 10px; letter-spacing: 0.5px;">Jenis Sewa Aset</span>
                <h6 class="fw-bold text-dark mb-0 mt-1" style="font-size: 14px;">
                    {{ ucwords(str_replace('_', ' ', $form->jenis_sewa ?: '-')) }}
                </h6>
                <small class="text-primary fw-semibold">{{ $form->durasi_hari }} Hari Sewa</small>
            </div>
        </div>

        <div class="col-md-3">
            <div class="aset-stat-card border-start border-4 border-info">
                <span class="text-uppercase text-muted" style="font-size: 10px; letter-spacing: 0.5px;">Periode Penggunaan</span>
                <h6 class="fw-bold text-dark mb-0 mt-1" style="font-size: 13px;">
                    {{ $form->tanggal_mulai ? \Carbon\Carbon::parse($form->tanggal_mulai)->format('d M Y') : '-' }}
                </h6>
                <small class="text-muted">s/d {{ $form->tanggal_selesai ? \Carbon\Carbon::parse($form->tanggal_selesai)->format('d M Y') : '-' }}</small>
            </div>
        </div>

        <div class="col-md-3">
            <div class="aset-stat-card border-start border-4 border-success">
                <span class="text-uppercase text-muted" style="font-size: 10px; letter-spacing: 0.5px;">Pemohon</span>
                <h6 class="fw-bold text-dark mb-0 mt-1 text-truncate" style="font-size: 13px;" title="{{ $form->pemohon_nama }}">
                    {{ $form->pemohon_nama ?: '-' }}
                </h6>
                <small class="text-muted">{{ $form->pemohon_telepon ?: '-' }}</small>
            </div>
        </div>

        <div class="col-md-3">
            <div class="aset-stat-card border-start border-4 border-warning">
                <span class="text-uppercase text-muted" style="font-size: 10px; letter-spacing: 0.5px;">Surat Permohonan</span>
                <h6 class="fw-bold text-dark mb-0 mt-1" style="font-size: 13px;">
                    @if($form->file_surat_permohonan)
                        <span class="text-success"><i class="fas fa-check-circle text-success me-1"></i> Terlampir</span>
                    @else
                        <span class="text-muted"><i class="fas fa-minus-circle me-1"></i> Tidak Ada</span>
                    @endif
                </h6>
                <small class="text-muted">Integritas: {{ $form->setuju_pernyataan ? 'Disetujui' : '-' }}</small>
            </div>
        </div>
    </div>

    {{-- ── 2. RINCIAN SEWA ASET ── --}}
    <div class="card border-0 shadow-none bg-light-subtle rounded-3 p-4 mb-4" style="border: 1px solid #e2e8f0 !important;">
        <div class="aset-section-title">
            <i class="fas fa-building text-primary"></i> Rincian Pemanfaatan & Sewa Aset
        </div>

        <div class="detail-aset-row">
            <span class="detail-aset-label">Jenis Sewa Aset</span>
            <span>:</span>
            <span class="detail-aset-value fw-bold text-primary">
                {{ ucwords(str_replace('_', ' ', $form->jenis_sewa ?: '-')) }}
            </span>
        </div>

        <div class="detail-aset-row">
            <span class="detail-aset-label">Tanggal Mulai Sewa</span>
            <span>:</span>
            <span class="detail-aset-value">
                {{ $form->tanggal_mulai ? \Carbon\Carbon::parse($form->tanggal_mulai)->translatedFormat('l, d F Y') : '-' }}
            </span>
        </div>

        <div class="detail-aset-row">
            <span class="detail-aset-label">Tanggal Selesai Sewa</span>
            <span>:</span>
            <span class="detail-aset-value">
                {{ $form->tanggal_selesai ? \Carbon\Carbon::parse($form->tanggal_selesai)->translatedFormat('l, d F Y') : '-' }}
            </span>
        </div>

        <div class="detail-aset-row">
            <span class="detail-aset-label">Durasi Hari</span>
            <span>:</span>
            <span class="detail-aset-value fw-semibold">
                {{ $form->durasi_hari }} Hari
            </span>
        </div>

        <div class="detail-aset-row">
            <span class="detail-aset-label">Keperluan Penggunaan</span>
            <span>:</span>
            <span class="detail-aset-value" style="white-space: pre-wrap;">{{ $form->keperluan_penggunaan ?: '-' }}</span>
        </div>

        @if($form->catatan_tambahan)
            <div class="detail-aset-row">
                <span class="detail-aset-label">Catatan Tambahan</span>
                <span>:</span>
                <span class="detail-aset-value text-muted">{{ $form->catatan_tambahan }}</span>
            </div>
        @endif
    </div>

    {{-- ── 3. DATA IDENTITAS PEMOHON ── --}}
    <div class="card border-0 shadow-none bg-light-subtle rounded-3 p-4 mb-4" style="border: 1px solid #e2e8f0 !important;">
        <div class="aset-section-title">
            <i class="fas fa-user text-info"></i> Identitas Pemohon
        </div>

        <div class="detail-aset-row">
            <span class="detail-aset-label">Nama Lengkap / Perusahaan</span>
            <span>:</span>
            <span class="detail-aset-value fw-semibold">{{ $form->pemohon_nama ?: '-' }}</span>
        </div>

        <div class="detail-aset-row">
            <span class="detail-aset-label">NIK / NIB</span>
            <span>:</span>
            <span class="detail-aset-value">{{ $form->pemohon_nik_nib ?: '-' }}</span>
        </div>

        <div class="detail-aset-row">
            <span class="detail-aset-label">Alamat Lengkap</span>
            <span>:</span>
            <span class="detail-aset-value">{{ $form->pemohon_alamat ?: '-' }}</span>
        </div>

        <div class="detail-aset-row">
            <span class="detail-aset-label">Nomor Telepon / HP</span>
            <span>:</span>
            <span class="detail-aset-value">{{ $form->pemohon_telepon ?: '-' }}</span>
        </div>

        <div class="detail-aset-row">
            <span class="detail-aset-label">Alamat Email</span>
            <span>:</span>
            <span class="detail-aset-value">{{ $form->pemohon_email ?: '-' }}</span>
        </div>
    </div>

    {{-- ── 4. BERKAS SURAT & PERNYATAAN ── --}}
    <div class="card border-0 shadow-none bg-light-subtle rounded-3 p-4" style="border: 1px solid #e2e8f0 !important;">
        <div class="aset-section-title">
            <i class="fas fa-file-contract text-warning"></i> Berkas Pendukung & Integritas
        </div>

        <div class="detail-aset-row">
            <span class="detail-aset-label">Surat Permohonan / Kuasa</span>
            <span>:</span>
            <span class="detail-aset-value">
                @if($form->file_surat_permohonan)
                    <div class="d-flex align-items-center gap-2">
                        <a href="{{ asset('storage/' . $form->file_surat_permohonan) }}"
                           class="btn btn-sm btn-light-primary preview-btn"
                           data-file="{{ asset('storage/' . $form->file_surat_permohonan) }}"
                           target="_blank">
                            <i class="fas fa-eye me-1"></i> Preview Surat
                        </a>
                        <a href="{{ asset('storage/' . $form->file_surat_permohonan) }}"
                           download
                           class="btn btn-sm btn-outline btn-outline-secondary">
                            <i class="fas fa-download me-1"></i> Unduh
                        </a>
                    </div>
                @else
                    <span class="text-muted fst-italic">Tidak ada surat permohonan yang diunggah.</span>
                @endif
            </span>
        </div>

        <div class="detail-aset-row">
            <span class="detail-aset-label">Pernyataan Pemohon</span>
            <span>:</span>
            <span class="detail-aset-value">
                @if($form->setuju_pernyataan)
                    <span class="badge badge-light-success text-success px-2 py-1">
                        <i class="fas fa-check-circle me-1 text-success"></i> Menyetujui syarat & ketentuan sewa aset
                    </span>
                    @if($form->pernyataan_at)
                        <small class="text-muted ms-2">({{ \Carbon\Carbon::parse($form->pernyataan_at)->format('d M Y H:i') }} WIB)</small>
                    @endif
                @else
                    <span class="badge badge-light-danger text-danger px-2 py-1">Belum Menyetujui</span>
                @endif
            </span>
        </div>
    </div>

</div>
