@extends('layouts.app')
@section('title', 'Detail TKDN - ' . ($tkdn->permohonan?->no_permohonan ?? ''))

@section('content')
    <div class="container-fluid py-4">
        {{-- Header --}}
        <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
            <div>
                <a href="{{ route('permohonan.tkdn.index') }}" class="btn btn-sm btn-light-primary mb-2">
                    <i class="fas fa-arrow-left me-1"></i> Kembali ke Daftar TKDN
                </a>
                <h3 class="fw-bolder text-gray-900 mb-1">
                    Detail TKDN: {{ $tkdn->permohonan?->no_permohonan ?? '-' }}
                </h3>
                <p class="text-muted mb-0 small">
                    Informasi detail pencatatan penerimaan PNBP verifikasi TKDN.
                </p>
            </div>
            @if($isBendahara)
                <div class="d-flex gap-2">
                    <a href="{{ route('permohonan.tkdn.edit', $tkdn->id) }}" class="btn btn-warning">
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
                            <i class="fas fa-info-circle text-primary me-2"></i> Rincian TKDN & Pembayaran
                        </h5>
                    </div>
                    <div class="card-body p-4">
                        <div class="row g-3">
                            <div class="col-md-6">
                                <span class="text-muted small d-block">Nomor Permohonan</span>
                                <span class="fw-bold text-dark fs-5 font-monospace">
                                    {{ $tkdn->permohonan?->no_permohonan ?? '-' }}
                                </span>
                            </div>
                            <div class="col-md-6">
                                <span class="text-muted small d-block">Status Permohonan / Bayar</span>
                                <span class="badge badge-light-success text-success px-3 py-1">LUNAS / SELESAI</span>
                            </div>

                            <hr class="my-2 border-gray-200">

                            <div class="col-md-6">
                                <span class="text-muted small d-block">Nama Perusahaan</span>
                                <span class="fw-semibold text-gray-800 fs-6">{{ $tkdn->nama_perusahaan }}</span>
                            </div>

                            <div class="col-md-6">
                                <span class="text-muted small d-block">Wilayah</span>
                                <span class="fw-semibold text-gray-800">
                                    {{ implode(', ', array_filter([$tkdn->kabupaten_nama, $tkdn->provinsi_nama])) ?: '-' }}
                                </span>
                            </div>

                            <div class="col-12">
                                <span class="text-muted small d-block">Alamat Perusahaan</span>
                                <span class="fw-semibold text-gray-800">{{ $tkdn->alamat ?: '-' }}</span>
                            </div>

                            <hr class="my-2 border-gray-200">

                            <div class="col-12">
                                <span class="text-muted small d-block">Uraian Pekerjaan</span>
                                <div class="p-3 bg-light rounded-2 text-gray-800 mt-1" style="white-space: pre-wrap;">{{ $tkdn->uraian_pekerjaan }}</div>
                            </div>

                            <div class="col-md-6">
                                <span class="text-muted small d-block">Biaya Pembayaran</span>
                                <span class="fw-bold fs-4 text-success font-monospace">
                                    Rp {{ number_format((float) $tkdn->biaya, 0, ',', '.') }}
                                </span>
                            </div>
                            <div class="col-md-6">
                                <span class="text-muted small d-block">Tanggal Bayar</span>
                                <span class="fw-semibold text-gray-800 fs-5">
                                    {{ $tkdn->tanggal_bayar ? \Carbon\Carbon::parse($tkdn->tanggal_bayar)->translatedFormat('d F Y') : '-' }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {{-- Metadata & Log --}}
            <div class="col-lg-4">
                <div class="card border-0 shadow-sm rounded-3 mb-4">
                    <div class="card-header bg-transparent py-4 border-bottom">
                        <h6 class="card-title fw-bold text-gray-900 mb-0">
                            <i class="fas fa-user-shield text-info me-2"></i> Info Pencatat
                        </h6>
                    </div>
                    <div class="card-body p-4">
                        <div class="mb-3">
                            <span class="text-muted small d-block">Dicatat Oleh</span>
                            <span class="fw-bold text-gray-800">
                                {{ $tkdn->pencatat?->name ?? 'Bendahara' }}
                            </span>
                            @if($tkdn->pencatat?->nip)
                                <span class="text-muted small d-block">NIP: {{ $tkdn->pencatat->nip }}</span>
                            @endif
                        </div>
                        <div class="mb-3">
                            <span class="text-muted small d-block">Waktu Pencatatan</span>
                            <span class="fw-semibold text-gray-700">
                                {{ $tkdn->created_at ? $tkdn->created_at->format('d M Y, H:i') . ' WIB' : '-' }}
                            </span>
                        </div>
                        @if($tkdn->updated_at && $tkdn->updated_at != $tkdn->created_at)
                            <div>
                                <span class="text-muted small d-block">Terakhir Diperbarui</span>
                                <span class="fw-semibold text-gray-700">
                                    {{ $tkdn->updated_at->format('d M Y, H:i') . ' WIB' }}
                                </span>
                            </div>
                        @endif
                    </div>
                </div>

                {{-- Tracking Logs --}}
                @if($tkdn->permohonan && $tkdn->permohonan->trackingLogs->count() > 0)
                    <div class="card border-0 shadow-sm rounded-3">
                        <div class="card-header bg-transparent py-4 border-bottom">
                            <h6 class="card-title fw-bold text-gray-900 mb-0">
                                <i class="fas fa-history text-secondary me-2"></i> Log Aktivitas
                            </h6>
                        </div>
                        <div class="card-body p-4">
                            <div class="timeline-label">
                                @foreach($tkdn->permohonan->trackingLogs as $log)
                                    <div class="timeline-item mb-3">
                                        <div class="timeline-label fw-bold text-gray-800 fs-8" style="width: 70px;">
                                            {{ $log->created_at ? $log->created_at->format('d/m/Y') : '' }}
                                        </div>
                                        <div class="timeline-badge">
                                            <i class="fa fa-genderless text-success fs-1"></i>
                                        </div>
                                        <div class="timeline-content text-muted ps-3">
                                            <div class="fw-bold text-dark">{{ $log->judul ?? $log->milestone_code }}</div>
                                            <div class="small">{{ $log->deskripsi }}</div>
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
