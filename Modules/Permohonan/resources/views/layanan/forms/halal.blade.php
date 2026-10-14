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
    $getFileUrl = function ($path) {
        if (empty($path)) {
            return null;
        }
        if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://') || str_starts_with($path, '/storage/')) {
            return $path;
        }
        return asset('storage/' . $path);
    };

    $isReguler = ($form->jalur_pendaftaran ?? 'reguler') === 'reguler';

    $pabrikList = is_array($form->pabrik_json)
        ? $form->pabrik_json
        : (is_string($form->pabrik_json) ? json_decode($form->pabrik_json, true) ?? [] : []);

    $outletList = is_array($form->outlet_json)
        ? $form->outlet_json
        : (is_string($form->outlet_json) ? json_decode($form->outlet_json, true) ?? [] : []);

    $bahanList = is_array($form->bahan_json)
        ? $form->bahan_json
        : (is_string($form->bahan_json) ? json_decode($form->bahan_json, true) ?? [] : []);

    $produkList = is_array($form->produk_json)
        ? $form->produk_json
        : (is_string($form->produk_json) ? json_decode($form->produk_json, true) ?? [] : []);
@endphp

<!-- ================= BARIS 1: INFORMASI USAHA & PENANGGUNG JAWAB ================= -->
<div class="row g-4 mb-4">
    <!-- Kiri: Informasi Pelaku Usaha & Pengajuan -->
    <div class="col-md-6">
        <h6 class="text-primary border-bottom pb-2 mb-3">Informasi Pelaku Usaha & Pengajuan</h6>

        <div class="detail-row">
            <div class="detail-label">Jalur Pendaftaran</div>
            <div>:</div>
            <div class="detail-value">
                <span
                    class="badge {{ $isReguler ? 'bg-light-primary text-primary border' : 'bg-light-success text-success border' }}">
                    {{ $isReguler ? 'Reguler (LPH BBSPJIKKP)' : 'Self Declare (SEHATI UMK)' }}
                </span>
            </div>
        </div>

        <div class="detail-row">
            <div class="detail-label">Jenis Pendaftaran</div>
            <div>:</div>
            <div class="detail-value text-capitalize fw-semibold">{{ $form->jenis_pendaftaran ?? 'Baru' }}</div>
        </div>

        <div class="detail-row">
            <div class="detail-label">Nama Pelaku Usaha</div>
            <div>:</div>
            <div class="detail-value fw-bold text-dark">{{ $form->nama_usaha ?? '-' }}</div>
        </div>

        <div class="detail-row">
            <div class="detail-label">NIB</div>
            <div>:</div>
            <div class="detail-value font-monospace">{{ $form->nib ?? '-' }}</div>
        </div>

        <div class="detail-row">
            <div class="detail-label">NPWP Perusahaan</div>
            <div>:</div>
            <div class="detail-value font-monospace">{{ $form->npwp ?? '-' }}</div>
        </div>

        <div class="detail-row">
            <div class="detail-label">Skala Usaha</div>
            <div>:</div>
            <div class="detail-value text-capitalize">{{ $form->skala_usaha ?? 'Mikro' }}</div>
        </div>

        @if(!empty($form->kode_fasilitasi))
            <div class="detail-row">
                <div class="detail-label">Kode Fasilitasi</div>
                <div>:</div>
                <div class="detail-value font-monospace text-primary fw-bold">{{ $form->kode_fasilitasi }}</div>
            </div>
        @endif
    </div>

    <!-- Kanan: Penanggung Jawab (PJ) -->
    <div class="col-md-6">
        <h6 class="text-primary border-bottom pb-2 mb-3">Penanggung Jawab Usaha</h6>

        <div class="detail-row">
            <div class="detail-label">Nama Penanggung Jawab</div>
            <div>:</div>
            <div class="detail-value fw-bold text-dark">{{ $form->pj_nama ?? '-' }}</div>
        </div>

        <div class="detail-row">
            <div class="detail-label">No. Kontak / WhatsApp</div>
            <div>:</div>
            <div class="detail-value fw-semibold text-dark">{{ $form->pj_kontak ?? '-' }}</div>
        </div>

        <div class="detail-row">
            <div class="detail-label">Email PJ</div>
            <div>:</div>
            <div class="detail-value">{{ $form->pj_email ?? '-' }}</div>
        </div>

        <div class="detail-row">
            <div class="detail-label">Alamat Usaha</div>
            <div>:</div>
            <div class="detail-value">{{ $form->pj_alamat ?? '-' }}</div>
        </div>
    </div>
