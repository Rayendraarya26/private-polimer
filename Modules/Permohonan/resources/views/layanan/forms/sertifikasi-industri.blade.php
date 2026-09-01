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

.table-custom th {
    background-color: #f8fafc;
    font-size: 12px;
    font-weight: 600;
    color: #475569;
    text-transform: uppercase;
    letter-spacing: 0.03em;
    border-bottom: 1px solid #e2e8f0;
}

.table-custom td {
    font-size: 13px;
    vertical-align: middle;
}
</style>

@php
    $getFileUrl = function($path) {
        if (empty($path)) return null;
        if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://') || str_starts_with($path, '/storage/')) {
            return $path;
        }
        return Storage::url($path);
    };

    $komoditasList = $form->komoditas_json ?? [];
    if (is_string($komoditasList)) {
        $komoditasList = json_decode($komoditasList, true) ?? [];
    }

    $pabrikList = $form->pabrik_json ?? [];
    if (is_string($pabrikList)) {
        $pabrikList = json_decode($pabrikList, true) ?? [];
    }

    $dokumenPendukung = $form->file_dokumen_pendukung_json ?? $form->file_dokumen_pendukung ?? [];
    if (is_string($dokumenPendukung)) {
        $dokumenPendukung = json_decode($dokumenPendukung, true) ?? [];
    }
@endphp

<div class="row g-4">

    <!-- ================= KIRI: INFORMASI PENGAJUAN & AREA ================= -->
    <div class="col-md-6">
        <h6 class="text-primary border-bottom pb-2 mb-3">Informasi Pengajuan Sertifikasi</h6>

        <div class="detail-row">
            <div class="detail-label">Skema / Lingkup Layanan</div>
            <div>:</div>
            <div class="detail-value fw-semibold text-dark">
                {{ $detail->lingkupLayanan->lingkup ?? '-' }}
                @if(!empty($detail->lingkupLayanan->kode_layanan))
                    <span class="badge bg-light text-secondary ms-1">{{ $detail->lingkupLayanan->kode_layanan }}</span>
                @endif
            </div>
        </div>

        <div class="detail-row">
            <div class="detail-label">Jenis Pengajuan</div>
            <div>:</div>
            <div class="detail-value fw-semibold">
                @php
                    $jp = strtolower($form->jenis_pengajuan ?? 'baru');
                    $jpBadge = match($jp) {
                        'baru' => 'bg-primary',
                        'perpanjangan' => 'bg-success',
                        'perluasan' => 'bg-warning text-dark',
                        default => 'bg-secondary'
                    };
                @endphp
                <span class="badge {{ $jpBadge }}">{{ ucfirst($jp) }}</span>
            </div>
        </div>

        @if(!empty($form->sertifikat_lama_nomor) || in_array(strtolower($form->jenis_pengajuan ?? ''), ['perpanjangan', 'perluasan']))
        <div class="detail-row">
            <div class="detail-label">No. Sertifikat Sebelumnya</div>
            <div>:</div>
            <div class="detail-value fw-semibold">{{ $form->sertifikat_lama_nomor ?? '-' }}</div>
        </div>
        @endif

        <div class="detail-row">
            <div class="detail-label">Luas Tanah Pabrik</div>
            <div>:</div>
            <div class="detail-value fw-semibold">
                {{ $form->luas_tanah ? number_format($form->luas_tanah, 0, ',', '.') . ' m²' : '-' }}
            </div>
        </div>

        <div class="detail-row">
            <div class="detail-label">Luas Bangunan Pabrik</div>
            <div>:</div>
            <div class="detail-value fw-semibold">
                {{ $form->luas_bangunan ? number_format($form->luas_bangunan, 0, ',', '.') . ' m²' : '-' }}
            </div>
        </div>

        <div class="detail-row">
            <div class="detail-label">Pernyataan Kebenaran Data</div>
            <div>:</div>
            <div class="detail-value">
                @if($form->setuju_pernyataan)
                    <span class="badge bg-light-success text-success"><i class="fa fa-check-circle me-1"></i> Disetujui</span>
                @else
                    <span class="badge bg-light-danger text-danger"><i class="fa fa-times-circle me-1"></i> Belum Disetujui</span>
                @endif
            </div>
        </div>
    </div>

    <!-- ================= KANAN: DATA KETENAGAKERJAAN ================= -->
    <div class="col-md-6">
        <h6 class="text-primary border-bottom pb-2 mb-3">Data Ketenagakerjaan</h6>

        <div class="detail-row">
            <div class="detail-label">Total Tenaga Kerja</div>
            <div>:</div>
            <div class="detail-value fw-bold text-primary">{{ $form->jumlah_karyawan_total ?? 0 }} Orang</div>
        </div>

        <div class="detail-row">
            <div class="detail-label">Tenaga Manajemen</div>
            <div>:</div>
            <div class="detail-value fw-semibold">{{ $form->jumlah_manajemen ?? 0 }} Orang</div>
        </div>

        <div class="detail-row">
            <div class="detail-label">Tenaga Administrasi</div>
            <div>:</div>
            <div class="detail-value fw-semibold">{{ $form->jumlah_administrasi ?? 0 }} Orang</div>
        </div>

        <div class="detail-row">
            <div class="detail-label">Tenaga Operasional / Pabrik</div>
            <div>:</div>
            <div class="detail-value fw-semibold">{{ $form->jumlah_operasional ?? 0 }} Orang</div>
        </div>

        <div class="detail-row">
            <div class="detail-label">Tenaga Kerja Lepas / Part-time</div>
            <div>:</div>
            <div class="detail-value fw-semibold">{{ $form->jumlah_part_time ?? 0 }} Orang</div>
        </div>

        <div class="detail-row">
            <div class="detail-label">Tenaga Non-Permanen</div>
            <div>:</div>
            <div class="detail-value fw-semibold">{{ $form->jumlah_non_permanen ?? 0 }} Orang</div>
        </div>

        <div class="detail-row">
            <div class="detail-label">Pembagian Shift Kerja</div>
            <div>:</div>
            <div class="detail-value">
                <span class="badge bg-light text-dark border me-1">Shift 1: {{ $form->jumlah_shift_1 ?? 0 }} org</span>
                <span class="badge bg-light text-dark border me-1">Shift 2: {{ $form->jumlah_shift_2 ?? 0 }} org</span>
                <span class="badge bg-light text-dark border">Shift 3: {{ $form->jumlah_shift_3 ?? 0 }} org</span>
            </div>
        </div>
    </div>

