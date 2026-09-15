@extends('layouts.app')
@section('title', 'Penerbitan Surat Penawaran Biaya')

@section('content')
    <div class="container-fluid py-4">
        {{-- Breadcrumbs & Header --}}
        <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
                <a href="{{ route('permohonan.tagihan-biaya.index') }}" class="btn btn-sm btn-outline-secondary mb-2">
                    <i class="fas fa-arrow-left me-1"></i> Kembali ke Daftar Tagihan Biaya
                </a>
                <h4 class="fw-bold mb-1">Penerbitan Surat Penawaran Biaya</h4>
                <p class="text-muted mb-0 small">Permohonan: <strong>{{ $permohonan->no_permohonan }}</strong></p>
            </div>
        </div>

        @if(session('error'))
            <div class="alert alert-danger alert-dismissible fade show rounded-3 mb-4" role="alert">
                <i class="fas fa-exclamation-triangle me-2"></i> {{ session('error') }}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        @endif

        <div class="row g-4">
            {{-- KOLOM KIRI: RINGKASAN DATA & KAJIAN TEKNIS DARI SIS --}}
            <div class="col-lg-6">
                <div class="card border-0 shadow-sm rounded-3 h-100">
                    <div class="card-header bg-white py-3 border-bottom">
                        <h6 class="fw-bold mb-0 text-primary"><i class="fas fa-clipboard-check me-2"></i>Hasil Kajian Teknis
                            Operator LS (SIS)</h6>
                    </div>
                    <div class="card-body p-4">
                        {{-- Status Kajian --}}
                        @if($kajianLog)
                            <div
                                class="alert alert-success border-0 bg-success-subtle text-success-emphasis p-3 rounded-3 mb-4">
                                <div class="d-flex gap-2">
                                    <i class="fas fa-check-circle fa-lg mt-1 text-success"></i>
                                    <div>
                                        <div class="fw-bold">Kajian Teknis Telah Disetujui PJT</div>
                                        <small class="text-muted">{{ $kajianLog->deskripsi }}</small>
                                    </div>
                                </div>
                            </div>
                        @else
                            <div
                                class="alert alert-warning border-0 bg-warning-subtle text-warning-emphasis p-3 rounded-3 mb-4">
                                <div class="d-flex gap-2">
                                    <i class="fas fa-clock fa-lg mt-1 text-warning"></i>
                                    <div>
                                        <div class="fw-bold">Dalam Proses Kajian Teknis di SIS</div>
                                        <small class="text-muted">Operator LS, Paskal, atau PJT di SIS sedang menelaah kelayakan
                                            teknis permohonan ini.</small>
                                    </div>
                                </div>
                            </div>
                        @endif

                        {{-- Info Perusahaan --}}
                        <h6 class="fw-bold text-dark border-bottom pb-2 mb-3">1. Data Pemohon & Pabrik</h6>
                        <table class="table table-sm table-borderless small mb-4">
                            <tr>
                                <td width="140" class="text-muted">Nama Perusahaan</td>
                                <td class="fw-bold">{{ $form?->nama_perusahaan ?? '-' }}</td>
                            </tr>
                            <tr>
                                <td class="text-muted">Jenis Perusahaan</td>
                                <td>{{ $form?->jenis_perusahaan ?? 'Swasta Nasional' }}</td>
                            </tr>
                            <tr>
                                <td class="text-muted">Alamat Kantor</td>
                                <td>{{ $form?->alamat_kantor ?? '-' }}</td>
                            </tr>
                            <tr>
                                <td class="text-muted">Jumlah Pegawai</td>
                                <td>{{ $form?->jumlah_karyawan_total ?? 0 }} Orang</td>
                            </tr>
                        </table>

                        {{-- Komoditas --}}
                        <h6 class="fw-bold text-dark border-bottom pb-2 mb-3">2. Spesifikasi Produk & Standar SNI</h6>
                        @if(!empty($form?->komoditas_json))
                            @foreach($form->komoditas_json as $idx => $k)
                                <div class="p-3 bg-light rounded-3 mb-2 small">
                                    <div class="fw-bold text-primary">{{ $k['nama_produk'] ?? 'Produk SNI' }}</div>
                                    <div class="text-muted mt-1">Standar SNI: <strong>{{ $k['standar_sni_iso'] ?? '-' }}</strong> |
                                        Merk: {{ $k['merk_dagang'] ?? '-' }} | Tipe: {{ $k['tipe_jenis'] ?? '-' }}</div>
                                    <div class="text-muted">Kapasitas Produksi: {{ $k['kapasitas_produksi'] ?? 0 }}
                                        {{ $k['satuan_produksi'] ?? 'Unit' }}/Tahun
                                    </div>
                                </div>
                            @endforeach
                        @else
                            <p class="text-muted small">Data komoditas belum diisi.</p>
                        @endif
                    </div>
                </div>
            </div>

            {{-- KOLOM KANAN: FORM INPUT SURAT PENAWARAN BIAYA --}}
            <div class="col-lg-6">
                <div class="card border-0 shadow-sm rounded-3 h-100">
                    <div class="card-header bg-white py-3 border-bottom">
                        <h6 class="fw-bold mb-0 text-dark"><i class="fas fa-file-invoice-dollar me-2 text-primary"></i>Form
                            Penerbitan Penawaran Biaya</h6>
                    </div>
                    <div class="card-body p-4">
                        <form action="{{ route('permohonan.tagihan-biaya.kirim', $permohonan->id) }}" method="POST"
                            enctype="multipart/form-data">
                            @csrf

                            <div class="mb-3">
                                <label class="form-label fw-bold">Total Nominal Biaya Sertifikasi (Rp) <span
                                        class="text-danger">*</span></label>
                                <div class="input-group">
                                    <span class="input-group-text bg-light fw-bold">Rp</span>
                                    <input type="number" name="nominal"
                                        class="form-control form-control-lg fw-bold text-primary"
                                        placeholder="Contoh: 15000000" min="1000"
                                        value="{{ old('nominal', $penawaran?->total_nominal ?? ($permohonan->detailPembayaran->sum('subtotal') > 0 ? $permohonan->detailPembayaran->sum('subtotal') : null)) }}"
                                        required>
                                </div>
                                <small class="text-muted">Masukkan total biaya sertifikasi yang telah dihitung berdasarkan
                                    hari-audit (*man-days*).</small>
                            </div>

                            <div class="mb-3">
                                <label class="form-label fw-bold">Dokumen Surat Penawaran Biaya (PDF) <span
                                        class="text-danger">*</span></label>
                                <input type="file" name="dok_penawaran" class="form-control" accept=".pdf" {{ $penawaran ? '' : 'required' }}>
                                @if($permohonan->catatan_admin)
                                    <div class="mt-2 small">
                                        <span class="text-muted">File saat ini:</span>
                                        <a href="{{ asset('storage/' . $permohonan->catatan_admin) }}" target="_blank"
                                            class="text-primary fw-bold">
                                            <i class="fas fa-file-pdf me-1"></i> Lihat Surat Penawaran Sebelumnya
                                        </a>
                                    </div>
                                @endif
                                <small class="text-muted d-block mt-1">Upload berkas PDF resmi bertandatangan dari Bagian
                                    Marketing (Maks. 10MB).</small>
                            </div>

                            <div class="mb-4">
                                <label class="form-label fw-bold">Catatan Penawaran untuk Pelanggan (Opsional)</label>
                                <textarea name="catatan_marketing" class="form-control" rows="3"
                                    placeholder="Contoh: Penawaran biaya sudah termasuk akomodasi auditor tahap 1 & 2. Masa berlaku penawaran 30 hari.">{{ old('catatan_marketing', $penawaran?->catatan) }}</textarea>
                            </div>

                            <div class="d-grid gap-2">
                                <button type="submit"
                                    class="btn btn-primary btn-lg fw-bold d-flex align-items-center justify-content-center gap-2">
                                    <i class="fas fa-paper-plane"></i> Kirim Surat Penawaran ke Pelanggan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection