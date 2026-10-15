<style>
.detail-grk-row {
    display: grid;
    grid-template-columns: 200px 10px 1fr;
    margin-bottom: 8px;
    font-size: 13px;
}
.detail-grk-label {
    color: #64748b;
    font-weight: 500;
}
.detail-grk-value {
    word-break: break-word;
    color: #1e293b;
}
.grk-section-title {
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
.grk-stat-card {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    padding: 12px 16px;
}
</style>

@php
    $formatNum = function($val, $decimals = 4) {
        if ($val === null || $val === '') return '-';
        return rtrim(rtrim(number_format((float) $val, $decimals, ',', '.'), '0'), ',');
    };

    $getFileUrl = function($path) {
        if (empty($path)) return null;
        if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://') || str_starts_with($path, '/storage/')) {
            return $path;
        }
        return asset('storage/' . $path);
    };

    $parseArray = function($val) {
        if (is_array($val)) return $val;
        if (is_string($val)) {
            $decoded = json_decode($val, true);
            if (is_array($decoded)) return $decoded;
            return array_filter(array_map('trim', explode(',', $val)));
        }
        return [];
    };

    $baselineKg = (float) ($form->jumlah_emisi_baseline_kgco2e ?? 0);
    $proyekKg = (float) ($form->jumlah_emisi_proyek_kgco2e ?? 0);
    $reduksiKg = $baselineKg - $proyekKg;
    $reduksiTon = $reduksiKg / 1000;
    $baselineTon = $baselineKg / 1000;
    $proyekTon = $proyekKg / 1000;

    $jenisProyekList = $parseArray($form->jenis_proyek_grk ?? []);
    $jenisGasList = $parseArray($form->jenis_gas_emisi ?? []);
@endphp