</div>

<!-- ================= DAFTAR KOMODITAS / PRODUK ================= -->
<div class="mt-4">
    <h6 class="text-primary border-bottom pb-2 mb-3">Daftar Komoditas / Produk yang Diajukan</h6>

    @if(!empty($komoditasList) && count($komoditasList) > 0)
        <div class="table-responsive border rounded-3 overflow-hidden">
            <table class="table table-hover table-custom mb-0">
                <thead>
                    <tr>
                        <th style="width: 50px;" class="text-center">No</th>
                        <th>Komoditi / Produk</th>
                        <th>Standar SNI</th>
                        <th>Merek</th>
                        <th>Tipe / Ukuran</th>
                        <th>Kapasitas Produksi</th>
                        <th>Keterangan</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($komoditasList as $kIdx => $komoditas)
                        @php
                            $namaKomoditi = $komoditas['nama'] ?? $komoditas['komoditi'] ?? '-';
                            $sni          = $komoditas['sni'] ?? $komoditas['noSni'] ?? $komoditas['no_sni'] ?? '-';
                            $merek        = $komoditas['merek'] ?? $komoditas['merk'] ?? '-';
                            $tipe         = $komoditas['tipe'] ?? '-';
                            $ukuran       = $komoditas['ukuran'] ?? '-';
                            $jmlProduksi  = $komoditas['jumlahProduksi'] ?? $komoditas['jumlah_produksi'] ?? '';
                            $satProduksi  = $komoditas['satuanProduksi'] ?? $komoditas['satuan_produksi'] ?? '';
                            $kapasitas    = trim($jmlProduksi . ' ' . $satProduksi);
                            $ket          = $komoditas['keterangan'] ?? '-';
                        @endphp
                        <tr>
                            <td class="text-center fw-semibold text-muted">{{ $kIdx + 1 }}</td>
                            <td class="fw-semibold text-dark">{{ $namaKomoditi }}</td>
                            <td><span class="badge bg-light-primary text-primary fw-semibold">{{ $sni }}</span></td>
                            <td>{{ $merek }}</td>
                            <td>
                                @if($tipe !== '-' || $ukuran !== '-')
                                    {{ $tipe !== '-' ? 'Tipe: ' . $tipe : '' }}
                                    {{ $tipe !== '-' && $ukuran !== '-' ? ' | ' : '' }}
                                    {{ $ukuran !== '-' ? 'Ukuran: ' . $ukuran : '' }}
                                @else
                                    -
                                @endif
                            </td>
                            <td>{{ !empty($kapasitas) ? $kapasitas : '-' }}</td>
                            <td class="text-muted">{{ $ket }}</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    @else
        <div class="alert alert-light border text-muted mb-0">
            <i class="fa fa-info-circle me-1"></i> Tidak ada rincian komoditas khusus yang tersimpan.
        </div>
    @endif
</div>

