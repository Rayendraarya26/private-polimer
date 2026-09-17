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
    $formatEmisi = function($val) {
        if ($val === null || $val === '') return '-';
        return rtrim(rtrim(number_format((float) $val, 4, ',', '.'), '0'), ',');
    };
@endphp

<div class="space-y-4">
    {{-- ── 1. HIGHLIGHT CARD: TOTAL EMISI & PARAMETER KUNCI ── --}}
    <div class="row g-3 mb-4">
        <div class="col-md-3">
            <div class="grk-stat-card border-start border-1 border-secondary">
                <span class="text-uppercase text-muted" style="font-size: 11px; letter-spacing: 0.5px;">Total Emisi Dilaporkan</span>
                <h4 class="fw-bold text-success mb-0 mt-1">
                    {{ $formatEmisi($form->total_emisi_ton_co2e ?? 0) }}
                    <small class="fs-6 text-muted fw-normal">ton CO₂e</small>
                </h4>
            </div>
        </div>
        <div class="col-md-3">
            <div class="grk-stat-card border-start border-1 border-secondary">
                <span class="text-uppercase text-muted" style="font-size: 11px; letter-spacing: 0.5px;">Tingkat Jaminan (Assurance)</span>
                <h5 class="fw-bold text-primary mb-0 mt-1 text-capitalize">
                    {{ $form->tingkat_jaminan ?? 'Reasonable' }} Assurance
                </h5>
            </div>
        </div>
        <div class="col-md-3">
            <div class="grk-stat-card border-start border-1 border-secondary">
                <span class="text-uppercase text-muted" style="font-size: 11px; letter-spacing: 0.5px;">Periode Pemantauan</span>
                <h6 class="fw-bold text-dark mb-0 mt-1">
                    {{ $form->periode_mulai ? \Carbon\Carbon::parse($form->periode_mulai)->translatedFormat('d M Y') : '-' }}
                    s.d.
                    {{ $form->periode_selesai ? \Carbon\Carbon::parse($form->periode_selesai)->translatedFormat('d M Y') : '-' }}
                </h6>
            </div>
        </div>
        <div class="col-md-3">
            <div class="grk-stat-card border-start border-1 border-secondary">
                <span class="text-uppercase text-muted" style="font-size: 11px; letter-spacing: 0.5px;">Ambang Materialitas</span>
                <h6 class="fw-bold text-dark mb-0 mt-1">
                    {{ $form->materialitas_tipe === 'custom' ? ($form->materialitas_custom ?? '-') : 'Standar Default (5%)' }}
                </h6>
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
                <div class="detail-grk-label">Nama Merek / Sampel</div>
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
                <div class="detail-grk-label">Jumlah Lokasi / Fasilitas</div>
                <div>:</div>
                <div class="detail-grk-value">{{ $form->jumlah_fasilitas ? $form->jumlah_fasilitas . ' Lokasi/Site' : '-' }}</div>
            </div>

            <div class="detail-grk-row">
                <div class="detail-grk-label">Deskripsi Aktivitas</div>
                <div>:</div>
                <div class="detail-grk-value">{{ $form->deskripsi_aktivitas ?? '-' }}</div>
            </div>
        </div>

        <!-- Kolom Kanan: Parameter Standar & Batasan Audit -->
        <div class="col-md-6">
            <div class="grk-section-title">
                <i class="bi bi-sliders text-primary"></i>
                <span>B. Parameter Standar & Batasan Verifikasi</span>
            </div>

            <div class="detail-grk-row">
                <div class="detail-grk-label">Acuan Standar / Regulasi</div>
                <div>:</div>
                <div class="detail-grk-value fw-semibold">{{ $form->acuan_peraturan ?? 'ISO 14064-1 / ISO 14064-3' }}</div>
            </div>

            <div class="detail-grk-row">
                <div class="detail-grk-label">Ruang Lingkup Diajukan</div>
                <div>:</div>
                <div class="detail-grk-value fw-semibold">{{ $form->ruang_lingkup_diajukan ?? '-' }}</div>
            </div>

            <div class="detail-grk-row">
                <div class="detail-grk-label">Kriteria Verifikasi</div>
                <div>:</div>
                <div class="detail-grk-value">
                    <span class="badge bg-light text-dark border">{{ $form->kriteria_verifikasi ?? 'ISO 14064-1' }}</span>
                    @if(!empty($form->kriteria_lainnya))
                        <span class="badge bg-light text-dark border ms-1">{{ $form->kriteria_lainnya }}</span>
                    @endif
                </div>
            </div>

            <div class="detail-grk-row">
                <div class="detail-grk-label">Batasan Organisasi</div>
                <div>:</div>
                <div class="detail-grk-value text-capitalize">
                    {{ $form->organization_boundary ?? 'Internal / Operasional' }}
                </div>
            </div>

            <div class="detail-grk-row">
                <div class="detail-grk-label">Metodologi Pengumpulan</div>
                <div>:</div>
                <div class="detail-grk-value">{{ $form->metodologi_pengumpulan ?? 'Sistem Manual / Spreadsheet Terintegrasi' }}</div>
            </div>

            <div class="detail-grk-row">
                <div class="detail-grk-label">Tingkat Transfer Data</div>
                <div>:</div>
                <div class="detail-grk-value">{{ $form->tingkat_transfer_data ?? '-' }}</div>
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

    {{-- ── 3. RINCIAN INVENTARISASI EMISI GRK (TABEL SCOPE 1 - 6) ── --}}
    <div class="mb-4">
        <div class="grk-section-title">
            <i class="bi bi-table text-primary"></i>
            <span>C. Rincian Inventarisasi Emisi Gas Rumah Kaca (Scope 1 s.d. 6)</span>
        </div>

        @php
            $emisiList = $form->emisi ?? collect([]);
            $emisiGrouped = $emisiList->groupBy(function($item) {
                return $item->kategori_nama ?: 'Kategori Emisi';
            });
        @endphp

        @if($emisiList->isNotEmpty())
            <div class="table-responsive rounded-3 border">
                <table class="table table-hover table-sm align-middle mb-0" style="font-size: 12px;">
                    <thead class="table-light">
                        <tr>
                            <th class="text-center py-2" style="width: 60px;">Status</th>
                            <th class="py-2" style="width: 100px;">Kode</th>
                            <th class="py-2">Subkategori Emisi</th>
                            <th class="py-2">Sumber Emisi</th>
                            <th class="py-2 text-end" style="width: 160px;">Jumlah (ton CO₂e)</th>
                            <th class="py-2">Justifikasi / Keterangan</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach($emisiGrouped as $kategoriNama => $items)
                            <tr style="background-color: #f1f5f9;">
                                <td colspan="6" class="py-2 px-3 fw-bold text-dark border-top border-bottom">
                                    <i class="bi bi-folder2-open text-primary me-1"></i> {{ $kategoriNama }}
                                </td>
                            </tr>
                            @foreach($items as $em)
                                <tr class="{{ $em->is_checked ? 'table-light-success' : '' }}">
                                    <td class="text-center">
                                        @if($em->is_checked)
                                            <span class="badge rounded-pill bg-success-subtle text-success border border-success">
                                                <i class="bi bi-check"></i> Ada
                                            </span>
                                        @else
                                            <span class="badge rounded-pill bg-light text-muted border">
                                                Tidak
                                            </span>
                                        @endif
                                    </td>
                                    <td>
                                        <span class="fw-bold text-dark font-monospace">{{ $em->subkategori_code }}</span>
                                    </td>
                                    <td>
                                        <span class="fw-semibold text-slate-800">{{ $em->subkategori_nama }}</span>
                                    </td>
                                    <td>
                                        <span class="text-slate-700">{{ $em->sumber ?? '-' }}</span>
                                    </td>
                                    <td class="text-end">
                                        @if($em->jumlah !== null && $em->jumlah > 0)
                                            <span class="fw-bold text-success font-monospace">
                                                {{ $formatEmisi($em->jumlah) }}
                                            </span>
                                        @else
                                            <span class="text-muted">-</span>
                                        @endif
                                    </td>
                                    <td>
                                        <span class="text-muted fst-italic" style="font-size: 11px;">
                                            {{ $em->justifikasi ?? '-' }}
                                        </span>
                                    </td>
                                </tr>
                            @endforeach
                        @endforeach
                    </tbody>
                    <tfoot class="table-light">
                        <tr>
                            <th colspan="4" class="text-end py-2 text-uppercase fw-bold">Total Emisi Akumulatif:</th>
                            <th class="text-end py-2 fw-bold text-success font-monospace" style="font-size: 13px;">
                                {{ $formatEmisi($form->total_emisi_ton_co2e ?? 0) }} ton CO₂e
                            </th>
                            <th></th>
                        </tr>
                    </tfoot>
                </table>
            </div>
        @else
            <div class="alert alert-light border text-muted py-3 text-center" style="font-size: 13px;">
                <i class="bi bi-info-circle me-1"></i> Belum ada data rincian emisi yang tersimpan.
            </div>
        @endif
    </div>

    {{-- ── 4. DOKUMEN PERSYARATAN & BUKTI PENDUKUNG ── --}}
    <div>
        <div class="grk-section-title">
            <i class="bi bi-file-earmark-check text-primary"></i>
            <span>D. Dokumen Persyaratan Validasi / Verifikasi GRK</span>
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
                            <tr>
                                <td class="text-center text-muted">{{ $dIdx + 1 }}</td>
                                <td>
                                    <div class="fw-semibold text-slate-800">{{ $dok->nama_dokumen }}</div>
                                    <span class="text-muted font-monospace" style="font-size: 11px;">Kode: {{ $dok->kode_dokumen }}</span>
                                </td>
                                <td>
                                    @if($dok->status_ketersediaan === 'TERSEDIA')
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
                                        <a href="{{ asset('storage/' . $dok->file_path) }}" target="_blank" class="btn btn-outline-primary btn-sm py-0 px-2" style="font-size: 11px;">
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

    <!-- <div class="mt-4 p-3 bg-light rounded-3 border">
        <div class="d-flex align-items-center gap-2 mb-1">
            <i class="bi bi-shield-check text-success fs-5"></i>
            <span class="fw-bold text-dark" style="font-size: 13px;">Pernyataan Keabsahan Permohonan</span>
        </div>
        <p class="text-muted mb-0" style="font-size: 12px;">
            Pemohon telah menyetujui seluruh syarat dan ketentuan verifikasi emisi GRK serta menjamin seluruh data operasional, batasan emisi, dan bukti kalibrasi yang disampaikan adalah sah dan dapat dipertanggungjawabkan
            @if($form->pernyataan_at)
                pada <strong>{{ \Carbon\Carbon::parse($form->pernyataan_at)->translatedFormat('d F Y H:i:s') }}</strong>.
            @endif
        </p>
    </div> -->
</div>