</div>

<!-- ================= BARIS 2: PENYELIA HALAL & BERKAS PENDUKUNG ================= -->
<div class="row g-4 mb-4">
    <!-- Kiri: Data Penyelia Halal -->
    <div class="col-md-6">
        <h6 class="text-primary border-bottom pb-2 mb-3">Data Penyelia Halal</h6>

        <div class="detail-row">
            <div class="detail-label">Nama Penyelia</div>
            <div>:</div>
            <div class="detail-value fw-bold text-dark">{{ $form->penyelia_nama ?? '-' }}</div>
        </div>

        <div class="detail-row">
            <div class="detail-label">NIK / No. KTP</div>
            <div>:</div>
            <div class="detail-value font-monospace">{{ $form->penyelia_nik ?? '-' }}</div>
        </div>

        <div class="detail-row">
            <div class="detail-label">Agama</div>
            <div>:</div>
            <div class="detail-value">{{ $form->penyelia_agama ?? 'Islam' }}</div>
        </div>

        <div class="detail-row">
            <div class="detail-label">Kontak / WA Penyelia</div>
            <div>:</div>
            <div class="detail-value">{{ $form->penyelia_kontak ?? '-' }}</div>
        </div>

        <div class="detail-row">
            <div class="detail-label">Nomor SK Penetapan</div>
            <div>:</div>
            <div class="detail-value font-monospace">{{ $form->penyelia_no_sk ?? '-' }}</div>
        </div>

        <div class="detail-row">
            <div class="detail-label">Tanggal SK Penetapan</div>
            <div>:</div>
            <div class="detail-value">
                {{ $form->penyelia_tgl_sk ? \Carbon\Carbon::parse($form->penyelia_tgl_sk)->translatedFormat('d F Y') : '-' }}
            </div>
        </div>

        @if(!empty($form->penyelia_no_sertifikat))
            <div class="detail-row">
                <div class="detail-label">No. Sertifikat Pelatihan</div>
                <div>:</div>
                <div class="detail-value font-monospace">{{ $form->penyelia_no_sertifikat }}</div>
            </div>
        @endif

        @if(!empty($form->penyelia_tgl_sertifikat))
            <div class="detail-row">
                <div class="detail-label">Tgl. Sertifikat Pelatihan</div>
                <div>:</div>
                <div class="detail-value">
                    {{ \Carbon\Carbon::parse($form->penyelia_tgl_sertifikat)->translatedFormat('d F Y') }}
                </div>
            </div>
        @endif
    </div>

    <!-- Kanan: Berkas Dokumen Penyelia Halal -->
    <div class="col-md-6">
        <h6 class="text-primary border-bottom pb-2 mb-3">Dokumen Berkas Penyelia</h6>

        <div class="detail-row">
            <div class="detail-label">SK Penetapan Penyelia</div>
            <div>:</div>
            <div class="detail-value">
                @if(!empty($form->file_sk_penyelia))
                    <div class="d-flex align-items-center gap-2">
                        <button type="button" class="btn btn-sm btn-primary preview-btn py-1 px-3"
                            data-file="{{ $getFileUrl($form->file_sk_penyelia) }}"
                            data-name="SK_Penyelia_Halal_{{ $form->penyelia_nama ?: 'Penyelia' }}">
                            Lihat file <i class="fa fa-eye ms-1"></i>
                        </button>
                        <a href="{{ $getFileUrl($form->file_sk_penyelia) }}" download="SK_Penyelia_Halal"
                            class="btn btn-sm btn-outline-secondary py-1 px-3">
                            Unduh <i class="fa fa-download ms-1"></i>
                        </a>
                    </div>
                @else
                    <span class="text-muted">-</span>
                @endif
            </div>
        </div>

        <div class="detail-row">
            <div class="detail-label">KTP Penyelia Halal</div>
            <div>:</div>
            <div class="detail-value">
                @if(!empty($form->file_ktp_penyelia))
                    <div class="d-flex align-items-center gap-2">
                        <button type="button" class="btn btn-sm btn-primary preview-btn py-1 px-3"
                            data-file="{{ $getFileUrl($form->file_ktp_penyelia) }}"
                            data-name="KTP_Penyelia_{{ $form->penyelia_nama ?: 'Penyelia' }}">
                            Lihat file <i class="fa fa-eye ms-1"></i>
                        </button>
                        <a href="{{ $getFileUrl($form->file_ktp_penyelia) }}" download="KTP_Penyelia"
                            class="btn btn-sm btn-outline-secondary py-1 px-3">
                            Unduh <i class="fa fa-download ms-1"></i>
                        </a>
                    </div>
                @else
                    <span class="text-muted">-</span>
                @endif
            </div>
        </div>

        <div class="detail-row">
            <div class="detail-label">Sertifikat Pelatihan</div>
            <div>:</div>
            <div class="detail-value">
                @if(!empty($form->file_sertifikat_penyelia))
                    <div class="d-flex align-items-center gap-2">
                        <button type="button" class="btn btn-sm btn-primary preview-btn py-1 px-3"
                            data-file="{{ $getFileUrl($form->file_sertifikat_penyelia) }}"
                            data-name="Sertifikat_Penyelia_Halal_{{ $form->penyelia_nama ?: 'Penyelia' }}">
                            Lihat file <i class="fa fa-eye ms-1"></i>
                        </button>
                        <a href="{{ $getFileUrl($form->file_sertifikat_penyelia) }}" download="Sertifikat_Penyelia_Halal"
                            class="btn btn-sm btn-outline-secondary py-1 px-3">
                            Unduh <i class="fa fa-download ms-1"></i>
                        </a>
                    </div>
                @else
                    <span class="text-muted">-</span>
                @endif
            </div>
        </div>
    </div>
