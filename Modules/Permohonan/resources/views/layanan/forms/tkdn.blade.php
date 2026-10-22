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

<!-- ================= IDENTITAS PERUSAHAAN ================= -->
<div class="mt-4">
    <h6 class="text-primary border-bottom pb-2 mb-3">Identitas Perusahaan</h6>

    <div class="detail-row">
        <div class="detail-label">Nama Perusahaan</div>
        <div>:</div>
        <div class="detail-value fw-bold text-dark">{{ $form->nama_perusahaan ?: '-' }}</div>
    </div>

    <div class="detail-row">
        <div class="detail-label">Alamat Perusahaan</div>
        <div>:</div>
        <div class="detail-value">{{ $form->alamat ?: '-' }}</div>
    </div>

    <div class="detail-row">
        <div class="detail-label">Wilayah</div>
        <div>:</div>
        <div class="detail-value">
            {{ implode(', ', array_filter([$form->kabupaten_nama, $form->provinsi_nama])) ?: '-' }}
        </div>
    </div>
</div>

<!-- ================= DETAIL PERMOHONAN ================= -->
<div class="mt-4">
    <h6 class="text-primary border-bottom pb-2 mb-3">Detail Permohonan TKDN</h6>

    <div class="detail-row">
        <div class="detail-label">Uraian Pekerjaan</div>
        <div>:</div>
        <div class="detail-value" style="white-space: pre-wrap;">{{ $form->uraian_pekerjaan ?: '-' }}</div>
    </div>
</div>

<!-- ================= RINCIAN PEMBAYARAN ================= -->
<div class="mt-4">
    <h6 class="text-primary border-bottom pb-2 mb-3">Rincian Pembayaran</h6>

    <div class="detail-row">
        <div class="detail-label">Biaya</div>
        <div>:</div>
        <div class="detail-value fw-bold text-success font-monospace">Rp {{ number_format((float) ($form->biaya ?? 0), 0, ',', '.') }}</div>
    </div>

    <div class="detail-row">
        <div class="detail-label">Tanggal Bayar</div>
        <div>:</div>
        <div class="detail-value fw-semibold">{{ $form->tanggal_bayar ? \Carbon\Carbon::parse($form->tanggal_bayar)->translatedFormat('d F Y') : '-' }}</div>
    </div>
</div>

