@extends('layouts.app')
@section('title', 'Pelaporan Proyeksi Penerimaan SIPPT BSKJI')

@section('content')
<div class="container-fluid px-4 py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
            <a href="{{ route('sippt.index') }}" class="btn btn-outline-secondary btn-sm mb-2">
                <i class="bi bi-arrow-left me-1"></i> Kembali ke Monitoring
            </a>
            <h2 class="h4 fw-bold mb-1">📈 Pelaporan Proyeksi Penerimaan PNBP ke SIPPT</h2>
            <p class="text-muted small mb-0">Laporkan target proyeksi penerimaan PNBP tahunan per jenis layanan ke sistem BSKJI Kemenperin</p>
        </div>
    </div>

    {{-- Notifikasi --}}
    @if(session('success'))
        <div class="alert alert-success alert-dismissible fade show" role="alert">
            <i class="bi bi-check-circle me-1"></i> {{ session('success') }}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    @endif
    @if(session('error'))
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
            <i class="bi bi-exclamation-triangle me-1"></i> {{ session('error') }}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    @endif

    <div class="row g-4">
        {{-- Formulir Input --}}
        <div class="col-lg-5">
            <div class="card border-0 shadow-sm rounded-3">
                <div class="card-header bg-white border-bottom py-3">
                    <h5 class="card-title h6 mb-0 fw-bold">Kirim Data Proyeksi Baru</h5>
                </div>
                <div class="card-body p-4">
                    <form action="{{ route('sippt.proyeksi.submit') }}" method="POST">
                        @csrf
                        <div class="mb-3">
                            <label class="form-label small fw-semibold">Jenis Layanan <span class="text-danger">*</span></label>
                            <select name="jenis_layanan" class="form-select" required>
                                <option value="">-- Pilih Jenis Layanan --</option>
                                @foreach($layananList as $layanan)
                                    <option value="{{ $layanan }}">{{ $layanan }}</option>
                                @endforeach
                            </select>
                        </div>

                        <div class="mb-3">
                            <label class="form-label small fw-semibold">Tahun Anggaran <span class="text-danger">*</span></label>
                            <input type="number" name="tahun" class="form-control" value="{{ date('Y') }}" min="2020" max="2035" required>
                            <small class="text-muted">Tahun berlakunya proyeksi penerimaan.</small>
                        </div>

                        <div class="mb-4">
                            <label class="form-label small fw-semibold">Proyeksi Penerimaan (Rp) <span class="text-danger">*</span></label>
                            <div class="input-group">
                                <span class="input-group-text">Rp</span>
                                <input type="number" name="proyeksi_penerimaan" class="form-control" placeholder="Contoh: 50000000" min="0" step="1000" required>
                            </div>
                            <small class="text-muted">Total target rupiah penerimaan layanan untuk tahun tersebut.</small>
                        </div>

                        <button type="submit" class="btn btn-primary w-100">
                            <i class="bi bi-send me-1"></i> Laporkan ke SIPPT BSKJI
                        </button>
                    </form>
                </div>
            </div>
        </div>

        {{-- Riwayat Pengiriman Proyeksi --}}
        <div class="col-lg-7">
            <div class="card border-0 shadow-sm rounded-3">
                <div class="card-header bg-white border-bottom py-3">
                    <h5 class="card-title h6 mb-0 fw-bold">Riwayat Pelaporan Proyeksi</h5>
                </div>
                <div class="card-body p-0">
                    <div class="table-responsive">
                        <table class="table table-hover align-middle mb-0">
                            <thead class="table-light">
                                <tr class="text-secondary small">
                                    <th>Referensi</th>
                                    <th>Status</th>
                                    <th>HTTP</th>
                                    <th>Waktu Kirim</th>
                                </tr>
                            </thead>
                            <tbody>
                                @forelse($proyeksiLogs as $pLog)
                                    <tr>
                                        <td class="fw-semibold">
                                            <a href="{{ route('sippt.detail', $pLog->id) }}" class="text-decoration-none">
                                                {{ $pLog->no_order }}
                                            </a>
                                        </td>
                                        <td>
                                            @if($pLog->status === 'success')
                                                <span class="badge bg-success-subtle text-success border border-success-subtle">Success</span>
                                            @else
                                                <span class="badge bg-danger-subtle text-danger border border-danger-subtle">Failed</span>
                                            @endif
                                        </td>
                                        <td><code>{{ $pLog->http_status_code ?: '-' }}</code></td>
                                        <td class="small text-muted">{{ $pLog->created_at->format('d/m/Y H:i') }}</td>
                                    </tr>
                                @empty
                                    <tr>
                                        <td colspan="4" class="text-center py-4 text-muted">
                                            Belum ada riwayat pelaporan proyeksi penerimaan.
                                        </td>
                                    </tr>
                                @endforelse
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