</div>

<!-- ================= BARIS 3: FASILITAS PRODUKSI & OUTLET ================= -->
<div class="row g-4 mb-4">
    <div class="col-12">
        <div class="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
            <h6 class="text-primary mb-0">Fasilitas Produksi & Denah Lokasi</h6>
            @if(!empty($form->file_denah_lokasi))
                <div class="d-flex align-items-center gap-2">
                    <button type="button" class="btn btn-sm btn-primary preview-btn py-1 px-3"
                        data-file="{{ $getFileUrl($form->file_denah_lokasi) }}"
                        data-name="Denah_Lokasi_Pabrik_{{ $form->nama_usaha ?: 'Usaha' }}">
                        Lihat Denah <i class="fa fa-eye ms-1"></i>
                    </button>
                    <a href="{{ $getFileUrl($form->file_denah_lokasi) }}" download="Denah_Lokasi_Pabrik"
                        class="btn btn-sm btn-outline-secondary py-1 px-3">
                        Unduh <i class="fa fa-download ms-1"></i>
                    </a>
                </div>
            @endif
        </div>

        <div class="table-responsive mb-3">
            <table class="table table-bordered table-hover align-middle">
                <thead class="table-light">
                    <tr>
                        <th width="5%" class="text-center">No</th>
                        <th width="35%">Nama Fasilitas Pabrik</th>
                        <th width="20%">Status Kepemilikan</th>
                        <th>Alamat Lokasi Produksi</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse($pabrikList as $idx => $p)
                        <tr>
                            <td class="text-center">{{ $idx + 1 }}</td>
                            <td class="fw-semibold text-dark">{{ $p['nama'] ?? '-' }}</td>
                            <td>
                                <span class="badge bg-light-primary text-primary border">
                                    {{ $p['status_pabrik'] ?? 'Milik Sendiri' }}
                                </span>
                            </td>
                            <td>{{ $p['alamat'] ?? '-' }}</td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="4" class="text-center text-muted py-3">Tidak ada data fasilitas pabrik</td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>

        @if(!empty($outletList) && count($outletList) > 0)
            <h6 class="text-primary border-bottom pb-2 mb-3 mt-4">Daftar Outlet / Tempat Penjualan</h6>
            <div class="table-responsive">
                <table class="table table-bordered table-hover align-middle">
                    <thead class="table-light">
                        <tr>
                            <th width="5%" class="text-center">No</th>
                            <th width="35%">Nama Outlet</th>
                            <th>Alamat Outlet</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach($outletList as $idx => $out)
                            <tr>
                                <td class="text-center">{{ $idx + 1 }}</td>
                                <td class="fw-semibold text-dark">{{ $out['nama'] ?? '-' }}</td>
                                <td>{{ $out['alamat'] ?? '-' }}</td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        @endif
    </div>
</div>

