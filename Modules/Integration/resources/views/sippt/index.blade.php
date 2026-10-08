@extends('layouts.app')
@section('title', 'Monitoring Integrasi SIPPT BSKJI')

@section('content')
<div class="container-fluid px-4 py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
            <h2 class="h4 fw-bold mb-1">🔗 Monitoring Integrasi SIPPT BSKJI</h2>
            <p class="text-muted small mb-0">Pantau dan kelola sinkronisasi otomatis transaksi layanan BBKKP ke portal SIPPT BSKJI Kemenperin</p>
        </div>
        <div class="d-flex gap-2">
            <a href="{{ route('sippt.proyeksi') }}" class="btn btn-outline-primary btn-sm">
                <i class="bi bi-graph-up-arrow me-1"></i> Proyeksi Penerimaan
            </a>
            @if($stats['failed'] > 0)
                <form action="{{ route('sippt.retryAll') }}" method="POST" onsubmit="return confirm('Apakah Anda yakin ingin mencoba ulang semua transaksi yang gagal?');">
                    @csrf
                    <button type="submit" class="btn btn-warning btn-sm text-dark fw-semibold">
                        <i class="bi bi-arrow-repeat me-1"></i> Retry Semua Gagal ({{ $stats['failed'] }})
                    </button>
                </form>
            @endif
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

    {{-- Kartu Statistik --}}
    <div class="row g-3 mb-4">
        <div class="col-6 col-md-3">
            <div class="card border-0 shadow-sm p-3 bg-white rounded-3">
                <div class="d-flex align-items-center justify-content-between">
                    <div>
                        <div class="text-muted small">Total Terkirim</div>
                        <div class="fs-4 fw-bold text-dark">{{ number_format($stats['total']) }}</div>
                    </div>
                    <div class="badge bg-light text-primary p-3 rounded-circle">
                        <i class="bi bi-cloud-arrow-up fs-5"></i>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-6 col-md-3">
            <div class="card border-0 shadow-sm p-3 bg-white rounded-3">
                <div class="d-flex align-items-center justify-content-between">
                    <div>
                        <div class="text-muted small">Berhasil (Success)</div>
                        <div class="fs-4 fw-bold text-success">{{ number_format($stats['success']) }}</div>
                    </div>
                    <div class="badge bg-light-success text-success p-3 rounded-circle">
                        <i class="bi bi-check2-circle fs-5"></i>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-6 col-md-3">
            <div class="card border-0 shadow-sm p-3 bg-white rounded-3">
                <div class="d-flex align-items-center justify-content-between">
                    <div>
                        <div class="text-muted small">Gagal (Failed)</div>
                        <div class="fs-4 fw-bold text-danger">{{ number_format($stats['failed']) }}</div>
                    </div>
                    <div class="badge bg-light-danger text-danger p-3 rounded-circle">
                        <i class="bi bi-x-circle fs-5"></i>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-6 col-md-3">
            <div class="card border-0 shadow-sm p-3 bg-white rounded-3">
                <div class="d-flex align-items-center justify-content-between">
                    <div>
                        <div class="text-muted small">Pending / Cancelled</div>
                        <div class="fs-4 fw-bold text-secondary">{{ number_format($stats['pending'] + $stats['cancelled']) }}</div>
                    </div>
                    <div class="badge bg-light text-secondary p-3 rounded-circle">
                        <i class="bi bi-clock-history fs-5"></i>
                    </div>
                </div>
            </div>
        </div>
    </div>

    {{-- Filter & Tabel Data --}}
    <div class="card border-0 shadow-sm rounded-3">
        <div class="card-body p-4">
            <form method="GET" action="{{ route('sippt.index') }}" class="row g-2 mb-3">
                <div class="col-12 col-md-4">
                    <input type="text" name="search" value="{{ $search }}" class="form-control form-control-sm" placeholder="Cari No Order / Permohonan...">
                </div>
                <div class="col-6 col-md-3">
                    <select name="status" class="form-select form-select-sm">
                        <option value="">-- Semua Status --</option>
                        <option value="success" {{ $statusFilter === 'success' ? 'selected' : '' }}>Success</option>
                        <option value="failed" {{ $statusFilter === 'failed' ? 'selected' : '' }}>Failed</option>
                        <option value="pending" {{ $statusFilter === 'pending' ? 'selected' : '' }}>Pending</option>
                        <option value="cancelled" {{ $statusFilter === 'cancelled' ? 'selected' : '' }}>Cancelled</option>
                    </select>
                </div>
                <div class="col-6 col-md-3">
                    <select name="modul" class="form-select form-select-sm">
                        <option value="">-- Semua Modul Layanan --</option>
                        @foreach($modules as $key => $label)
                            <option value="{{ $key }}" {{ $modulFilter === $key ? 'selected' : '' }}>{{ $label }}</option>
                        @endforeach
                    </select>
                </div>
                <div class="col-12 col-md-2 d-flex gap-1">
                    <button type="submit" class="btn btn-primary btn-sm flex-grow-1">Filter</button>
                    <a href="{{ route('sippt.index') }}" class="btn btn-outline-secondary btn-sm">Reset</a>
                </div>
            </form>

            <div class="table-responsive">
                <table class="table table-hover align-middle mb-0">
                    <thead class="table-light">
                        <tr class="text-secondary small">
                            <th>No Order</th>
                            <th>Modul</th>
                            <th>Status</th>
                            <th>HTTP</th>
                            <th>Percobaan</th>
                            <th>Waktu Sync</th>
                            <th>Error Terakhir</th>
                            <th class="text-end">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse($logs as $log)
                            <tr>
                                <td class="fw-semibold">
                                    <a href="{{ route('sippt.detail', $log->id) }}" class="text-decoration-none">
                                        {{ $log->no_order }}
                                    </a>
                                </td>
                                <td>
                                    <span class="badge bg-light text-dark border">
                                        {{ $modules[$log->modul] ?? ucfirst($log->modul) }}
                                    </span>
                                </td>
                                <td>
                                    @if($log->status === 'success')
                                        <span class="badge bg-success-subtle text-success border border-success-subtle">Success</span>
                                    @elseif($log->status === 'failed')
                                        <span class="badge bg-danger-subtle text-danger border border-danger-subtle">Failed</span>
                                    @elseif($log->status === 'cancelled')
                                        <span class="badge bg-secondary-subtle text-secondary border border-secondary-subtle">Cancelled</span>
                                    @else
                                        <span class="badge bg-warning-subtle text-warning border border-warning-subtle">Pending</span>
                                    @endif
                                </td>
                                <td>
                                    <code>{{ $log->http_status_code ?: '-' }}</code>
                                </td>
                                <td>{{ $log->retry_count }}x</td>
                                <td class="small text-muted">
                                    {{ $log->synced_at ? $log->synced_at->format('d/m/Y H:i') : $log->created_at->format('d/m/Y H:i') }}
                                </td>
                                <td class="small text-truncate" style="max-width: 250px;" title="{{ $log->last_error }}">
                                    {{ $log->last_error ?: '-' }}
                                </td>
                                <td class="text-end">
                                    <div class="btn-group btn-group-sm">
                                        <a href="{{ route('sippt.detail', $log->id) }}" class="btn btn-outline-secondary btn-sm" title="Lihat Detail Payload">
                                            <i class="bi bi-eye"></i>
                                        </a>
                                        @if($log->status === 'failed')
                                            <form action="{{ route('sippt.retry', $log->id) }}" method="POST" class="d-inline">
                                                @csrf
                                                <button type="submit" class="btn btn-outline-primary btn-sm" title="Retry Kirim">
                                                    <i class="bi bi-arrow-repeat"></i>
                                                </button>
                                            </form>
                                        @endif
                                    </div>
                                </td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="8" class="text-center py-4 text-muted">
                                    <i class="bi bi-inbox fs-2 d-block mb-1"></i>
                                    Belum ada log sinkronisasi SIPPT yang tercatat.
                                </td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>

            <div class="mt-4">
                {{ $logs->links() }}
            </div>
        </div>
    </div>
</div>
@endsection
