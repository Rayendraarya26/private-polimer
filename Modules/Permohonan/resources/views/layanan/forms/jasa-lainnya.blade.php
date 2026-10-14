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
</style>

@php
    $getFileUrl = function ($path) {
        if (empty($path))
            return null;
        if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://') || str_starts_with($path, '/storage/')) {
            return $path;
        }
        return asset('storage/' . $path);
    };
@endphp

<!-- ================= IDENTITAS PEMOHON ================= -->
<div class="mt-4">
    <h6 class="text-primary border-bottom pb-2 mb-3">Identitas Pemohon</h6>

    <div class="detail-row">
        <div class="detail-label">Nama Lengkap / Instansi</div>
        <div>:</div>
        <div class="detail-value fw-bold text-dark">{{ ucwords(strtolower($form->pelanggan_nama)) ?: '-' }}</div>
    </div>

    <div class="detail-row">
        <div class="detail-label">Jenis Pelanggan</div>
        <div>:</div>
        <div class="detail-value fw-semibold">{{ ucwords(strtolower($form->jenis_pelanggan)) ?: '-' }}</div>
    </div>

    <div class="detail-row">
        <div class="detail-label">Alamat</div>
        <div>:</div>
        <div class="detail-value">{{ $form->kabupaten_nama ?: '' }}, {{ $form->provinsi_nama ?: '' }},
            {{ $form->negara ?: '' }}</div>
    </div>
</div>

<!-- ================= DETAIL PERMOHONAN ================= -->
<div class="mt-4">
    <h6 class="text-primary border-bottom pb-2 mb-3">Detail Permohonan Jasa Lainnya</h6>

    <div class="detail-row">
        <div class="detail-label">Uraian Jasa Lainnya</div>
        <div>:</div>
        <div class="detail-value">
            {{ $form->uraian ?: '-' }}
        </div>
    </div>
</div>


<!-- RINCIAN BIAYA -->
<div class="mt-4">
    <h6 class="text-primary border-bottom pb-2 mb-3">Pemba</h6>

    <div class="detail-row">
        <div class="detail-label">Total Bayar</div>
        <div>:</div>
        <div class="detail-value fw-bold text-dark">{{ 'Rp. ' . number_format($form->total, 0, ',', '.') ?: '-' }}</div>
    </div>

    <div class="detail-row">
        <div class="detail-label">Tanggal Bayar</div>
        <div>:</div>
        <div class="detail-value fw-semibold">{{ $form->tgl_bayar ? \Carbon\Carbon::parse($form->tgl_bayar)->format('d M Y') : '-' }}</div>
    </div>
</div>