<style>
    .detail-pba-row {
        display: grid;
        grid-template-columns: 200px 10px 1fr;
        margin-bottom: 8px;
        font-size: 13px;
    }

    .detail-pba-label {
        color: #64748b;
        font-weight: 500;
    }

    .detail-pba-value {
        word-break: break-word;
        color: #1e293b;
    }

    .pba-section-title {
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

    .pba-stat-card {
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 10px;
        padding: 12px 16px;
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

    $namaProduk = $form->produk_pesanan ?? '-';
    if (!empty($form->produk_lainnya)) {
        $namaProduk .= ' (' . $form->produk_lainnya . ')';
    }
@endphp

<div class="space-y-4">

    {{-- ── 1. STATISTIC HIGHLIGHT CARDS ── --}}
    <div class="row g-3 mb-4">
        <div class="col-md-4">
            <div class="pba-stat-card border-start border-3 border-primary">
                <span class="text-uppercase text-muted" style="font-size: 11px; letter-spacing: 0.5px;">Produk Bahan Acuan</span>
                <h5 class="fw-bold text-primary mb-0 mt-1">
                    {{ $form->produk_pesanan ?? '-' }}
                </h5>
                @if(!empty($form->produk_lainnya))
                    <small class="text-muted">{{ $form->produk_lainnya }}</small>
                @endif
            </div>
        </div>

        <div class="col-md-4">
            <div class="pba-stat-card border-start border-3 border-success">
                <span class="text-uppercase text-muted" style="font-size: 11px; letter-spacing: 0.5px;">Jumlah Pesanan</span>
                <h4 class="fw-bold text-success mb-0 mt-1">
                    {{ $form->jumlah ?? 1 }}
                    <small class="fs-6 text-muted fw-normal">{{ $form->satuan ?? 'Sampel/Unit' }}</small>
                </h4>
            </div>
        </div>

        <div class="col-md-4">
            <div class="pba-stat-card border-start border-3 border-info">
                <span class="text-uppercase text-muted" style="font-size: 11px; letter-spacing: 0.5px;">Standar Layanan</span>
                <h5 class="fw-bold text-dark mb-0 mt-1">
                    <span class="badge bg-info text-dark">
                        PBA BBKKP (ISO 17034)
                    </span>
                </h5>
            </div>
        </div>
    </div>

    {{-- ── 2. DATA PERUSAHAAN & ALAMAT PENGIRIMAN ── --}}
    <div class="row g-4 mb-4">
        {{-- Kiri: Identitas Perusahaan & Alamat Legal --}}
        <div class="col-md-6">
            <div class="pba-section-title text-primary">
                <i class="bi bi-building"></i> Identitas Perusahaan Pemohon
            </div>

            <div class="detail-pba-row">
                <div class="detail-pba-label">Nama Perusahaan</div>
                <div>:</div>
                <div class="detail-pba-value fw-semibold text-primary">{{ $form->nama_perusahaan ?? '-' }}</div>
            </div>

            <div class="detail-pba-row">
                <div class="detail-pba-label">Alamat Perusahaan (Kantor)</div>
                <div>:</div>
                <div class="detail-pba-value">{{ $form->alamat_perusahaan ?? '-' }}</div>
            </div>

            <div class="detail-pba-row">
                <div class="detail-pba-label">Contact Person (PIC)</div>
                <div>:</div>
                <div class="detail-pba-value fw-semibold">{{ $form->contact_person ?? '-' }}</div>
            </div>

            <div class="detail-pba-row">
                <div class="detail-pba-label">No. Telepon / WhatsApp</div>
                <div>:</div>
                <div class="detail-pba-value">{{ $form->no_kontak ?? '-' }}</div>
            </div>

            <div class="detail-pba-row">
                <div class="detail-pba-label">Email Pemohon</div>
                <div>:</div>
                <div class="detail-pba-value">{{ $form->email ?? '-' }}</div>
            </div>
        </div>

        {{-- Kanan: Alamat Pengiriman Ekspedisi Bahan Acuan --}}
        <div class="col-md-6">
            <div class="pba-section-title text-success">
                <i class="bi bi-truck"></i> Alamat Tujuan Pengiriman Bahan Acuan
            </div>

            <div class="alert alert-light border mb-3 p-3">
                <div class="d-flex align-items-center gap-2 mb-2 text-success fw-bold">
                    <i class="bi bi-geo-alt-fill"></i>
                    <span>Tujuan Ekspedisi / Pengiriman Fisik Material</span>
                </div>
                <p class="mb-0 text-dark" style="font-size: 13px; line-height: 1.6;">
                    {{ $form->alamat_pengiriman ?? '-' }}
                </p>
            </div>

            <div class="detail-pba-row">
                <div class="detail-pba-label">Provinsi Tujuan</div>
                <div>:</div>
                <div class="detail-pba-value">{{ $form->provinsi_nama ?: ($form->provinsi_id ?: '-') }}</div>
            </div>

            <div class="detail-pba-row">
                <div class="detail-pba-label">Kota / Kabupaten Tujuan</div>
                <div>:</div>
                <div class="detail-pba-value">{{ $form->kabupaten_nama ?: ($form->kabupaten_id ?: '-') }}</div>
            </div>

            @if($form->catatan)
                <div class="detail-pba-row mt-2">
                    <div class="detail-pba-label">Instruksi Pengiriman</div>
                    <div>:</div>
                    <div class="detail-pba-value fst-italic">{{ $form->catatan }}</div>
                </div>
            @endif
        </div>
    </div>

    {{-- ── 3. RINCIAN PESANAN BAHAN ACUAN ── --}}
    <div class="mb-4">
        <div class="pba-section-title text-dark">
            <i class="bi bi-boxes"></i> Rincian Produk Bahan Acuan yang Dipesan
        </div>

        <div class="table-responsive bg-white rounded border">
            <table class="table table-hover align-middle mb-0" style="font-size: 13px;">
                <thead class="table-light">
                    <tr>
                        <th class="text-center p-3" style="width: 50px;">No</th>
                        <th class="p-3">Produk Bahan Acuan</th>
                        <th class="p-3">Spesifikasi / Acuan Uji</th>
                        <th class="text-center p-3" style="width: 120px;">Jumlah</th>
                        <th class="p-3">Catatan Tambahan</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="text-center p-3">1</td>
                        <td>
                            <strong class="text-dark fs-6">{{ $form->produk_pesanan }}</strong>
                            @if(!empty($form->produk_lainnya))
                                <div class="text-muted small">Detail: {{ $form->produk_lainnya }}</div>
                            @endif
                        </td>
                        <td>
                            @if(str_contains(strtolower($form->produk_pesanan), 'plastisitas'))
                                <span class="badge bg-light text-dark border">Uji PO / PRI (SNI ISO 2930)</span>
                            @elseif(str_contains(strtolower($form->produk_pesanan), 'viskositas') || str_contains(strtolower($form->produk_pesanan), 'mooney'))
                                <span class="badge bg-light text-dark border">Uji Viskositas Mooney (SNI ISO 289-1)</span>
                            @else
                                <span class="badge bg-light text-dark border">Material Standar BBKKP</span>
                            @endif
                        </td>
                        <td class="text-center fw-bold text-primary p-3">
                            {{ $form->jumlah }} {{ $form->satuan ?? 'Sampel/Unit' }}
                        </td>
                        <td>
                            {{ $form->catatan ?: '-' }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    {{-- ── 4. BERKAS PENDUKUNG & PERNYATAAN ── --}}
    <div class="row g-4 mb-2">
        <div class="col-md-6">
            <div class="pba-section-title text-dark">
                <i class="bi bi-file-earmark-arrow-up"></i> Surat Permohonan / PO
            </div>

            @if($form->file_surat_permohonan)
                <div class="d-flex align-items-center justify-between p-3 bg-light rounded border">
                    <div class="d-flex align-items-center gap-2">
                        <i class="bi bi-file-earmark-pdf-fill text-danger fs-3"></i>
                        <div>
                            <div class="fw-semibold text-dark small">Berkas Surat Permohonan / Purchase Order</div>
                            <small class="text-muted">Diunggah oleh pemohon</small>
                        </div>
                    </div>
                    <a href="{{ $getFileUrl($form->file_surat_permohonan) }}" target="_blank" class="btn btn-sm btn-outline-primary">
                        <i class="bi bi-box-arrow-up-right me-1"></i> Buka Berkas
                    </a>
                </div>
            @else
                <div class="p-3 bg-light rounded border text-muted small">
                    <i class="bi bi-info-circle me-1"></i> Tidak ada file surat permohonan yang dilampirkan.
                </div>
            @endif
        </div>

        <div class="col-md-6">
            <div class="pba-section-title text-dark">
                <i class="bi bi-shield-check"></i> Konfirmasi & Status Waktu
            </div>

            <div class="p-3 bg-light rounded border">
                <div class="d-flex align-items-center gap-2 mb-2">
                    @if($form->pernyataan_konfirmasi)
                        <i class="bi bi-check-circle-fill text-success fs-5"></i>
                        <span class="text-dark small">
                            Pemohon menyetujui seluruh ketentuan pemesanan dan komitmen pembayaran tarif PNBP bahan acuan.
                        </span>
                    @else
                        <i class="bi bi-exclamation-circle-fill text-warning fs-5"></i>
                        <span class="text-muted small">Konfirmasi komitmen belum disetujui.</span>
                    @endif
                </div>

                @if($form->disetujui_pada)
                    <div class="border-top pt-2 mt-2 text-muted small">
                        <i class="bi bi-clock me-1"></i> Waktu Pengajuan: {{ \Carbon\Carbon::parse($form->disetujui_pada)->format('d F Y, H:i') }} WIB
                    </div>
                @endif
            </div>
        </div>
    </div>

</div>
