<style>
    .detail-mini-row {
        display: grid;
        grid-template-columns: 200px 10px 1fr;
        margin-bottom: 8px;
        font-size: 13px;
    }

    .detail-mini-label {
        color: #64748b;
        font-weight: 500;
    }

    .detail-mini-value {
        word-break: break-word;
        color: #1e293b;
    }

    .mini-section-title {
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

    .mini-stat-card {
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 10px;
        padding: 12px 16px;
    }

    .mini-card {
        background: #ffffff;
        border: 1px solid #e2e8f0;
        border-radius: 10px;
        margin-bottom: 16px;
        overflow: hidden;
    }

    .mini-header {
        background: #f8fafc;
        padding: 12px 16px;
        border-bottom: 1px solid #e2e8f0;
    }
</style>

<div class="space-y-4">

    {{-- ── 1. STATISTIC HIGHLIGHT CARDS ── --}}
    <div class="row g-3 mb-4">
        <div class="col-md-4">
            <div class="mini-stat-card border-start border-1 border-secondary">
                <span class="text-uppercase text-muted" style="font-size: 11px; letter-spacing: 0.5px;">Layanan
                    Miniplant</span>
                <h6 class="fw-bold text-primary mb-0 mt-1 text-truncate" title="{{ $form->jenis_layanan_nama }}">
                    {{ $form->jenis_layanan_nama ?? '-' }}
                </h6>
            </div>
        </div>
        <div class="col-md-4">
            <div class="mini-stat-card border-start border-1 border-secondary">
                <span class="text-uppercase text-muted" style="font-size: 11px; letter-spacing: 0.5px;">Target
                    Selesai</span>
                <h6 class="fw-bold text-primary mb-0 mt-1 text-truncate" title="{{ $form->jenis_layanan_nama }}">
                    Belum Ditentukan
                </h6>
            </div>
        </div>
        <!-- <div class="col-md-4">
            <div class="mini-stat-card border-start border-1 border-secondary">
                <span class="text-uppercase text-muted" style="font-size: 11px; letter-spacing: 0.5px;">Total Perlakuan</span>
                <h4 class="fw-bold text-success mb-0 mt-1">
                    {{ $form->items?->count() ?? 0 }}
                    <small class="fs-6 text-muted fw-normal">Item</small>
                </h4>
                <small class="text-muted" style="font-size: 11px;">Jasa: {{ ucfirst($form->jasa_diminta ?? '-') }}</small>
            </div>
        </div>
        <div class="col-md-4">
            <div class="mini-stat-card border-start border-1 border-secondary">
                <span class="text-uppercase text-muted" style="font-size: 11px; letter-spacing: 0.5px;">Jumlah Barang</span>
                <h4 class="fw-bold text-dark mb-0 mt-1">
                    {{ $form->jumlah_barang ?? 1 }}
                    <small class="fs-6 text-muted fw-normal">Barang/Sampel</small>
                </h4>
                <small class="text-muted text-truncate d-block" style="font-size: 11px;">
                    Bahan: {{ $form->jenis_barang ?? '-' }}
                </small>
            </div>
        </div> -->
    </div>

    {{-- ── 2. INFORMASI PEMOHON & DETAIL JASA ── --}}
    <div class="row g-4 mb-4">
        {{-- Kiri: Identitas Pemohon --}}
        <div class="col-md-6">
            <div class="mini-section-title text-primary">
                <i class="bi bi-person-badge"></i> Identitas Pemohon
            </div>

            <div class="detail-mini-row">
                <div class="detail-mini-label">Nama Peminta Jasa</div>
                <div>:</div>
                <div class="detail-mini-value fw-semibold">{{ $form->nama_pemohon ?? '-' }}</div>
            </div>

            <div class="detail-mini-row">
                <div class="detail-mini-label">No. Telepon / WA</div>
                <div>:</div>
                <div class="detail-mini-value">{{ $form->no_telp ?? '-' }}</div>
            </div>

            <div class="detail-mini-row">
                <div class="detail-mini-label">Alamat</div>
                <div>:</div>
                <div class="detail-mini-value">{{ $form->alamat_pemohon ?? '-' }}</div>
            </div>
        </div>

        {{-- Kanan: Detail Jasa --}}
        <div class="col-md-6">
            <div class="mini-section-title text-primary">
                <i class="bi bi-truck"></i> Detail Jasa
            </div>

            <div class="detail-mini-row">
                <div class="detail-mini-label">Jasa yang diminta</div>
                <div>:</div>
                <div class="detail-mini-value text-capitalize">
                    <span class="detail-mini-value">{{ $form->jasa_diminta }}</span>
                </div>
            </div>

            <div class="detail-mini-row">
                <div class="detail-mini-label">Jenis Barang</div>
                <div>:</div>
                <div class="detail-mini-value">{{ $form->jenis_barang }}</div>
            </div>

            <div class="detail-mini-row">
                <div class="detail-mini-label">Jumlah Barang Diterima</div>
                <div>:</div>
                <div class="detail-mini-value">{{ $form->jumlah_barang }}</div>
            </div>
        </div>
    </div>

    <div class="mb-4">
        <div class="mini-section-title text-primary">
            <i class="bi bi-list-check"></i> Perlakuan yang diminta
        </div>

        @if($form->jasa_diminta === "proses")
            <div class="detail-mini-value">{{ $form->perlakuan_diminta ?? '-' }}</div>
        @endif

        @if ($form->jasa_diminta === "mesin")
            <div class="detail-mini-row">
                <div class="detail-mini-label">Tekanan</div>
                <div>:</div>
                <div class="detail-mini-value">
                    {{ $form->tekanan_nilai ? $form->tekanan_nilai . ' ' . ($form->tekanan_satuan ?? '') : '-' }}
                </div>
            </div>

            <div class="detail-mini-row">
                <div class="detail-mini-label">Waktu</div>
                <div>:</div>
                <div class="detail-mini-value">
                    {{ $form->waktu_nilai ? $form->waktu_nilai . ' ' . ($form->waktu_satuan ?? '') : '-' }}
                </div>
            </div>

            <div class="detail-mini-row">
                <div class="detail-mini-label">Temperatur</div>
                <div>:</div>
                <div class="detail-mini-value">
                    {{ $form->temperatur_nilai ? $form->temperatur_nilai . ' ' . ($form->temperatur_satuan ?? '') : '-' }}
                </div>
            </div>
        @endif


    </div>


    {{-- ── 3. RINCIAN PERLAKUAN YANG DIMINTA ── --}}
    <div class="mb-4">
        <div class="mini-section-title text-primary">
            <i class="bi bi-list-check"></i> Daftar Perlakuan yang Diminta
        </div>

        <div class="table-responsive border rounded-3 overflow-hidden shadow-sm">
            <table class="table table-hover table-striped align-middle mb-0" style="font-size: 13px;">
                <thead class="table-light">
                    <tr>
                        <th class="text-center ps-3 py-3" style="width: 50px;">No</th>
                        <th class="py-3">Nama Perlakuan</th>
                        <th class="text-end py-3" style="width: 170px;">Tarif PNBP</th>
                        <th class="text-center py-3" style="width: 120px;">Jumlah</th>
                        <th class="text-end pe-4 py-3" style="width: 180px;">Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse($form->items ?? [] as $index => $item)
                        <tr>
                            <td class="text-center text-muted ps-3 py-2.5">{{ $index + 1 }}</td>
                            <td class="py-2.5">
                                <div class="fw-semibold text-dark">
                                    {{ $item->nama_perlakuan_snapshot ?? $item->masterMiniplant?->nama ?? '-' }}
                                </div>
                                @if($item->keterangan)
                                    <small class="text-muted d-block">{{ $item->keterangan }}</small>
                                @endif
                            </td>
                            <td class="text-end py-2.5">
                                Rp {{ number_format($item->tarif_satuan_snapshot, 0, ',', '.') }}
                                <small class="text-muted d-block">/ {{ $item->satuan_snapshot ?? 'unit' }}</small>
                            </td>
                            <td class="text-center py-2.5">
                                <span class="text-dark fw-medium px-2 py-1">
                                    {{ $item->jumlah }}
                                </span>
                            </td>
                            <td class="text-end fw-semibold text-dark pe-4 py-2.5">
                                Rp {{ number_format($item->subtotal, 0, ',', '.') }}
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="5" class="text-center py-4 text-muted">
                                <i class="bi bi-inbox fs-4 d-block mb-1"></i>
                                Tidak ada data rincian perlakuan yang diminta.
                            </td>
                        </tr>
                    @endforelse
                </tbody>
                @if($form->items && $form->items->isNotEmpty())
                    <tfoot class="table-light border-top">
                        <tr>
                            <th colspan="4" class="text-end fw-bold py-3">Total Estimasi Biaya:</th>
                            <th class="text-end fw-bold text-primary pe-4 py-3" style="font-size: 14px;">
                                Rp
                                {{ number_format($form->items->sum('subtotal') ?: $form->estimasi_total_biaya, 0, ',', '.') }}
                            </th>
                        </tr>
                    </tfoot>
                @endif
            </table>
        </div>
    </div>



    {{-- ── 4. PERNYATAAN & PERSETUJUAN ── --}}
    <!-- <div class="p-3 bg-light rounded border">
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
    </div> -->

</div>