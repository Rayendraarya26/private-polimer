<style>
    .detail-uji-row {
        display: grid;
        grid-template-columns: 200px 10px 1fr;
        margin-bottom: 8px;
        font-size: 13px;
    }

    .detail-uji-label {
        color: #64748b;
        font-weight: 500;
    }

    .detail-uji-value {
        word-break: break-word;
        color: #1e293b;
    }

    .uji-section-title {
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

    .uji-stat-card {
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 10px;
        padding: 12px 16px;
    }

    .uji-sample-card {
        background: #ffffff;
        border: 1px solid #e2e8f0;
        border-radius: 10px;
        margin-bottom: 16px;
        overflow: hidden;
    }

    .uji-sample-header {
        background: #f8fafc;
        padding: 12px 16px;
        border-bottom: 1px solid #e2e8f0;
    }
</style>

<div class="space-y-4">

    {{-- ── 1. STATISTIC HIGHLIGHT CARDS ── --}}
    <div class="row g-3 mb-4">
        <div class="col-md-4">
            <div class="uji-stat-card border-start border-1 border-secondary">
                <span class="text-uppercase text-muted" style="font-size: 11px; letter-spacing: 0.5px;">Total Sampel
                    Diuji</span>
                <h4 class="fw-bold text-primary mb-0 mt-1">
                    {{ $form->samples ? $form->samples->count() : 0 }}
                    <small class="fs-6 text-muted fw-normal">Sampel</small>
                </h4>
            </div>
        </div>

        <div class="col-md-4">
            <div class="uji-stat-card border-start border-1 border-secondary">
                <span class="text-uppercase text-muted" style="font-size: 11px; letter-spacing: 0.5px;">Estimasi Total
                    Biaya</span>
                <h4 class="fw-bold text-success mb-0 mt-1">
                    Rp {{ number_format($form->total_estimasi_biaya ?? 0, 0, ',', '.') }}
                </h4>
            </div>
        </div>

        <div class="col-md-4">
            <div class="uji-stat-card border-start border-1 border-secondary">
                <span class="text-uppercase text-muted" style="font-size: 11px; letter-spacing: 0.5px;">Kategori
                    Tarif</span>
                <h5 class="fw-bold text-dark mb-0 mt-1 text-capitalize">
                    {{ $form->kategori_tarif === 'mahasiswa_pp54' ? 'Mahasiswa (PP 54)' : 'Umum / Industri' }}
                </h5>
            </div>
        </div>
    </div>

    {{-- ── 2. DATA PERMINTAAN & ADMINISTRASI ── --}}
    <div class="row g-4 mb-4">
        {{-- Kiri: Data Pemohon & Penanggung Biaya --}}
        <div class="col-md-6">
            <div class="uji-section-title text-primary">
                <i class="bi bi-person-badge"></i> Data Pemohon & Biaya
            </div>

            <div class="detail-uji-row">
                <div class="detail-uji-label">Diajukan Oleh</div>
                <div>:</div>
                <div class="detail-uji-value fw-semibold">{{ $form->diajukan_oleh ?? '-' }}</div>
            </div>

            <div class="detail-uji-row">
                <div class="detail-uji-label">Biaya Ditanggung Oleh</div>
                <div>:</div>
                <div class="detail-uji-value fw-semibold text-primary">
                    {{ $form->biaya_ditanggung_oleh ?? '-' }}
                </div>
            </div>

            <div class="detail-uji-row">
                <div class="detail-uji-label">Cara Pembayaran</div>
                <div>:</div>
                <div class="detail-uji-value text-capitalize">
                    <span
                        class="badge bg-light text-dark border">{{ str_replace('_', ' ', $form->cara_pembayaran ?? 'transfer') }}</span>
                </div>
            </div>

            <div class="detail-uji-row">
                <div class="detail-uji-label">Bahasa Laporan (LHU)</div>
                <div>:</div>
                <div class="detail-uji-value text-capitalize">
                    {{ $form->bahasa_laporan === 'en' ? 'Bilingual (Indonesia & English)' : 'Bahasa Indonesia' }}
                </div>
            </div>
        </div>

        {{-- Kanan: Tujuan Pengiriman & Catatan --}}
        <div class="col-md-6">
            <div class="uji-section-title text-primary">
                <i class="bi bi-truck"></i> Pengiriman Laporan & Instruksi
            </div>

            <div class="detail-uji-row">
                <div class="detail-uji-label">Laporan Dialamatkan Ke</div>
                <div>:</div>
                <div class="detail-uji-value">{{ $form->laporan_dialamatkan_kepada ?? '-' }}</div>
            </div>

            <div class="detail-uji-row">
                <div class="detail-uji-label">No. Surat Pengantar</div>
                <div>:</div>
                <div class="detail-uji-value">{{ $form->no_surat_pengantar ?? '-' }}</div>
            </div>

            <div class="detail-uji-row">
                <div class="detail-uji-label">Keterangan / Instruksi</div>
                <div>:</div>
                <div class="detail-uji-value">{{ $form->keterangan_permintaan ?? '-' }}</div>
            </div>
        </div>
    </div>

    {{-- ── 3. RINCIAN SAMPEL & PARAMETER UJI ── --}}
    <div class="mb-4">
        <div class="uji-section-title text-dark">
            <i class="bi bi-box-seam"></i> Daftar Sampel & Parameter Pengujian
            ({{ $form->samples ? $form->samples->count() : 0 }} Sampel)
        </div>

        @forelse($form->samples ?? [] as $index => $sample)
            <div class="uji-sample-card shadow-sm">
                <div class="uji-sample-header d-flex justify-content-between align-items-center">
                    <div>
                        <span class="fs-6 me-2">Sampel #{{ $index + 1 }}</span>
                        <strong class="text-dark fs-6">{{ $sample->nama_sampel }}</strong>
                    </div>
                    <span class="badge bg-light text-dark border">
                        Subtotal: <strong>Rp {{ number_format($sample->subtotal ?? 0, 0, ',', '.') }}</strong>
                    </span>
                </div>

                <div class="p-3">
                    <div class="row g-3 mb-3">
                        <div class="col-md-3">
                            <small class="text-muted d-block">Bentuk Sampel</small>
                            <span class="fw-medium">{{ $sample->bentuk_sampel ?? '-' }}</span>
                        </div>
                        <div class="col-md-3">
                            <small class="text-muted d-block">Jumlah / Kuantitas</small>
                            <span class="fw-medium">{{ $sample->jumlah_sampel }} {{ $sample->satuan_sampel }}</span>
                        </div>
                        <div class="col-md-3">
                            <small class="text-muted d-block">Kondisi Sampel</small>
                            <span class="badge bg-success-subtle text-success border border-success-subtle">
                                {{ $sample->kondisi_sampel ?? 'Baik' }}
                            </span>
                        </div>
                        <div class="col-md-3">
                            <small class="text-muted d-block">No. Lot / Batch</small>
                            <span class="fw-medium">{{ $sample->no_lot_bets ?? '-' }}</span>
                        </div>
                    </div>

                    {{-- Tabel Parameter Uji Sampel Ini --}}
                    @if($sample->parameters && $sample->parameters->isNotEmpty())
                        <div>
                            <small class="text-muted fw-bold d-block mb-2">Parameter Uji yang Dipilih:</small>
                            <div class="table-responsive">
                                <table class="table table-sm table-bordered align-middle mb-0" style="font-size: 13px;">
                                    <thead class="table-light">
                                        <tr>
                                            <th class="text-center" style="width: 40px;">No</th>
                                            <th>Nama Parameter Uji</th>
                                            <th>Metode Standar Uji</th>
                                            <th class="text-end" style="width: 160px;">Tarif PNBP</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        @foreach($sample->parameters as $pIdx => $param)
                                            <tr>
                                                <td class="text-center">{{ $pIdx + 1 }}</td>
                                                <td>
                                                    <strong>{{ $param->nama_parameter }}</strong>
                                                    @if($param->satuan)
                                                        <small class="text-muted d-block">Satuan: {{ $param->satuan }}</small>
                                                    @endif
                                                </td>
                                                <td>{{ $param->metode_uji ?? '-' }}</td>
                                                <td class="text-end fw-semibold text-success">
                                                    Rp {{ number_format($param->tarif ?? 0, 0, ',', '.') }}
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
            <div class="alert alert-warning mb-0">Belum ada rincian sampel pengujian.</div>
        @endforelse
    </div>

</div>