<!-- ================= BARIS 4: DAFTAR BAHAN & KEMASAN ================= -->
<div class="row g-4 mb-4">
    <div class="col-12">
        <h6 class="text-primary border-bottom pb-2 mb-3">Daftar Bahan & Kemasan ({{ count($bahanList) }})</h6>
        <div class="table-responsive">
            <table class="table table-bordered table-hover align-middle">
                <thead class="table-light">
                    <tr>
                        <th width="5%" class="text-center">No</th>
                        <th width="15%">Kategori Bahan</th>
                        <th width="25%">Nama Bahan</th>
                        <th width="25%">Produsen / Supplier</th>
                        <th>Status Sertifikat Halal</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse($bahanList as $idx => $b)
                        <tr>
                            <td class="text-center">{{ $idx + 1 }}</td>
                            <td>
                                <span class="badge bg-light text-dark border">
                                    {{ $b['jenis_bahan'] ?? 'Bahan Baku' }}
                                </span>
                            </td>
                            <td class="fw-semibold text-dark">{{ $b['nama_bahan'] ?? '-' }}</td>
                            <td>
                                <div>{{ $b['produsen'] ?? '-' }}</div>
                                @if(!empty($b['supplier']))
                                    <small class="text-muted d-block">Pemasok: {{ $b['supplier'] }}</small>
                                @endif
                            </td>
                            <td>
                                @if(!empty($b['is_bersertifikat']))
                                    <span class="badge bg-light-success text-success border">
                                        <i class="fa fa-check-circle me-1"></i> Bersertifikat
                                    </span>
                                    <div class="font-monospace mt-1" style="font-size: 11px;">
                                        {{ $b['no_sertifikat'] ?? '-' }}
                                    </div>
                                    <small class="text-muted d-block">
                                        {{ $b['lembaga_penerbit'] ?? 'BPJPH' }}
                                        @if(!empty($b['tgl_berlaku']))
                                            (s/d {{ $b['tgl_berlaku'] }})
                                        @endif
                                    </small>
                                @else
                                    <span class="badge bg-light-secondary text-secondary border">
                                        Tidak Bersertifikat (Bahan Alami)
                                    </span>
                                @endif
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="5" class="text-center text-muted py-3">Tidak ada data bahan</td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>
</div>

<!-- ================= BARIS 5: DAFTAR PRODUK YANG DIAJUKAN ================= -->
<div class="row g-4 mb-4">
    <div class="col-12">
        <h6 class="text-primary border-bottom pb-2 mb-3">Daftar Produk yang Diajukan ({{ count($produkList) }})</h6>
        <div class="table-responsive">
            <table class="table table-bordered table-hover align-middle">
                <thead class="table-light">
                    <tr>
                        <th width="5%" class="text-center">No</th>
                        <th width="18%">Klasifikasi</th>
                        <th width="20%">Merk Dagang</th>
                        <th width="30%">Nama Produk & Varian</th>
                        <th>Rincian / Komposisi</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse($produkList as $idx => $prod)
                        <tr>
                            <td class="text-center">{{ $idx + 1 }}</td>
                            <td>{{ $prod['klasifikasi'] ?? 'Makanan' }}</td>
                            <td class="fw-bold text-dark">{{ $prod['merk'] ?? '-' }}</td>
                            <td class="fw-semibold text-primary">{{ $prod['nama_produk'] ?? '-' }}</td>
                            <td class="text-muted" style="font-size: 12px;">{{ $prod['rincian'] ?? '-' }}</td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="5" class="text-center text-muted py-3">Tidak ada data produk</td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>
</div>

