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

    $jenisInspeksi = is_array($form->jenis_inspeksi) 
        ? $form->jenis_inspeksi 
        : (is_string($form->jenis_inspeksi) ? json_decode($form->jenis_inspeksi, true) ?? [$form->jenis_inspeksi] : []);
@endphp

<!-- ================= BARIS 1: OBJEK & PELAKSANAAN ================= -->
<div class="row g-4 mb-4">
    <!-- Kiri: Objek & Spesifikasi Inspeksi -->
    <div class="col-md-6">
        <h6 class="text-primary border-bottom pb-2 mb-3">Objek & Lingkup Inspeksi</h6>

        <div class="detail-row">
            <div class="detail-label">Jenis Inspeksi</div>
            <div>:</div>
            <div class="detail-value">
                @forelse($jenisInspeksi as $jenis)
                    <span class="badge bg-light-primary text-primary border me-1 text-uppercase">
                        {{ $jenis }}
                    </span>
                @empty
                    <span class="text-muted">-</span>
                @endforelse
            </div>
        </div>

        <div class="detail-row">
            <div class="detail-label">Komoditas / Objek</div>
            <div>:</div>
            <div class="detail-value fw-bold text-dark">{{ $form->komoditas ?: '-' }}</div>
        </div>

        <div class="detail-row">
            <div class="detail-label">Kapasitas / Satuan</div>
            <div>:</div>
            <div class="detail-value fw-semibold">{{ $form->kapasitas_karung ?: '-' }}</div>
        </div>

        <div class="detail-row">
            <div class="detail-label">Jumlah Partai / Lot</div>
            <div>:</div>
            <div class="detail-value fw-semibold">{{ $form->jumlah_partai_lot ?? 1 }} Partai / Lot</div>
        </div>

        <div class="detail-row">
            <div class="detail-label">Bahasa Laporan</div>
            <div>:</div>
            <div class="detail-value text-capitalize">{{ $form->bahasa_laporan ?? 'Indonesia' }}</div>
        </div>

        <div class="detail-row">
            <div class="detail-label">Tujuan Inspeksi</div>
            <div>:</div>
            <div class="detail-value">{{ $form->tujuan_inspeksi ?? '-' }}</div>
        </div>

        @if(!empty($form->spesifikasi_dimensi))
            <div class="detail-row">
                <div class="detail-label">Spesifikasi Dimensi</div>
                <div>:</div>
                <div class="detail-value" style="white-space: pre-line;">{{ $form->spesifikasi_dimensi }}</div>
            </div>
        @endif
    </div>

    <!-- Kanan: Pelaksanaan Lapangan & Berkas -->
    <div class="col-md-6">
        <h6 class="text-primary border-bottom pb-2 mb-3">Pelaksanaan Lapangan & Berkas</h6>

        <div class="detail-row">
            <div class="detail-label">Rencana Tgl Inspeksi</div>
            <div>:</div>
            <div class="detail-value fw-semibold text-primary">
                {{ $form->tgl_rencana_inspeksi ? \Carbon\Carbon::parse($form->tgl_rencana_inspeksi)->translatedFormat('l, d F Y') : '-' }}
            </div>
        </div>

        <div class="detail-row">
            <div class="detail-label">Lokasi Gudang / Pabrik</div>
            <div>:</div>
            <div class="detail-value">{{ $form->lokasi_inspeksi ?? '-' }}</div>
        </div>

        <div class="detail-row">
            <div class="detail-label">No. Surat Pemohon</div>
            <div>:</div>
            <div class="detail-value">{{ $form->no_surat_pemohon ?: '-' }}</div>
        </div>

        <div class="detail-row">
            <div class="detail-label">Tgl. Surat Pemohon</div>
            <div>:</div>
            <div class="detail-value">
                {{ $form->tgl_surat_pemohon ? \Carbon\Carbon::parse($form->tgl_surat_pemohon)->translatedFormat('d F Y') : '-' }}
            </div>
        </div>

        <div class="detail-row">
            <div class="detail-label">Berkas Surat Pemohon</div>
            <div>:</div>
            <div class="detail-value">
                @if(!empty($form->file_surat_permohonan))
                    <div class="d-flex align-items-center gap-2">
                        <button type="button"
                            class="btn btn-sm btn-primary preview-btn py-1 px-3"
                            data-file="{{ $getFileUrl($form->file_surat_permohonan) }}"
                            data-name="Surat_Permohonan_Inspeksi_{{ $form->no_surat_pemohon ?: 'Klien' }}">
                            Lihat file <i class="fa fa-eye ms-1"></i>
                        </button>
                        <a href="{{ $getFileUrl($form->file_surat_permohonan) }}"
                            download="Surat_Permohonan_Inspeksi"
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
            <div class="detail-label">Pernyataan Pemohon</div>
            <div>:</div>
            <div class="detail-value">
                @if($form->setuju_pernyataan)
                    <span class="badge bg-light-success text-success"><i class="fa fa-check-circle me-1"></i> Disetujui</span>
                    @if($form->pernyataan_at)
                        <small class="text-muted d-block mt-1">Pada {{ \Carbon\Carbon::parse($form->pernyataan_at)->translatedFormat('d F Y, H:i') }} WIB</small>
                    @endif
                @else
                    <span class="badge bg-light-danger text-danger"><i class="fa fa-times-circle me-1"></i> Belum Disetujui</span>
                @endif
            </div>
        </div>
    </div>