<!-- ================= DATA LOKASI PABRIK ================= -->
@if(!empty($pabrikList) && count($pabrikList) > 0)
<div class="mt-4">
    <h6 class="text-primary border-bottom pb-2 mb-3">Data & Lokasi Pabrik ({{ count($pabrikList) }} Lokasi)</h6>

    <div class="row g-3">
        @foreach($pabrikList as $pIdx => $pabrik)
            @php
                $namaPabrik   = $pabrik['namaPabrik'] ?? $pabrik['nama'] ?? ('Pabrik ' . ($pIdx + 1));
                $alamatPabrik = $pabrik['alamatPabrik'] ?? $pabrik['alamat'] ?? '-';
                $noTelp       = $pabrik['noTelp'] ?? $pabrik['telp'] ?? '-';
                $noHp         = $pabrik['noHp'] ?? $pabrik['hp'] ?? '-';
                $fax          = $pabrik['fax'] ?? '-';
                $negara       = $pabrik['negara'] ?? 'Indonesia';
                $kodePos      = $pabrik['kodePos'] ?? '-';
                $kegiatan     = $pabrik['kegiatanUtama'] ?? '-';
                $jmlKaryawan  = $pabrik['jumlahKaryawan'] ?? '-';
                $luasT        = $pabrik['luasTanah'] ?? '-';
                $luasB        = $pabrik['luasBangunan'] ?? '-';
            @endphp
            <div class="col-md-6">
                <div class="card h-100 border shadow-none bg-light p-3 rounded-3">
                    <div class="fw-bold text-dark mb-2 pb-2 border-bottom d-flex justify-content-between align-items-center">
                        <span><i class="fa fa-industry me-1 text-primary"></i> {{ $namaPabrik }}</span>
                        <span class="badge bg-secondary" style="font-size: 10px;">Lokasi #{{ $pIdx + 1 }}</span>
                    </div>
                    <div class="small">
                        <div class="mb-1"><span class="text-muted">Alamat:</span> <span class="fw-semibold">{{ $alamatPabrik }}</span> (Kode Pos: {{ $kodePos }}, {{ $negara }})</div>
                        <div class="mb-1"><span class="text-muted">Kontak:</span> Telp: {{ $noTelp }} | HP: {{ $noHp }} {{ $fax !== '-' ? '| Fax: ' . $fax : '' }}</div>
                        <div class="mb-1"><span class="text-muted">Kegiatan Utama:</span> {{ $kegiatan }}</div>
                        <div class="mb-1"><span class="text-muted">Jumlah Tenaga Kerja:</span> {{ $jmlKaryawan }} orang</div>
                        <div><span class="text-muted">Luas (Tanah / Bangunan):</span> {{ $luasT }} m² / {{ $luasB }} m²</div>
                    </div>
                </div>
            </div>
        @endforeach
    </div>
</div>
@endif

<!-- ================= FILE & DOKUMEN PERSYARATAN ================= -->
<div class="mt-4">
    <h6 class="text-primary border-bottom pb-2 mb-3">Dokumen Teknis & Pendukung</h6>

    @php
        $dokumenTeknis = [
            'file_surat_permohonan'    => 'Surat Permohonan Sertifikasi',
            'file_pertanyaan_tambahan' => 'Kuesioner / Pertanyaan Tambahan',
            'file_manual_mutu'         => 'Manual Sistem Manajemen Mutu',
            'file_proses_produksi'     => 'Diagram Alir Proses Produksi',
            'file_daftar_peralatan'    => 'Daftar Peralatan Pabrik / Lab',
            'file_denah_lokasi'        => 'Denah / Layout Lokasi Pabrik',
        ];

        $dokumenLegalitasLabels = [
            'dok_akta_pendirian' => 'Akta Pendirian Perusahaan',
            'dok_nib'            => 'Nomor Induk Berusaha (NIB)',
            'dok_npwp'           => 'NPWP Perusahaan',
        ];
    @endphp

    <div class="row g-2">
        @foreach($dokumenTeknis as $field => $label)
            @php $filePath = $form->$field ?? null; @endphp
            <div class="col-md-6">
                <div class="detail-row mb-2">
                    <div class="detail-label">{{ $label }}</div>
                    <div>:</div>
                    <div class="detail-value">
                        @if(!empty($filePath))
                            <button type="button"
                                class="btn btn-sm btn-primary preview-btn py-1 px-3"
                                data-file="{{ $getFileUrl($filePath) }}">
                                Lihat file <i class="fa fa-eye ms-1"></i>
                            </button>
                        @else
                            <span class="text-muted">-</span>
                        @endif
                    </div>
                </div>
            </div>
        @endforeach

        @if(!empty($dokumenPendukung))
            @foreach($dokumenPendukung as $key => $val)
                @php
                    $label = $dokumenLegalitasLabels[$key] ?? (is_string($key) ? ucwords(str_replace(['_', '-'], ' ', $key)) : 'Dokumen Pendukung ' . ($loop->iteration));
                    $docPath = is_array($val) ? ($val['path'] ?? $val['fileUrl'] ?? null) : $val;
                @endphp
                @if(!empty($docPath))
                    <div class="col-md-6">
                        <div class="detail-row mb-2">
                            <div class="detail-label">{{ $label }}</div>
                            <div>:</div>
                            <div class="detail-value">
                                <button type="button"
                                    class="btn btn-sm btn-outline-primary preview-btn py-1 px-3"
                                    data-file="{{ $getFileUrl($docPath) }}">
                                    Lihat file <i class="fa fa-eye ms-1"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                @endif
            @endforeach
        @endif
    </div>
</div>