<!-- ================= BARIS 6: ALUR PROSES PRODUKSI & DOKUMEN PERSYARATAN ================= -->
<div class="row g-4 mb-4">
    <!-- Kiri: Alur Proses Produksi Halal (PPH) -->
    <div class="col-md-6">
        <h6 class="text-primary border-bottom pb-2 mb-3">Alur Proses Produksi Halal (PPH)</h6>

        <div class="detail-row">
            <div class="detail-label">Bagan Alur PPH</div>
            <div>:</div>
            <div class="detail-value">
                @if(!empty($form->file_alur_proses))
                    <div class="d-flex align-items-center gap-2">
                        <button type="button" class="btn btn-sm btn-primary preview-btn py-1 px-3"
                            data-file="{{ $getFileUrl($form->file_alur_proses) }}"
                            data-name="Bagan_Alur_PPH_{{ $form->nama_usaha ?: 'Usaha' }}">
                            Lihat file <i class="fa fa-eye ms-1"></i>
                        </button>
                        <a href="{{ $getFileUrl($form->file_alur_proses) }}" download="Bagan_Alur_PPH"
                            class="btn btn-sm btn-outline-secondary py-1 px-3">
                            Unduh <i class="fa fa-download ms-1"></i>
                        </a>
                    </div>
                @else
                    <span class="text-muted">-</span>
                @endif
            </div>
        </div>

        <div class="detail-row">
            <div class="detail-label">Uraian Alur Proses</div>
            <div>:</div>
            <div class="detail-value">
                @if(!empty(trim($form->alur_proses ?? '')))
                    <div class="text-dark" style="white-space: pre-line; line-height: 1.6;">
                        {{ $form->alur_proses }}
                    </div>
                @else
                    <span class="text-muted">-</span>
                @endif
            </div>
        </div>
    </div>

    <!-- Kanan: Dokumen Persyaratan & Pernyataan Komitmen SJPH -->
    <div class="col-md-6">
        <h6 class="text-primary border-bottom pb-2 mb-3">Dokumen Persyaratan & Pernyataan</h6>

        <div class="detail-row">
            <div class="detail-label">Surat Permohonan</div>
            <div>:</div>
            <div class="detail-value">
                @if(!empty($form->file_surat_permohonan))
                    <div class="d-flex align-items-center gap-2">
                        <button type="button" class="btn btn-sm btn-primary preview-btn py-1 px-3"
                            data-file="{{ $getFileUrl($form->file_surat_permohonan) }}"
                            data-name="Surat_Permohonan_Halal_{{ $form->nama_usaha ?: 'Usaha' }}">
                            Lihat file <i class="fa fa-eye ms-1"></i>
                        </button>
                        <a href="{{ $getFileUrl($form->file_surat_permohonan) }}" download="Surat_Permohonan_Halal"
                            class="btn btn-sm btn-outline-secondary py-1 px-3">
                            Unduh <i class="fa fa-download ms-1"></i>
                        </a>
                    </div>
                @else
                    <span class="text-muted">-</span>
                @endif
            </div>
        </div>

        <div class="detail-row">
            <div class="detail-label">Manual SJPH</div>
            <div>:</div>
            <div class="detail-value">
                @if(!empty($form->file_manual_sjph))
                    <div class="d-flex align-items-center gap-2">
                        <button type="button" class="btn btn-sm btn-primary preview-btn py-1 px-3"
                            data-file="{{ $getFileUrl($form->file_manual_sjph) }}"
                            data-name="Manual_SJPH_{{ $form->nama_usaha ?: 'Usaha' }}">
                            Lihat file <i class="fa fa-eye ms-1"></i>
                        </button>
                        <a href="{{ $getFileUrl($form->file_manual_sjph) }}" download="Manual_SJPH"
                            class="btn btn-sm btn-outline-secondary py-1 px-3">
                            Unduh <i class="fa fa-download ms-1"></i>
                        </a>
                    </div>
                @else
                    <span class="text-muted">-</span>
                @endif
            </div>
        </div>

        <div class="detail-row">
            <div class="detail-label">Pernyataan Bebas Babi</div>
            <div>:</div>
            <div class="detail-value">
                @if($form->pernyataan_bebas_babi)
                    <span class="badge bg-light-success text-success border">
                        <i class="fa fa-check-circle me-1"></i> Disetujui
                    </span>
                @else
                    <span class="badge bg-light-danger text-danger border">
                        <i class="fa fa-times-circle me-1"></i> Belum Disetujui
                    </span>
                @endif
            </div>
        </div>

        <div class="detail-row">
            <div class="detail-label">Komitmen SJPH</div>
            <div>:</div>
            <div class="detail-value">
                @if($form->pernyataan_komitmen_sjph)
                    <span class="badge bg-light-success text-success border">
                        <i class="fa fa-check-circle me-1"></i> Berkomitmen
                    </span>
                @else
                    <span class="badge bg-light-danger text-danger border">
                        <i class="fa fa-times-circle me-1"></i> Belum Berkomitmen
                    </span>
                @endif
            </div>
        </div>

        @if(!empty($form->pernyataan_at))
            <div class="detail-row">
                <div class="detail-label">Waktu Pernyataan</div>
                <div>:</div>
                <div class="detail-value text-muted small">
                    {{ \Carbon\Carbon::parse($form->pernyataan_at)->translatedFormat('d F Y, H:i') }} WIB
                </div>
            </div>
        @endif
    </div>
</div>