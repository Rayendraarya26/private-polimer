@extends('layouts.app')
@section('title', 'Detail Jasa Lainnya - ' . ($jasa->permohonan?->no_permohonan ?? ''))

@section('content')
    <div class="container-fluid py-4">
        {{-- Header --}}
        <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
            <div>
                <a href="{{ route('permohonan.jasa-lainnya.index') }}" class="btn btn-sm btn-light-primary mb-2">
                    <i class="fas fa-arrow-left me-1"></i> Kembali ke Daftar Jasa Lainnya
                </a>
                <h3 class="fw-bolder text-gray-900 mb-1">
                    Detail Jasa Lainnya: {{ $jasa->permohonan?->no_permohonan ?? '-' }}
                </h3>
                <p class="text-muted mb-0 small">
                    Informasi detail pencatatan penerimaan PNBP jasa lainnya.
                </p>
            </div>
            @if($isBendahara)
                <div class="d-flex gap-2">
                    <a href="{{ route('permohonan.jasa-lainnya.edit', $jasa->id) }}" class="btn btn-warning">
                        <i class="fas fa-edit me-1"></i> Edit Data
                    </a>
                </div>
            @endif
        </div>

        <div class="row g-4">
            {{-- Info Utama --}}
            <div class="col-lg-8">
                <div class="card border-0 shadow-sm rounded-3 mb-4">
                    <div class="card-header bg-transparent py-4 border-bottom">
                        <h5 class="card-title fw-bold text-gray-900 mb-0">
                            <i class="fas fa-info-circle text-primary me-2"></i> Rincian Jasa & Pembayaran
                        </h5>
                    </div>
                    <div class="card-body p-4">
                        <div class="row g-3">
                            <div class="col-md-6">
                                <span class="text-muted small d-block">Nomor Permohonan</span>
                                <span class="fw-bold font-monospace fs-5 text-dark">
                                    {{ $jasa->permohonan?->no_permohonan ?? '-' }}
                                </span>
                            </div>
                            <div class="col-md-6">
                                <span class="text-muted small d-block">Status Permohonan & Pembayaran</span>
                                <span class="badge badge-light-success text-success px-2.5 py-1.5 me-1">SELESAI (DONE)</span>
                                <span class="badge badge-light-success text-success px-2.5 py-1.5">LUNAS</span>
                            </div>

                            <hr class="my-2 border-gray-200">

                            <div class="col-md-6">
                                <span class="text-muted small d-block">Nama Pelanggan</span>
                                <span class="fw-semibold text-gray-800 fs-6">{{ $jasa->pelanggan_nama }}</span>
                            </div>
                            <div class="col-md-6">
                                <span class="text-muted small d-block">Jenis Pelanggan</span>
                                <span class="badge badge-light-primary text-primary px-2.5 py-1.5">
                                    {{ ucwords(str_replace('_', ' ', $jasa->jenis_pelanggan)) }}
                                </span>
                            </div>

                            <div class="col-md-4">
                                <span class="text-muted small d-block">Negara</span>
                                <span class="fw-semibold text-gray-800">{{ $jasa->negara }}</span>
                            </div>
                            <div class="col-md-4">
                                <span class="text-muted small d-block">Provinsi</span>
                                <span class="fw-semibold text-gray-800">{{ $jasa->provinsi_nama ?? '-' }}</span>
                            </div>
                            <div class="col-md-4">
                                <span class="text-muted small d-block">Kabupaten / Kota</span>
                                <span class="fw-semibold text-gray-800">{{ $jasa->kabupaten_nama ?? '-' }}</span>
                            </div>

                            <hr class="my-2 border-gray-200">

                            <div class="col-12">
                                <span class="text-muted small d-block">Uraian Jasa</span>
                                <div class="p-3 bg-light rounded-2 text-gray-800 mt-1" style="white-space: pre-wrap;">
                                    {{ $jasa->uraian }}
                                </div>
                            </div>

                            <div class="col-md-6">
                                <span class="text-muted small d-block">Total Pembayaran</span>
                                <span class="fw-bold fs-4 text-success font-monospace">
                                    Rp {{ number_format((float) $jasa->total, 0, ',', '.') }}
                                </span>
                            </div>
                            <div class="col-md-6">
                                <span class="text-muted small d-block">Tanggal Bayar</span>
                                <span class="fw-semibold text-gray-800 fs-5">
                                    {{ $jasa->tgl_bayar ? \Carbon\Carbon::parse($jasa->tgl_bayar)->translatedFormat('d F Y') : '-' }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {{-- Metadata & Log --}}
            <div class="col-lg-4">
                {{-- Metadata Pencatat --}}
                <div class="card border-0 shadow-sm rounded-3 mb-4">
                    <div class="card-header bg-transparent py-4 border-bottom">
                        <h6 class="card-title fw-bold text-gray-900 mb-0">
                            <i class="fas fa-user-check text-success me-2"></i> Informasi Pencatatan
                        </h6>
                    </div>
                    <div class="card-body p-4">
                        <div class="mb-3">
                            <span class="text-muted small d-block">Dicatat Oleh</span>
                            <span class="fw-bold text-gray-800">
                                {{ $jasa->pencatat?->name ?? 'Bendahara' }}
                            </span>
                            @if($jasa->pencatat?->nip)
                                <span class="text-muted small d-block">NIP: {{ $jasa->pencatat->nip }}</span>
                            @endif
                        </div>
                        <div class="mb-3">
                            <span class="text-muted small d-block">Waktu Pencatatan</span>
                            <span class="fw-semibold text-gray-700">
                                {{ $jasa->created_at ? $jasa->created_at->format('d M Y, H:i') . ' WIB' : '-' }}
                            </span>
                        </div>
                        @if($jasa->updated_at && $jasa->updated_at != $jasa->created_at)
                            <div>
                                <span class="text-muted small d-block">Terakhir Diperbarui</span>
                                <span class="fw-semibold text-gray-700">
                                    {{ $jasa->updated_at->format('d M Y, H:i') . ' WIB' }}
                                </span>
                            </div>
                        @endif
                    </div>
                </div>

                {{-- Timeline Log --}}
                @if($jasa->permohonan && $jasa->permohonan->trackingLogs->count() > 0)
                    <div class="card border-0 shadow-sm rounded-3">
                        <div class="card-header bg-transparent py-4 border-bottom">
                            <h6 class="card-title fw-bold text-gray-900 mb-0">
                                <i class="fas fa-history text-info me-2"></i> Log Riwayat
                            </h6>
                        </div>
                        <div class="card-body p-4">
                            <div class="timeline timeline-border-dashed">
                                @foreach($jasa->permohonan->trackingLogs as $log)
                                    <div class="timeline-item mb-3">
                                        <div class="timeline-line"></div>
                                        <div class="timeline-icon">
                                            <i class="fas fa-circle text-primary fs-8"></i>
                                        </div>
                                        <div class="timeline-content ms-3">
                                            <span class="fw-bold text-gray-800 d-block fs-7">{{ $log->judul }}</span>
                                            <span class="text-muted fs-8">{{ $log->created_at?->format('d M Y H:i') }}</span>
                                            <p class="text-gray-600 fs-8 mb-0 mt-1">{{ $log->deskripsi }}</p>
                                        </div>
                                    </div>
                                @endforeach
                            </div>
                        </div>
                    </div>
                @endif
            </div>
        </div>
    </div>
@endsection
