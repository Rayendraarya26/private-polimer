<style>
    .detail-insp-row {
        display: grid;
        grid-template-columns: 200px 10px 1fr;
        margin-bottom: 8px;
        font-size: 13px;
    }

    .detail-insp-label {
        color: #64748b;
        font-weight: 500;
    }

    .detail-insp-value {
        word-break: break-word;
        color: #1e293b;
    }

    .insp-section-title {
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

    .insp-stat-card {
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 10px;
        padding: 14px 18px;
    }
</style>

@php
    $jenisInspeksi = is_array($form->jenis_inspeksi) 
        ? $form->jenis_inspeksi 
        : (is_string($form->jenis_inspeksi) ? json_decode($form->jenis_inspeksi, true) ?? [$form->jenis_inspeksi] : []);
@endphp

<div class="space-y-4">

    {{-- ── 1. STATISTIC HIGHLIGHT CARDS ── --}}
    <div class="row g-3 mb-4">
        <div class="col-md-3">
            <div class="insp-stat-card border-start border-4 border-primary">
                <span class="text-uppercase text-muted" style="font-size: 10px; letter-spacing: 0.5px;">Komoditas Objek</span>
                <h6 class="fw-bold text-dark mb-0 mt-1" style="font-size: 13px;">
                    {{ $form->komoditas ?: '-' }}
                </h6>
                <small class="text-muted">Kapasitas: {{ $form->kapasitas_karung ?: '-' }}</small>
            </div>
        </div>

        <div class="col-md-3">
            <div class="insp-stat-card border-start border-4 border-info">
                <span class="text-uppercase text-muted" style="font-size: 10px; letter-spacing: 0.5px;">Jumlah Partai / Lot</span>
                <h4 class="fw-bold text-info mb-0 mt-1">
                    {{ $form->jumlah_partai_lot ?? 1 }}
                    <small class="fs-6 text-muted fw-normal">Lot / Partai</small>
                </h4>
            </div>
        </div>

        <div class="col-md-3">
            <div class="insp-stat-card border-start border-4 border-success">
                <span class="text-uppercase text-muted" style="font-size: 10px; letter-spacing: 0.5px;">Rencana Inspeksi</span>
                <h6 class="fw-bold text-success mb-0 mt-1" style="font-size: 13px;">
                    {{ $form->tgl_rencana_inspeksi ? \Carbon\Carbon::parse($form->tgl_rencana_inspeksi)->translatedFormat('d F Y') : '-' }}
                </h6>
                <small class="text-muted">Bahasa: {{ ucfirst($form->bahasa_laporan ?? 'Indonesia') }}</small>
            </div>
        </div>

        <div class="col-md-3">
            <div class="insp-stat-card border-start border-4 border-warning">
                <span class="text-uppercase text-muted" style="font-size: 10px; letter-spacing: 0.5px;">Penerima Hasil</span>
                <h6 class="fw-bold text-dark mb-0 mt-1" style="font-size: 13px;">
                    {{ $form->penerima_hasil_nama ?: '-' }}
                </h6>
                <small class="text-muted">Tujuan: {{ Str::limit($form->tujuan_inspeksi ?: '-', 25) }}</small>
            </div>
        </div>
    </div>

    {{-- ── 2. OBJEK & PELAKSANAAN LAPANGAN ── --}}
    <div class="row g-4 mb-4">
        {{-- Kiri: Spesifikasi Karung & Lingkup --}}
        <div class="col-md-6">
            <div class="insp-section-title text-primary">
                <i class="fas fa-cubes"></i> Spesifikasi & Lingkup Inspeksi
            </div>

            <div class="detail-insp-row">
                <div class="detail-insp-label">Jenis Inspeksi</div>
                <div>:</div>
                <div class="detail-insp-value">
                    @forelse($jenisInspeksi as $jenis)
                        <span class="badge bg-primary-subtle text-primary border border-primary-subtle me-1 text-uppercase" style="font-size: 11px;">
                            {{ $jenis }}
                        </span>
                    @empty
                        <span class="text-muted">-</span>
                    @endforelse
                </div>
            </div>

            <div class="detail-insp-row">
                <div class="detail-insp-label">Komoditas Karung</div>
                <div>:</div>
                <div class="detail-insp-value fw-semibold">{{ $form->komoditas ?: '-' }}</div>
            </div>

            <div class="detail-insp-row">
                <div class="detail-insp-label">Kapasitas Karung</div>
                <div>:</div>
                <div class="detail-insp-value fw-semibold">{{ $form->kapasitas_karung ?: '-' }}</div>
            </div>

            <div class="detail-insp-row">
                <div class="detail-insp-label">Jumlah Partai / Lot</div>
                <div>:</div>
                <div class="detail-insp-value fw-semibold">{{ $form->jumlah_partai_lot ?? 1 }} Partai</div>
            </div>

            <div class="detail-insp-row">
                <div class="detail-insp-label">Bahasa Laporan</div>
                <div>:</div>
                <div class="detail-insp-value fw-semibold text-capitalize">{{ $form->bahasa_laporan ?? 'Indonesia' }}</div>
            </div>

            @if(!empty($form->spesifikasi_dimensi))
            <div class="detail-insp-row">
                <div class="detail-insp-label">Spesifikasi Dimensi</div>
                <div>:</div>
                <div class="detail-insp-value">
                    <div class="p-2 rounded bg-light border text-secondary" style="font-size: 12px; line-height: 1.5;">
                        {{ $form->spesifikasi_dimensi }}
                    </div>
                </div>
            </div>
            @endif

            <div class="detail-insp-row">
                <div class="detail-insp-label">Tujuan Inspeksi</div>
                <div>:</div>
                <div class="detail-insp-value">{{ $form->tujuan_inspeksi ?? '-' }}</div>
            </div>
        </div>

        {{-- Kanan: Pelaksanaan & Berkas Surat Klien --}}
        <div class="col-md-6">
            <div class="insp-section-title text-primary">
                <i class="fas fa-calendar-alt"></i> Pelaksanaan Lapangan & Berkas
            </div>

            <div class="detail-insp-row">
                <div class="detail-insp-label">Rencana Tgl Inspeksi</div>
                <div>:</div>
                <div class="detail-insp-value fw-bold text-primary">
                    {{ $form->tgl_rencana_inspeksi ? \Carbon\Carbon::parse($form->tgl_rencana_inspeksi)->translatedFormat('l, d F Y') : '-' }}
                </div>
            </div>

            <div class="detail-insp-row">
                <div class="detail-insp-label">Lokasi Gudang / Pabrik</div>
                <div>:</div>
                <div class="detail-insp-value">
                    <div class="d-flex align-items-start gap-1">
                        <i class="fas fa-map-marker-alt text-danger mt-1"></i>
                        <span>{{ $form->lokasi_inspeksi ?? '-' }}</span>
                    </div>
                </div>
            </div>

            <div class="detail-insp-row">
                <div class="detail-insp-label">No. Surat Klien</div>
                <div>:</div>
                <div class="detail-insp-value font-monospace">{{ $form->no_surat_pemohon ?: 'Tidak Ada Nomor' }}</div>
            </div>

            <div class="detail-insp-row">
                <div class="detail-insp-label">Tgl. Surat Klien</div>
                <div>:</div>
                <div class="detail-insp-value">
                    {{ $form->tgl_surat_pemohon ? \Carbon\Carbon::parse($form->tgl_surat_pemohon)->translatedFormat('d F Y') : '-' }}
                </div>
            </div>

            <div class="detail-insp-row">
                <div class="detail-insp-label">Berkas Surat Klien</div>
                <div>:</div>
                <div class="detail-insp-value">
                    @if(!empty($form->file_surat_permohonan))
                        <a href="{{ asset('storage/' . $form->file_surat_permohonan) }}" target="_blank"
                            class="btn btn-xs btn-outline-primary d-inline-flex align-items-center gap-1 py-1 px-2.5 rounded-2">
                            <i class="fas fa-file-pdf text-danger"></i>
                            <span>Buka / Unduh Berkas Surat</span>
                        </a>
                    @else
                        <span class="text-muted fst-italic">Tidak ada file terunggah</span>
                    @endif
                </div>
            </div>
        </div>
    </div>

    {{-- ── 3. PIHAK TERKAIT: PENERIMA & PENANGGUNG BIAYA ── --}}
    <div class="row g-4 mb-4">
        {{-- Kiri: Hasil Dibuat Untuk --}}
        <div class="col-md-6">
            <div class="insp-section-title text-primary">
                <i class="fas fa-building"></i> Hasil Inspeksi Dibuat Untuk
            </div>

            <div class="detail-insp-row">
                <div class="detail-insp-label">Nama Lembaga / Instansi</div>
                <div>:</div>
                <div class="detail-insp-value fw-bold text-dark">{{ $form->penerima_hasil_nama ?: '-' }}</div>
            </div>

            <div class="detail-insp-row">
                <div class="detail-insp-label">Alamat Instansi</div>
                <div>:</div>
                <div class="detail-insp-value">{{ $form->penerima_hasil_alamat ?? '-' }}</div>
            </div>

            <div class="detail-insp-row">
                <div class="detail-insp-label">Email Instansi</div>
                <div>:</div>
                <div class="detail-insp-value">{{ $form->penerima_hasil_email ?? '-' }}</div>
            </div>
        </div>

        {{-- Kanan: Biaya Ditanggung Oleh & PIC Pemohon --}}
        <div class="col-md-6">
            <div class="insp-section-title text-primary">
                <i class="fas fa-wallet"></i> Penanggung Biaya & Kontak PIC
            </div>

            <div class="detail-insp-row">
                <div class="detail-insp-label">Penanggung Biaya</div>
                <div>:</div>
                <div class="detail-insp-value fw-bold text-dark">{{ $form->biaya_nama ?? '-' }}</div>
            </div>

            <div class="detail-insp-row">
                <div class="detail-insp-label">Alamat Penanggung Biaya</div>
                <div>:</div>
                <div class="detail-insp-value">{{ $form->biaya_alamat ?? '-' }}</div>
            </div>

            <div class="detail-insp-row">
                <div class="detail-insp-label">Email Penanggung Biaya</div>
                <div>:</div>
                <div class="detail-insp-value">{{ $form->biaya_email ?? '-' }}</div>
            </div>

            <hr class="my-2 border-slate-200">

            <div class="detail-insp-row">
                <div class="detail-insp-label">Nama Personel PIC</div>
                <div>:</div>
                <div class="detail-insp-value fw-semibold">{{ $form->pemohon_pic_nama ?? '-' }}</div>
            </div>

            <div class="detail-insp-row">
                <div class="detail-insp-label">Kontak / WhatsApp PIC</div>
                <div>:</div>
                <div class="detail-insp-value">
                    <span class="text-success fw-semibold">
                        <i class="fab fa-whatsapp me-1"></i>{{ $form->pemohon_pic_kontak ?? '-' }}
                    </span>
                </div>
            </div>

            <div class="detail-insp-row">
                <div class="detail-insp-label">Alamat PIC</div>
                <div>:</div>
                <div class="detail-insp-value">{{ $form->pemohon_pic_alamat ?? '-' }}</div>
            </div>
        </div>
    </div>

    {{-- ── 4. STATUS PERNYATAAN & INTEGRITAS ── --}}
    <div class="alert alert-success border-0 bg-success-subtle text-success-emphasis p-3 rounded-3 d-flex align-items-center gap-3">
        <i class="fas fa-shield-alt fa-2x text-success"></i>
        <div>
            <h6 class="fw-bold mb-1">Pernyataan & Klausul Integritas Pemohon</h6>
            <p class="mb-0 small text-secondary">
                Pemohon menyatakan menyetujui seluruh ketentuan pemeriksaan teknis, independensi lembaga inspeksi BBSPJIKKP, dan kebenaran data objek inspeksi.
                @if($form->pernyataan_at)
                    <span class="d-block mt-1 text-muted fst-italic">
                        Dikonfirmasi secara digital pada: {{ \Carbon\Carbon::parse($form->pernyataan_at)->translatedFormat('d F Y, H:i') }} WIB
                    </span>
                @endif
            </p>
        </div>
    </div>

</div>