</div>

<!-- ================= BARIS 2: PIHAK TERKAIT ================= -->
<div class="row g-4 mb-4">
    <!-- Kiri: Instansi Penerima Hasil Inspeksi -->
    <div class="col-md-6">
        <h6 class="text-primary border-bottom pb-2 mb-3">Hasil Inspeksi Ditujukan Kepada</h6>

        <div class="detail-row">
            <div class="detail-label">Nama Lembaga / Instansi</div>
            <div>:</div>
            <div class="detail-value fw-bold text-dark">{{ $form->penerima_hasil_nama ?: '-' }}</div>
        </div>

        <div class="detail-row">
            <div class="detail-label">Alamat Instansi</div>
            <div>:</div>
            <div class="detail-value">{{ $form->penerima_hasil_alamat ?? '-' }}</div>
        </div>

        <div class="detail-row">
            <div class="detail-label">Email Instansi</div>
            <div>:</div>
            <div class="detail-value">{{ $form->penerima_hasil_email ?? '-' }}</div>
        </div>
    </div>

    <!-- Kanan: Penanggung Biaya & Kontak PIC -->
    <div class="col-md-6">
        <h6 class="text-primary border-bottom pb-2 mb-3">Penanggung Biaya & Kontak PIC</h6>

        <div class="detail-row">
            <div class="detail-label">Penanggung Biaya</div>
            <div>:</div>
            <div class="detail-value fw-bold text-dark">{{ $form->biaya_nama ?? '-' }}</div>
        </div>

        <div class="detail-row">
            <div class="detail-label">Alamat Penanggung Biaya</div>
            <div>:</div>
            <div class="detail-value">{{ $form->biaya_alamat ?? '-' }}</div>
        </div>

        <div class="detail-row">
            <div class="detail-label">Email Penanggung Biaya</div>
            <div>:</div>
            <div class="detail-value">{{ $form->biaya_email ?? '-' }}</div>
        </div>

        <div class="detail-row mt-3">
            <div class="detail-label">Nama PIC Lapangan</div>
            <div>:</div>
            <div class="detail-value fw-semibold">{{ $form->pemohon_pic_nama ?? '-' }}</div>
        </div>

        <div class="detail-row">
            <div class="detail-label">No. Kontak / WhatsApp</div>
            <div>:</div>
            <div class="detail-value fw-semibold text-dark">
                {{ $form->pemohon_pic_kontak ?? '-' }}
            </div>
        </div>

        <div class="detail-row">
            <div class="detail-label">Alamat PIC</div>
            <div>:</div>
            <div class="detail-value">{{ $form->pemohon_pic_alamat ?? '-' }}</div>
        </div>
    </div>
</div>