<div class="space-y-4">
    {{-- ── 1. HIGHLIGHT CARD: EMISI & PARAMETER KUNCI VALIDASI ── --}}
    <div class="row g-3 mb-4">
        <div class="col-md-3">
            <div class="grk-stat-card border-start border-1 border-secondary">
                <span class="text-uppercase text-muted" style="font-size: 11px; letter-spacing: 0.5px;">Estimasi Reduksi Emisi</span>
                <h4 class="fw-bold text-success mb-0 mt-1">
                    {{ $formatNum($reduksiTon) }}
                    <small class="fs-6 text-muted fw-normal">ton CO₂e</small>
                </h4>
                <div class="small text-muted mt-1 font-monospace" style="font-size: 11px;">
                    ({{ $formatNum($reduksiKg, 2) }} kgCO₂e)
                </div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="grk-stat-card border-start border-1 border-secondary">
                <span class="text-uppercase text-muted" style="font-size: 11px; letter-spacing: 0.5px;">Emisi Baseline</span>
                <h5 class="fw-bold text-primary mb-0 mt-1">
                    {{ $formatNum($baselineTon) }}
                    <small class="fs-6 text-muted fw-normal">ton CO₂e</small>
                </h5>
                <div class="small text-muted mt-1 font-monospace" style="font-size: 11px;">
                    ({{ $formatNum($baselineKg, 2) }} kgCO₂e)
                </div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="grk-stat-card border-start border-1 border-secondary">
                <span class="text-uppercase text-muted" style="font-size: 11px; letter-spacing: 0.5px;">Emisi Skenario Proyek</span>
                <h6 class="fw-bold text-dark mb-0 mt-1">
                    {{ $formatNum($proyekTon) }}
                    <small class="fs-6 text-muted fw-normal">ton CO₂e</small>
                </h6>
                <div class="small text-muted mt-1 font-monospace" style="font-size: 11px;">
                    ({{ $formatNum($proyekKg, 2) }} kgCO₂e)
                </div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="grk-stat-card border-start border-1 border-secondary">
                <span class="text-uppercase text-muted" style="font-size: 11px; letter-spacing: 0.5px;">Ambang Materialitas</span>
                <h6 class="fw-bold text-dark mb-0 mt-1">
                    {{ $form->materialitas_tipe === 'custom' ? ($form->materialitas_custom ?? '-') : 'Standar Default (5%)' }}
                </h6>
                <div class="small text-muted mt-1" style="font-size: 11px;">
                    Kriteria: {{ $form->kriteria_verifikasi ?? 'ISO 14064-2' }}
                </div>
            </div>
        </div>
    </div>

    {{-- ── 2. INFORMASI ORGANISASI & RUANG LINGKUP ── --}}
    <div class="row g-4 mb-4">
        <!-- Kolom Kiri: Struktur Organisasi Pemohon -->
        <div class="col-md-6">
            <div class="grk-section-title">
                <i class="bi bi-building text-primary"></i>
                <span>A. Identitas & Pimpinan Organisasi</span>
            </div>

            <div class="detail-grk-row">
                <div class="detail-grk-label">Nama Merek / Judul Proyek</div>
                <div>:</div>
                <div class="detail-grk-value fw-semibold text-primary">{{ $form->merek_sample ?? '-' }}</div>
            </div>

            <div class="detail-grk-row">
                <div class="detail-grk-label">Nama Pemilik Organisasi</div>
                <div>:</div>
                <div class="detail-grk-value fw-semibold">{{ $form->nama_pemilik ?? '-' }}</div>
            </div>

            <div class="detail-grk-row">
                <div class="detail-grk-label">Pimpinan Puncak</div>
                <div>:</div>
                <div class="detail-grk-value fw-semibold">{{ $form->nama_pimpinan ?? '-' }}</div>
            </div>

            <div class="detail-grk-row">
                <div class="detail-grk-label">Penanggung Jawab (PJ) GRK</div>
                <div>:</div>
                <div class="detail-grk-value fw-semibold">{{ $form->nama_pj ?? '-' }}</div>
            </div>

            <div class="detail-grk-row">
                <div class="detail-grk-label">Jumlah Karyawan</div>
                <div>:</div>
                <div class="detail-grk-value">{{ $form->jumlah_karyawan ? $form->jumlah_karyawan . ' Orang' : '-' }}</div>
            </div>

            <div class="detail-grk-row">
                <div class="detail-grk-label">Deskripsi Aktivitas</div>
                <div>:</div>
                <div class="detail-grk-value">{{ $form->deskripsi_aktivitas ?? '-' }}</div>
            </div>

            <div class="detail-grk-row">
                <div class="detail-grk-label">Uraian Kebutuhan Validasi</div>
                <div>:</div>
                <div class="detail-grk-value">{{ $form->uraian_kebutuhan ?? '-' }}</div>
            </div>
        </div>

        <!-- Kolom Kanan: Parameter Standar & Batasan Proyek -->
        <div class="col-md-6">
            <div class="grk-section-title">
                <i class="bi bi-sliders text-primary"></i>
                <span>B. Parameter Standar & Batasan Proyek Validasi</span>
            </div>

            <div class="detail-grk-row">
                <div class="detail-grk-label">Acuan Standar / Regulasi</div>
                <div>:</div>
                <div class="detail-grk-value fw-semibold">{{ $form->acuan_peraturan ?? 'ISO 14064-2' }}</div>
            </div>

            <div class="detail-grk-row">
                <div class="detail-grk-label">Ruang Lingkup Diajukan</div>
                <div>:</div>
                <div class="detail-grk-value fw-semibold">{{ $form->ruang_lingkup_diajukan ?? '-' }}</div>
            </div>

            <div class="detail-grk-row">
                <div class="detail-grk-label">Kriteria Validasi</div>
                <div>:</div>
                <div class="detail-grk-value">
                    <span class="badge bg-light text-dark border">{{ $form->kriteria_verifikasi ?? 'ISO 14064-2' }}</span>
                </div>
            </div>

            <div class="detail-grk-row">
                <div class="detail-grk-label">Tingkat Jaminan (Assurance)</div>
                <div>:</div>
                <div class="detail-grk-value text-capitalize">
                    {{ $form->tingkat_jaminan ?? 'Reasonable' }} Assurance
                </div>
            </div>

            <div class="detail-grk-row">
                <div class="detail-grk-label">Batasan Proyek</div>
                <div>:</div>
                <div class="detail-grk-value">{{ $form->batasan_proyek ?? '-' }}</div>
            </div>

            <div class="detail-grk-row">
                <div class="detail-grk-label">Periode Proyek</div>
                <div>:</div>
                <div class="detail-grk-value">
                    {{ $form->periode_mulai ? \Carbon\Carbon::parse($form->periode_mulai)->translatedFormat('d M Y') : '-' }}
                    s.d.
                    {{ $form->periode_selesai ? \Carbon\Carbon::parse($form->periode_selesai)->translatedFormat('d M Y') : '-' }}
                </div>
            </div>

            <div class="detail-grk-row">
                <div class="detail-grk-label">Metode SSR Kuantifikasi</div>
                <div>:</div>
                <div class="detail-grk-value">{{ $form->ssr_kuantifikasi ?? '-' }}</div>
            </div>

            <div class="detail-grk-row">
                <div class="detail-grk-label">Jenis Proyek GRK</div>
                <div>:</div>
                <div class="detail-grk-value">
                    @if(count($jenisProyekList) > 0)
                        <div class="d-flex flex-wrap gap-1">
                            @foreach($jenisProyekList as $jp)
                                <span class="badge bg-light text-dark border">{{ $jp }}</span>
                            @endforeach
                        </div>
                    @else
                        <span class="text-muted">-</span>
                    @endif
                </div>
            </div>

            <div class="detail-grk-row">
                <div class="detail-grk-label">Jenis Gas Rumah Kaca</div>
                <div>:</div>
                <div class="detail-grk-value">
                    @if(count($jenisGasList) > 0)
                        <div class="d-flex flex-wrap gap-1">
                            @foreach($jenisGasList as $jg)
                                <span class="badge bg-success-subtle text-success border border-success">{{ $jg }}</span>
                            @endforeach
                        </div>
                    @else
                        <span class="text-muted">-</span>
                    @endif
                </div>
            </div>

            <div class="detail-grk-row">
                <div class="detail-grk-label">Pihak Ketiga / Konsultan</div>
                <div>:</div>
                <div class="detail-grk-value">
                    @if($form->use_konsultan)
                        <span class="badge bg-secondary text-dark">Menggunakan Konsultan</span>
                        <div class="small text-muted mt-1">
                            {{ $form->konsultan_nama ?? '-' }} ({{ $form->konsultan_institusi ?? '-' }})
                        </div>
                    @else
                        <span class="badge bg-secondary">Mandiri (Tanpa Konsultan)</span>
                    @endif
                </div>
            </div>
        </div>
    </div>

    {{-- ── 3. PERBANDINGAN SKENARIO EMISI BASELINE VS PROYEK ── --}}
    <div class="mb-4">
        <div class="grk-section-title">
            <i class="bi bi-table text-primary"></i>
            <span>C. Perbandingan Skenario Emisi Baseline vs Proyek Validasi</span>
        </div>

        <div class="table-responsive rounded-3 border">
            <table class="table table-hover table-sm align-middle mb-0" style="font-size: 12px;">
                <thead class="table-light">
                    <tr>
                        <th class="py-2" style="width: 50px;">No</th>
                        <th class="py-2">Komponen Skenario</th>
                        <th class="py-2 text-end" style="width: 170px;">Jumlah Emisi (kgCO₂e)</th>
                        <th class="py-2 text-end" style="width: 170px;">Jumlah Emisi (ton CO₂e)</th>
                        <th class="py-2">Keterangan</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="text-center text-muted">1</td>
                        <td>
                            <span class="fw-semibold text-slate-800">Skenario Emisi Baseline</span>
                        </td>
                        <td class="text-end font-monospace">{{ $formatNum($baselineKg, 2) }}</td>
                        <td class="text-end font-monospace fw-bold text-primary">{{ $formatNum($baselineTon) }}</td>
                        <td><span class="text-muted" style="font-size: 11px;">Proyeksi emisi tanpa intervensi kegiatan proyek mitigasi</span></td>
                    </tr>
                    <tr>
                        <td class="text-center text-muted">2</td>
                        <td>
                            <span class="fw-semibold text-slate-800">Skenario Emisi Proyek Validasi</span>
                        </td>
                        <td class="text-end font-monospace">{{ $formatNum($proyekKg, 2) }}</td>
                        <td class="text-end font-monospace fw-bold text-dark">{{ $formatNum($proyekTon) }}</td>
                        <td><span class="text-muted" style="font-size: 11px;">Estimasi emisi terencana setelah implementasi proyek</span></td>
                    </tr>
                </tbody>
                <tfoot class="table-light">
                    <tr>
                        <th colspan="2" class="text-end py-2 text-uppercase fw-bold">Estimasi Reduksi Emisi Bersih (1 - 2):</th>
                        <th class="text-end py-2 fw-bold text-success font-monospace" style="font-size: 13px;">
                            {{ $formatNum($reduksiKg, 2) }} kgCO₂e
                        </th>
                        <th class="text-end py-2 fw-bold text-success font-monospace" style="font-size: 13px;">
                            {{ $formatNum($reduksiTon) }} ton CO₂e
                        </th>
                        <th class="text-success fw-semibold" style="font-size: 11px;">Potensi Penurunan Emisi GRK</th>
                    </tr>
                </tfoot>
            </table>
        </div>
    </div>

    {{-- ── 4. DOKUMEN PERSYARATAN & BUKTI PENDUKUNG ── --}}
    <div>
        <div class="grk-section-title">
            <i class="bi bi-file-earmark-check text-primary"></i>
            <span>D. Dokumen Persyaratan Validasi GRK</span>
        </div>

        @php
            $dokumenList = $form->dokumen ?? collect([]);
        @endphp

        @if($dokumenList->isNotEmpty())
            <div class="table-responsive rounded-3 border">
                <table class="table table-hover table-sm align-middle mb-0" style="font-size: 12px;">
                    <thead class="table-light">
                        <tr>
                            <th class="py-2" style="width: 50px;">No</th>
                            <th class="py-2">Nama Dokumen Persyaratan</th>
                            <th class="py-2" style="width: 140px;">Status Ketersediaan</th>
                            <th class="py-2">Keterangan / Nomor Dokumen</th>
                            <th class="py-2 text-center" style="width: 120px;">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach($dokumenList as $dIdx => $dok)
                            @php
                                $fileUrl = $getFileUrl($dok->file_path ?? null);
                            @endphp
                            <tr>
                                <td class="text-center text-muted">{{ $dIdx + 1 }}</td>
                                <td>
                                    <div class="fw-semibold text-slate-800">{{ $dok->nama_dokumen ?? $dok->title ?? '-' }}</div>
                                    @if(!empty($dok->kode_dokumen))
                                        <small class="text-muted font-monospace">Kode: {{ $dok->kode_dokumen }}</small>
                                    @endif
                                </td>
                                <td>
                                    @if(strtoupper($dok->status_ketersediaan ?? '') === 'TERSEDIA')
                                        <span class="badge bg-success-subtle text-success border border-success">
                                            <i class="bi bi-check-circle me-1"></i> Tersedia
                                        </span>
                                    @else
                                        <span class="badge bg-secondary-subtle text-secondary border">
                                            Tidak Tersedia
                                        </span>
                                    @endif
                                </td>
                                <td>
                                    <span class="text-slate-700">{{ $dok->keterangan ?? '-' }}</span>
                                </td>
                                <td class="text-center">
                                    @if(!empty($dok->file_path))
                                        <a href="{{ $fileUrl }}" target="_blank" class="btn btn-outline-primary btn-sm py-0 px-2 preview-btn" data-file="{{ $fileUrl }}" style="font-size: 11px;">
                                            <i class="bi bi-eye me-1"></i> Lihat File
                                        </a>
                                    @else
                                        <span class="text-muted" style="font-size: 11px;">Lampiran Fisik</span>
                                    @endif
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        @else
            <div class="alert alert-light border text-muted py-3 text-center" style="font-size: 13px;">
                <i class="bi bi-info-circle me-1"></i> Dokumen persyaratan belum diunggah atau tidak ditemukan.
            </div>
        @endif
    </div>
</div>
