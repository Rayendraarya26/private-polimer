<style>
    .detail-halal-row {
        display: grid;
        grid-template-columns: 200px 10px 1fr;
        margin-bottom: 8px;
        font-size: 13px;
    }

    .detail-halal-label {
        color: #64748b;
        font-weight: 500;
    }

    .detail-halal-value {
        word-break: break-word;
        color: #1e293b;
    }

    .halal-section-title {
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

    .halal-stat-card {
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 10px;
        padding: 14px 18px;
    }
</style>

@php
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

<div class="space-y-4">

    {{-- ── 1. STATISTIC HIGHLIGHT CARDS ── --}}
    <div class="row g-3 mb-4">
        <div class="col-md-3">
            <div class="halal-stat-card border-start border-4 border-success">
                <span class="text-uppercase text-muted" style="font-size: 10px; letter-spacing: 0.5px;">Jalur Sertifikasi</span>
                <h6 class="fw-bold {{ $isReguler ? 'text-primary' : 'text-success' }} mb-0 mt-1" style="font-size: 13px;">
                    {{ $isReguler ? 'Reguler (Audit LPH)' : 'Self Declare (SEHATI UMK)' }}
                </h6>
                <small class="text-muted">Jenis: {{ ucfirst($form->jenis_pendaftaran ?? 'Baru') }}</small>
            </div>
        </div>

        <div class="col-md-3">
            <div class="halal-stat-card border-start border-4 border-primary">
                <span class="text-uppercase text-muted" style="font-size: 10px; letter-spacing: 0.5px;">Pelaku Usaha</span>
                <h6 class="fw-bold text-dark mb-0 mt-1 text-truncate" style="font-size: 13px;" title="{{ $form->nama_usaha }}">
                    {{ $form->nama_usaha ?? '-' }}
                </h6>
                <small class="text-muted">Skala: {{ ucfirst($form->skala_usaha ?? 'Mikro') }}</small>
            </div>
        </div>

        <div class="col-md-3">
            <div class="halal-stat-card border-start border-4 border-info">
                <span class="text-uppercase text-muted" style="font-size: 10px; letter-spacing: 0.5px;">Bahan & Produk</span>
                <h4 class="fw-bold text-info mb-0 mt-1">
                    {{ count($bahanList) }} <small class="fs-6 text-muted fw-normal">Bahan</small> •
                    {{ count($produkList) }} <small class="fs-6 text-muted fw-normal">Produk</small>
                </h4>
            </div>
        </div>

        <div class="col-md-3">
            <div class="halal-stat-card border-start border-4 border-warning">
                <span class="text-uppercase text-muted" style="font-size: 10px; letter-spacing: 0.5px;">Penyelia Halal</span>
                <h6 class="fw-bold text-dark mb-0 mt-1 text-truncate" style="font-size: 13px;" title="{{ $form->penyelia_nama }}">
                    {{ $form->penyelia_nama ?? '-' }}
                </h6>
                <small class="text-muted">SK: {{ $form->penyelia_no_sk ?? '-' }}</small>
            </div>
        </div>
    </div>

    {{-- ── 2. PROFIL USAHA & PENYELIA ── --}}
    <div class="row g-4 mb-4">
        {{-- Kiri: Profil Pelaku Usaha & PJ --}}
        <div class="col-md-6">
            <div class="halal-section-title text-success">
                <i class="fas fa-building"></i> Data Pelaku Usaha & Penanggung Jawab
            </div>

            <div class="detail-halal-row">
                <div class="detail-halal-label">Nama Pelaku Usaha</div>
                <div>:</div>
                <div class="detail-halal-value fw-semibold text-dark">{{ $form->nama_usaha ?? '-' }}</div>
            </div>

            <div class="detail-halal-row">
                <div class="detail-halal-label">Jalur Pendaftaran</div>
                <div>:</div>
                <div class="detail-halal-value">
                    <span class="badge {{ $isReguler ? 'bg-primary' : 'bg-success' }}">
                        {{ $isReguler ? 'Jalur Reguler (LPH BBSPJIKKP)' : 'Jalur Self Declare (SEHATI UMK)' }}
                    </span>
                </div>
            </div>

            <div class="detail-halal-row">
                <div class="detail-halal-label">Nomor Induk Berusaha (NIB)</div>
                <div>:</div>
                <div class="detail-halal-value font-monospace">{{ $form->nib ?? '-' }}</div>
            </div>

            <div class="detail-halal-row">
                <div class="detail-halal-label">NPWP Perusahaan</div>
                <div>:</div>
                <div class="detail-halal-value font-monospace">{{ $form->npwp ?? '-' }}</div>
            </div>

            <div class="detail-halal-row">
                <div class="detail-halal-label">Skala Usaha</div>
                <div>:</div>
                <div class="detail-halal-value text-capitalize">{{ $form->skala_usaha ?? 'Mikro' }}</div>
            </div>

            @if($form->kode_fasilitasi)
            <div class="detail-halal-row">
                <div class="detail-halal-label">Kode Fasilitasi</div>
                <div>:</div>
                <div class="detail-halal-value font-monospace text-primary fw-bold">{{ $form->kode_fasilitasi }}</div>
            </div>
            @endif

            <hr class="my-3 text-muted">

            <div class="detail-halal-row">
                <div class="detail-halal-label">Penanggung Jawab (PJ)</div>
                <div>:</div>
                <div class="detail-halal-value fw-semibold text-dark">{{ $form->pj_nama ?? '-' }}</div>
            </div>

            <div class="detail-halal-row">
                <div class="detail-halal-label">Kontak / WhatsApp PJ</div>
                <div>:</div>
                <div class="detail-halal-value">{{ $form->pj_kontak ?? '-' }}</div>
            </div>

            <div class="detail-halal-row">
                <div class="detail-halal-label">Email PJ</div>
                <div>:</div>
                <div class="detail-halal-value">{{ $form->pj_email ?? '-' }}</div>
            </div>

            <div class="detail-halal-row">
                <div class="detail-halal-label">Alamat Usaha</div>
                <div>:</div>
                <div class="detail-halal-value">{{ $form->pj_alamat ?? '-' }}</div>
            </div>
        </div>

        {{-- Kanan: Data Penyelia Halal --}}
        <div class="col-md-6">
            <div class="halal-section-title text-success">
                <i class="fas fa-user-check"></i> Data Penyelia Halal
            </div>

            <div class="detail-halal-row">
                <div class="detail-halal-label">Nama Lengkap Penyelia</div>
                <div>:</div>
                <div class="detail-halal-value fw-semibold text-dark">{{ $form->penyelia_nama ?? '-' }}</div>
            </div>

            <div class="detail-halal-row">
                <div class="detail-halal-label">Nomor KTP / NIK</div>
                <div>:</div>
                <div class="detail-halal-value font-monospace">{{ $form->penyelia_nik ?? '-' }}</div>
            </div>

            <div class="detail-halal-row">
                <div class="detail-halal-label">Agama</div>
                <div>:</div>
                <div class="detail-halal-value">{{ $form->penyelia_agama ?? 'Islam' }}</div>
            </div>

            <div class="detail-halal-row">
                <div class="detail-halal-label">Kontak / WA Penyelia</div>
                <div>:</div>
                <div class="detail-halal-value">{{ $form->penyelia_kontak ?? '-' }}</div>
            </div>

            <div class="detail-halal-row">
                <div class="detail-halal-label">Nomor SK Penetapan</div>
                <div>:</div>
                <div class="detail-halal-value font-monospace">{{ $form->penyelia_no_sk ?? '-' }}</div>
            </div>

            <div class="detail-halal-row">
                <div class="detail-halal-label">Tanggal SK Penetapan</div>
                <div>:</div>
                <div class="detail-halal-value">
                    {{ $form->penyelia_tgl_sk ? \Carbon\Carbon::parse($form->penyelia_tgl_sk)->translatedFormat('d F Y') : '-' }}
                </div>
            </div>

            @if($form->penyelia_no_sertifikat)
            <div class="detail-halal-row">
                <div class="detail-halal-label">No. Sertifikat Pelatihan</div>
                <div>:</div>
                <div class="detail-halal-value font-monospace">{{ $form->penyelia_no_sertifikat }}</div>
            </div>
            @endif

            <hr class="my-3 text-muted">

            <div class="d-flex flex-wrap gap-2">
                @if($form->file_sk_penyelia)
                    <a href="{{ asset('storage/' . $form->file_sk_penyelia) }}" target="_blank" class="btn btn-sm btn-outline-success">
                        <i class="fas fa-file-download me-1"></i> SK Penetapan
                    </a>
                @endif
                @if($form->file_ktp_penyelia)
                    <a href="{{ asset('storage/' . $form->file_ktp_penyelia) }}" target="_blank" class="btn btn-sm btn-outline-secondary">
                        <i class="fas fa-id-card me-1"></i> KTP Penyelia
                    </a>
                @endif
                @if($form->file_sertifikat_penyelia)
                    <a href="{{ asset('storage/' . $form->file_sertifikat_penyelia) }}" target="_blank" class="btn btn-sm btn-outline-info">
                        <i class="fas fa-certificate me-1"></i> Sertifikat Pelatihan
                    </a>
                @endif
            </div>
        </div>
    </div>

    {{-- ── 3. FASILITAS PABRIK & OUTLET ── --}}
    <div class="card border-0 shadow-sm mb-4">
        <div class="card-header bg-light d-flex justify-content-between align-items-center">
            <h6 class="mb-0 fw-bold text-dark"><i class="fas fa-industry me-2 text-success"></i> Fasilitas Pabrik & Tempat Produksi</h6>
            @if($form->file_denah_lokasi)
                <a href="{{ asset('storage/' . $form->file_denah_lokasi) }}" target="_blank" class="btn btn-xs btn-outline-primary">
                    <i class="fas fa-map-marked-alt me-1"></i> Unduh Denah Lokasi
                </a>
            @endif
        </div>
        <div class="card-body p-0">
            <div class="table-responsive">
                <table class="table table-hover table-striped align-middle mb-0" style="font-size: 13px;">
                    <thead class="table-light">
                        <tr>
                            <th width="5%">No</th>
                            <th width="30%">Nama Fasilitas</th>
                            <th width="20%">Status Kepemilikan</th>
                            <th>Alamat Lokasi Produksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse($pabrikList as $idx => $p)
                        <tr>
                            <td class="text-center">{{ $idx + 1 }}</td>
                            <td class="fw-semibold text-dark">{{ $p['nama'] ?? '-' }}</td>
                            <td><span class="badge bg-light text-dark border">{{ $p['status_pabrik'] ?? 'Milik Sendiri' }}</span></td>
                            <td>{{ $p['alamat'] ?? '-' }}</td>
                        </tr>
                        @empty
                        <tr>
                            <td colspan="4" class="text-center text-muted py-3">Tidak ada data pabrik</td>
                        </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    {{-- ── 4. DAFTAR BAHAN & KEMASAN ── --}}
    <div class="card border-0 shadow-sm mb-4">
        <div class="card-header bg-light">
            <h6 class="mb-0 fw-bold text-dark"><i class="fas fa-boxes me-2 text-success"></i> Daftar Bahan, Bahan Penolong & Kemasan ({{ count($bahanList) }})</h6>
        </div>
        <div class="card-body p-0">
            <div class="table-responsive">
                <table class="table table-hover table-striped align-middle mb-0" style="font-size: 13px;">
                    <thead class="table-light">
                        <tr>
                            <th width="5%">No</th>
                            <th width="15%">Kategori</th>
                            <th width="25%">Nama Bahan</th>
                            <th width="25%">Produsen / Supplier</th>
                            <th>Status Sertifikat Halal</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse($bahanList as $idx => $b)
                        <tr>
                            <td class="text-center">{{ $idx + 1 }}</td>
                            <td><span class="badge bg-secondary">{{ $b['jenis_bahan'] ?? 'Bahan Baku' }}</span></td>
                            <td class="fw-semibold text-dark">{{ $b['nama_bahan'] ?? '-' }}</td>
                            <td>
                                <div>{{ $b['produsen'] ?? '-' }}</div>
                                @if(!empty($b['supplier']))
                                    <small class="text-muted">Pemasok: {{ $b['supplier'] }}</small>
                                @endif
                            </td>
                            <td>
                                @if(!empty($b['is_bersertifikat']))
                                    <span class="badge bg-success"><i class="fas fa-check-circle me-1"></i> Bersertifikat</span>
                                    <div class="font-monospace mt-1" style="font-size: 11px;">{{ $b['no_sertifikat'] ?? '-' }}</div>
                                    <small class="text-muted">{{ $b['lembaga_penerbit'] ?? 'BPJPH' }} @if(!empty($b['tgl_berlaku']))(s/d {{ $b['tgl_berlaku'] }})@endif</small>
                                @else
                                    <span class="badge bg-light text-dark border">Bahan Alami (KMA 1360)</span>
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

    {{-- ── 5. DAFTAR PRODUK ── --}}
    <div class="card border-0 shadow-sm mb-4">
        <div class="card-header bg-light">
            <h6 class="mb-0 fw-bold text-dark"><i class="fas fa-cubes me-2 text-success"></i> Daftar Produk yang Disertifikasi ({{ count($produkList) }})</h6>
        </div>
        <div class="card-body p-0">
            <div class="table-responsive">
                <table class="table table-hover table-striped align-middle mb-0" style="font-size: 13px;">
                    <thead class="table-light">
                        <tr>
                            <th width="5%">No</th>
                            <th width="15%">Klasifikasi</th>
                            <th width="20%">Merk Dagang</th>
                            <th width="30%">Nama Lengkap Produk & Varian</th>
                            <th>Rincian Komposisi</th>
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

    {{-- ── 6. ALUR PROSES & DOKUMEN PERSYARATAN ── --}}
    <div class="row g-4 mb-4">
        <div class="col-md-6">
            <div class="halal-section-title text-success">
                <i class="fas fa-stream"></i> Alur Proses Produksi Halal (PPH)
            </div>
            <div class="p-3 bg-light rounded border text-muted" style="font-size: 13px; white-space: pre-line; line-height: 1.6;">
                {{ $form->alur_proses ?? 'Belum ada uraian alur proses produksi.' }}
            </div>
            @if($form->file_alur_proses)
                <div class="mt-2">
                    <a href="{{ asset('storage/' . $form->file_alur_proses) }}" target="_blank" class="btn btn-sm btn-outline-secondary">
                        <i class="fas fa-download me-1"></i> Unduh Bagan Alur PPH
                    </a>
                </div>
            @endif
        </div>

        <div class="col-md-6">
            <div class="halal-section-title text-success">
                <i class="fas fa-file-contract"></i> Dokumen Persyaratan & Ikrar
            </div>
            <div class="list-group">
                <div class="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                        <div class="fw-semibold text-dark">Surat Permohonan Resmi</div>
                        <small class="text-muted">Surat bertandatangan pimpinan / bermaterai</small>
                    </div>
                    @if($form->file_surat_permohonan)
                        <a href="{{ asset('storage/' . $form->file_surat_permohonan) }}" target="_blank" class="btn btn-sm btn-primary">
                            <i class="fas fa-download me-1"></i> Unduh
                        </a>
                    @else
                        <span class="badge bg-light text-muted border">Tidak Dilampirkan</span>
                    @endif
                </div>

                <div class="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                        <div class="fw-semibold text-dark">Manual SJPH</div>
                        <small class="text-muted">Manual Sistem Jaminan Produk Halal perusahaan</small>
                    </div>
                    @if($form->file_manual_sjph)
                        <a href="{{ asset('storage/' . $form->file_manual_sjph) }}" target="_blank" class="btn btn-sm btn-primary">
                            <i class="fas fa-download me-1"></i> Unduh
                        </a>
                    @else
                        <span class="badge bg-light text-muted border">Tidak Dilampirkan</span>
                    @endif
                </div>

                <div class="list-group-item bg-light">
                    <div class="d-flex align-items-center gap-2 text-success fw-bold">
                        <i class="fas fa-check-circle"></i> Ikrar Bebas Babi & Komitmen SJPH
                    </div>
                    <small class="text-muted d-block mt-1">
                        Pelaku usaha telah menyetujui pernyataan bebas najis/bahan haram serta berkomitmen menjalankan ketentuan Sistem Jaminan Produk Halal.
                    </small>
                </div>
            </div>
        </div>
    </div>

</div>
