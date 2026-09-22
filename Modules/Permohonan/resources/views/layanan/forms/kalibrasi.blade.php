<style>
    .detail-kal-row {
        display: grid;
        grid-template-columns: 200px 10px 1fr;
        margin-bottom: 8px;
        font-size: 13px;
    }

    .detail-kal-label {
        color: #64748b;
        font-weight: 500;
    }

    .detail-kal-value {
        word-break: break-word;
        color: #1e293b;
    }

    .kal-section-title {
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

    .kal-stat-card {
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 10px;
        padding: 12px 16px;
    }

    .kal-alat-card {
        background: #ffffff;
        border: 1px solid #e2e8f0;
        border-radius: 10px;
        margin-bottom: 16px;
        overflow: hidden;
    }

    .kal-alat-header {
        background: #f8fafc;
        padding: 12px 16px;
        border-bottom: 1px solid #e2e8f0;
    }
</style>

<div class="space-y-4">

    {{-- ── 1. STATISTIC HIGHLIGHT CARDS ── --}}
    <div class="row g-3 mb-4">
        <div class="col-md-4">
            <div class="kal-stat-card border-start border-1 border-secondary">
                <span class="text-uppercase text-muted" style="font-size: 11px; letter-spacing: 0.5px;">Total Jenis Alat
                    Dikalibrasi</span>
                <h4 class="fw-bold text-primary mb-0 mt-1">
                    {{ $form->total_alat ?? $form->alatList?->count() ?? 0 }}
                    <small class="fs-6 text-muted fw-normal">Jenis</small>
                </h4>
            </div>
        </div>
        <div class="col-md-4">
            <div class="kal-stat-card border-start border-1 border-secondary">
                <span class="text-uppercase text-muted" style="font-size: 11px; letter-spacing: 0.5px;">Total Alat
                    Dikalibrasi</span>
                <h4 class="fw-bold text-success mb-0 mt-1">
                    {{ $form->alatList?->sum('jumlah') ?? 0 }}
                    <small class="fs-6 text-muted fw-normal">Unit Alat</small>
                </h4>
            </div>
        </div>
        <div class="col-md-4">
            <div class="kal-stat-card border-start border-1 border-secondary">
                <span class="text-uppercase text-muted" style="font-size: 11px; letter-spacing: 0.5px;">Lokasi
                    Pelaksanaan</span>
                <h5 class="fw-bold text-dark mb-0 mt-1">
                    {{ $form->lokasi_pelaksanaan === 'onsite' ? 'On-Site (Di Lokasi Klien)' : 'Laboratorium Kalibrasi' }}
                </h5>
            </div>
        </div>
    </div>

    {{-- ── 2. INFORMASI PEMOHON & PENGIRIMAN ── --}}
    <div class="row g-4 mb-4">
        {{-- Kiri: Data Pemohon --}}
        <div class="col-md-6">
            <div class="kal-section-title text-primary">
                <i class="bi bi-person-badge"></i> Identitas Pemohon
            </div>

            <div class="detail-kal-row">
                <div class="detail-kal-label">Nama Pemohon</div>
                <div>:</div>
                <div class="detail-kal-value fw-semibold">{{ $form->nama_pemohon ?? '-' }}</div>
            </div>

            <div class="detail-kal-row">
                <div class="detail-kal-label">No. Telepon / WA</div>
                <div>:</div>
                <div class="detail-kal-value">{{ $form->no_telp ?? '-' }}</div>
            </div>

            <div class="detail-kal-row">
                <div class="detail-kal-label">Sertifikat Atas Nama</div>
                <div>:</div>
                <div class="detail-kal-value fw-semibold text-primary">
                    {{ $form->hasil_kalibrasi_untuk ?? '-' }}
                </div>
            </div>

            <div class="detail-kal-row">
                <div class="detail-kal-label">Alamat Pemohon</div>
                <div>:</div>
                <div class="detail-kal-value">{{ $form->alamat_pemohon ?? '-' }}</div>
            </div>
        </div>

        {{-- Kanan: Pelaksanaan & Pengiriman --}}
        <div class="col-md-6">
            <div class="kal-section-title text-primary">
                <i class="bi bi-truck"></i> Pelaksanaan & Pengiriman
            </div>

            <div class="detail-kal-row">
                <div class="detail-kal-label">Bahasa Laporan</div>
                <div>:</div>
                <div class="detail-kal-value text-capitalize">
                    <span class="badge bg-secondary">{{ $form->bahasa_laporan ?? 'Indonesia' }}</span>
                </div>
            </div>

            <div class="detail-kal-row">
                <div class="detail-kal-label">Uraian / Catatan</div>
                <div>:</div>
                <div class="detail-kal-value">{{ $form->uraian_kalibrasi ?? '-' }}</div>
            </div>

            <div class="detail-kal-row">
                <div class="detail-kal-label">Penerima Hasil</div>
                <div>:</div>
                <div class="detail-kal-value">{{ $form->nama_penerima_kirim ?? '-' }}</div>
            </div>

            <div class="detail-kal-row">
                <div class="detail-kal-label">Alamat Pengiriman</div>
                <div>:</div>
                <div class="detail-kal-value">{{ $form->alamat_pengiriman ?? '-' }}</div>
            </div>
        </div>
    </div>

    {{-- ── 3. RINCIAN ALAT KALIBRASI ── --}}
    <div class="mb-4">
        <div class="kal-section-title text-dark">
            <i class="bi bi-tools"></i> Daftar Alat Kalibrasi ({{ $form->alatList->count() }} Alat)
        </div>

        @forelse($form->alatList as $index => $alat)
            <div class="kal-alat-card shadow-sm">
                <div class="kal-alat-header d-flex justify-content-between align-items-center">
                    <div>
                        <span class="text-dark fs-6 me-1">Alat #{{ $index + 1 }} | </span>
                        <strong class="text-dark fs-6">{{ $alat->nama_alat }}</strong>
                    </div>
                    <span class="badge bg-light text-dark border">
                        Subtotal: <strong>Rp {{ number_format($alat->subtotal_biaya ?? 0, 0, ',', '.') }}</strong>
                    </span>
                </div>

                <div class="p-3">
                    <div class="row g-3 mb-3">
                        <div class="col-md-3">
                            <small class="text-muted d-block">Merk / Pabrik</small>
                            <span class="fw-medium">{{ $alat->merk ?? '-' }}</span>
                        </div>
                        <div class="col-md-3">
                            <small class="text-muted d-block">Tipe / Model</small>
                            <span class="fw-medium">{{ $alat->tipe_model ?? '-' }}</span>
                        </div>
                        <div class="col-md-3">
                            <small class="text-muted d-block">Jumlah Unit</small>
                            <span class="fw-medium">{{ $alat->jumlah }} Unit</span>
                        </div>
                        <div class="col-md-3">
                            <small class="text-muted d-block">Kondisi Alat</small>
                            <span class="badge {{ $alat->kondisi === 'baik' ? 'bg-success' : 'bg-warning text-dark' }}">
                                {{ ucfirst($alat->kondisi ?? 'Baik') }}
                            </span>
                        </div>
                    </div>


                    @if($alat->nomorSeriList && $alat->nomorSeriList->isNotEmpty())
                        <div>
                            <small class="text-muted fw-bold d-block mb-2">Nomor Seri:</small>
                            <div class="table-responsive">
                                <table class="table table-sm table-bordered align-middle mb-0" style="font-size: 13px;">
                                    <thead class="table-light">
                                        <tr>
                                            <th style="width: 50px;">No</th>
                                            <th>Nomor Seri</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        @foreach($alat->nomorSeriList as $i => $seri)
                                            <tr>
                                                <td class="text-center">{{ $i + 1 }}</td>
                                                <td>{{ $seri->nomor_seri ?? '-' }}</td>
                                            </tr>
                                        @endforeach
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    @endif

                    {{-- Item & Parameter Kalibrasi --}}
                    @if($alat->kalibrasiItems && $alat->kalibrasiItems->isNotEmpty())
                        <div>
                            <small class="text-muted fw-bold d-block my-2">Item / Parameter Tarif:</small>
                            <div class="table-responsive">
                                <table class="table table-sm table-bordered align-middle mb-0" style="font-size: 13px;">
                                    <thead class="table-light">
                                        <tr>
                                            <th style="width: 50px;">No</th>
                                            <th>Nama Parameter / Rentang Ukur</th>
                                            <th class="text-end" style="width: 160px;">Tarif PNBP</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        @foreach($alat->kalibrasiItems as $i => $item)
                                            <tr>
                                                <td class="text-center">{{ $i + 1 }}</td>
                                                <td>{{ $item->nama_kalibrasi_snapshot ?? '-' }}</td>
                                                <td class="text-end fw-semibold">
                                                    Rp {{ number_format($item->tarif_satuan_snapshot ?? 0, 0, ',', '.') }}
                                                </td>
                                            </tr>
                                        @endforeach
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    @endif
                </div>
            </div>
        @empty
            <div class="alert alert-warning">Belum ada rincian alat yang dimasukkan.</div>
        @endforelse
    </div>

    {{-- ── 4. PERNYATAAN & PERSETUJUAN ── --}}
    <div class="p-3 bg-light rounded border">
        <div class="d-flex align-items-center gap-2">
            @if($form->setuju_pernyataan)
                <i class="bi bi-check-circle-fill text-success fs-5"></i>
                <div>
                    <div class="fw-semibold text-success">Pemohon telah menyetujui Ketentuan & Pernyataan Layanan Kalibrasi
                    </div>
                    <small class="text-muted">
                        Disetujui pada:
                        {{ $form->pernyataan_at ? \Carbon\Carbon::parse($form->pernyataan_at)->format('d F Y, H:i') . ' WIB' : '-' }}
                    </small>
                </div>
            @else
                <i class="bi bi-exclamation-circle-fill text-warning fs-5"></i>
                <span class="text-muted">Pernyataan belum disetujui pemohon.</span>
            @endif
        </div>
    </div>

</div>