@extends('layouts.app')
@section('title', 'Detail Sinkronisasi SIPPT: ' . $log->no_order)

@section('content')
<div class="container-fluid px-4 py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
            <a href="{{ route('sippt.index') }}" class="btn btn-outline-secondary btn-sm mb-2">
                <i class="bi bi-arrow-left me-1"></i> Kembali ke Monitoring
            </a>
            <h2 class="h4 fw-bold mb-0">Rincian Sinkronisasi: {{ $log->no_order }}</h2>
        </div>
        <div>
            @if($log->status === 'failed')
                <form action="{{ route('sippt.retry', $log->id) }}" method="POST" class="d-inline">
                    @csrf
                    <button type="submit" class="btn btn-primary btn-sm">
                        <i class="bi bi-arrow-repeat me-1"></i> Coba Ulang (Retry)
                    </button>
                </form>
            @endif
        </div>
    </div>

    {{-- Info Card --}}
    <div class="card border-0 shadow-sm rounded-3 mb-4">
        <div class="card-body p-4">
            <div class="row g-3">
                <div class="col-md-3">
                    <span class="text-muted small d-block">Status</span>
                    @if($log->status === 'success')
                        <span class="badge bg-success-subtle text-success border border-success-subtle fs-6">Success</span>
                    @elseif($log->status === 'failed')
                        <span class="badge bg-danger-subtle text-danger border border-danger-subtle fs-6">Failed</span>
                    @elseif($log->status === 'cancelled')
                        <span class="badge bg-secondary-subtle text-secondary border border-secondary-subtle fs-6">Cancelled</span>
                    @else
                        <span class="badge bg-warning-subtle text-warning border border-warning-subtle fs-6">Pending</span>
                    @endif
                </div>
                <div class="col-md-3">
                    <span class="text-muted small d-block">Modul Layanan</span>
                    <span class="fw-bold">{{ strtoupper($log->modul) }}</span>
                </div>
                <div class="col-md-3">
                    <span class="text-muted small d-block">HTTP Status</span>
                    <code>{{ $log->http_status_code ?: '-' }}</code>
                </div>
                <div class="col-md-3">
                    <span class="text-muted small d-block">Waktu Sinkronisasi</span>
                    <span>{{ $log->synced_at ? $log->synced_at->format('d/m/Y H:i:s') : '-' }}</span>
                </div>
                <div class="col-md-6">
                    <span class="text-muted small d-block">Endpoint API</span>
                    <code>{{ $log->method }} {{ $log->endpoint }}</code>
                </div>
                <div class="col-md-6">
                    <span class="text-muted small d-block">Jumlah Percobaan Ulang</span>
                    <span>{{ $log->retry_count }} kali</span>
                </div>
                @if($log->last_error)
                    <div class="col-12">
                        <div class="alert alert-danger mb-0">
                            <strong>Pesan Kesalahan (Error):</strong>
                            <div class="mt-1 small">{{ $log->last_error }}</div>
                        </div>
                    </div>
                @endif
            </div>
        </div>
    </div>

    {{-- Payload Details --}}
    <div class="row g-4">
        <div class="col-lg-6">
            <div class="card border-0 shadow-sm rounded-3 h-100">
                <div class="card-header bg-white border-bottom py-3">
                    <h5 class="card-title h6 mb-0 fw-bold">📤 Payload Request yang Dikirim</h5>
                </div>
                <div class="card-body p-3">
                    <pre class="bg-light p-3 rounded-2 text-dark small overflow-auto mb-0" style="max-height: 450px;"><code>{{ json_encode($log->request_payload, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) }}</code></pre>
                </div>
            </div>
        </div>
        <div class="col-lg-6">
            <div class="card border-0 shadow-sm rounded-3 h-100">
                <div class="card-header bg-white border-bottom py-3">
                    <h5 class="card-title h6 mb-0 fw-bold">📥 Payload Response dari SIPPT</h5>
                </div>
                <div class="card-body p-3">
                    <pre class="bg-light p-3 rounded-2 text-dark small overflow-auto mb-0" style="max-height: 450px;"><code>{{ json_encode($log->response_payload, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) }}</code></pre>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
