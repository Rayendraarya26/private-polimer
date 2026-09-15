@extends('layouts.app')
@section('title', 'Billing & Pembayaran')

@push('styles')
    <link href="{{ asset('assets/plugins/custom/datatables/datatables.bundle.css') }}" rel="stylesheet" />
    <style>
        .badge-light-primary {
            background-color: #f1faff;
            color: #009ef7;
        }

        .badge-light-success {
            background-color: #e8fff3;
            color: #50cd89;
        }

        .badge-light-warning {
            background-color: #fff8dd;
            color: #ffc700;
        }

        .badge-light-danger {
            background-color: #fff5f8;
            color: #f1416c;
        }

        .badge-light-secondary {
            background-color: #f5f8fa;
            color: #7e8299;
        }

        .w-fit {
            width: fit-content;
        }
    </style>
@endpush

@section('content')
    <div class="container-fluid py-4">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
                <h4 class="fw-bold mb-1">Billing & Pembayaran</h4>
                <p class="text-muted mb-0 small">Daftar penerbitan tagihan resmi billing sertifikasi dan surveilans
                    pelanggan.</p>
            </div>
            <div class="card-toolbar">
                <a href="{{ route('permohonan.billing.create') }}" class="btn btn-primary" id="btn-tambah">
                    <i class="fa-solid fa-plus me-2"></i>Tambah Billing
                </a>
            </div>
        </div>

        @if(session('success'))
            <div class="alert alert-success alert-dismissible fade show rounded-3 mb-4" role="alert">
                <i class="fas fa-check-circle me-2"></i> {{ session('success') }}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        @endif

        <div class="card border-0 shadow-sm rounded-3">
            <div class="card-body p-4">
                <div class="table-responsive">
                    <table id="table-billing"
                        class="table table-hover table-row-dashed table-row-gray-200 align-middle gs-2 gy-4">
                        <thead>
                            <tr class="fw-bold text-muted bg-light">
                                <th class="ps-3 rounded-start" width="50">No</th>
                                <th width="170">No. Billing</th>
                                <th>Perusahaan</th>
                                <th width="130">Tanggal Billing</th>
                                <th width="130">Jatuh Tempo</th>
                                <th width="140">Total Tagihan</th>
                                <th class="text-center" width="100">Wajib Lunas</th>
                                <th width="130">Status Bayar</th>
                                <th class="text-end pe-3 rounded-end" width="110">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            @forelse($billings as $index => $item)
                                @php
                                    $formSertifikasi = $item->permohonan?->formSertifikasi?->first();
                                    $namaPerusahaan = $formSertifikasi?->nama_perusahaan
                                        ?? $item->pelanggan?->detail?->nama_perusahaan
                                        ?? $item->pelanggan?->detail?->nama_instansi
                                        ?? $item->pelanggan?->detail?->nama_lengkap
                                        ?? $item->pelanggan?->user?->name
                                        ?? $item->permohonan?->creator?->name
                                        ?? '-';

                                    $itemSummary = $item->items->pluck('nama_komponen')->filter()->join(', ');
                                    if (empty($itemSummary)) {
                                        $itemSummary = $item->items->pluck('keterangan')->filter()->join(', ');
                                    }
                                @endphp
                                <tr>
                                    <td class="ps-3 text-muted">
                                        {{ $billings->firstItem() ? $billings->firstItem() + $index : $index + 1 }}
                                    </td>
                                    <td>
                                        <div class="d-flex flex-column">
                                            <span
                                                class="fw-bold text-primary font-monospace fs-7">{{ $item->no_billing }}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="d-flex flex-column">
                                            <span class="fw-bold text-gray-800 fs-7">{{ $namaPerusahaan }}</span>
                                        </div>
                                    </td>
                                    <td>
                                        @if($item->due_date)

                                            <span class="fs-7 fw-semibold text-gray-700">
                                                {{ \Carbon\Carbon::parse($item->billing_date)->format('d-M-Y') }}
                                            </span>
                                        @else
                                            <span class="text-muted fs-8">-</span>
                                        @endif
                                    </td>
                                    <td>
                                        @if($item->due_date)
                                            @php
                                                $isOverdue = \Carbon\Carbon::parse($item->due_date)->isPast() && $item->status_pembayaran !== 'LUNAS';
                                            @endphp
                                            <span class="fs-7 fw-semibold {{ $isOverdue ? 'text-danger' : 'text-gray-700' }}">
                                                
                                                {{ \Carbon\Carbon::parse($item->due_date)->format('d-M-Y') }}
                                            </span>
                                            @if($isOverdue)
                                                <span class="badge badge-light-danger fs-8 d-block w-fit mt-0.5">Lewat Tempo</span>
                                            @endif
                                        @else
                                            <span class="text-muted fs-8">-</span>
                                        @endif
                                    </td>
                                    <td>
                                        <span class="fw-bold text-gray-900 fs-7">Rp
                                            {{ number_format($item->total_nominal, 0, ',', '.') }}</span>
                                    </td>
                                    <td class="text-center">
                                        @if($item->harus_lunas === 'ya')
                                            <span class="badge badge-light-warning fw-bold fs-8 border border-warning"
                                                title="Wajib Lunas Sebelum Lanjut">
                                                <i class="fa-solid fa-lock text-warning me-1"></i> Ya
                                            </span>
                                        @else
                                            <span class="badge badge-light-secondary text-muted fs-8 border">Tidak</span>
                                        @endif
                                    </td>
                                    <td>
                                        @if($item->status_pembayaran === 'LUNAS')
                                            <span class="badge badge-light-success fs-8 fw-bold">
                                                <i class="fa-solid fa-check-circle text-success me-1"></i> LUNAS
                                            </span>
                                        @elseif($item->status_pembayaran === 'VERIFIKASI')
                                            <span class="badge badge-light-info fs-8 fw-bold">
                                                <i class="fa-solid fa-spinner fa-spin text-info me-1"></i> VERIFIKASI
                                            </span>
                                        @elseif($item->status_pembayaran === 'BATAL')
                                            <span class="badge badge-light-danger fs-8 fw-bold">BATAL</span>
                                        @else
                                            <span class="badge badge-light-warning fs-8 fw-bold">
                                                <i class="fa-regular fa-clock text-warning me-1"></i> MENUNGGU
                                            </span>
                                        @endif
                                    </td>
                                    <td class="text-end pe-3">
                                        <div class="d-flex justify-content-end gap-2">
                                            @if($item->file_invoice)
                                                <a href="{{ asset('storage/' . $item->file_invoice) }}" target="_blank"
                                                    class="btn btn-icon btn-sm btn-light-primary" title="Lihat/Unduh Invoice PDF">
                                                    <i class="fa-solid fa-file-pdf fs-6"></i>
                                                </a>
                                            @endif
                                            @if($item->permohonan_id)
                                                <a href="{{ route('permohonan.layanan.detail', $item->permohonan_id) }}"
                                                    class="btn btn-icon btn-sm btn-light-info" title="Detail Permohonan">
                                                    <i class="fa-solid fa-arrow-up-right-from-square fs-6"></i>
                                                </a>
                                            @endif
                                        </div>
                                    </td>
                                </tr>
                            @empty
                                <tr>
                                    <td colspan="9" class="text-center py-5 text-muted">
                                        <i class="fa-solid fa-receipt fs-2tx text-muted mb-3 d-block"></i>
                                        <span class="fw-bold fs-6">Belum ada data billing diterbitkan</span>
                                        <p class="fs-7 text-muted mt-1 mb-0">Klik tombol "+ Tambah Billing" di atas untuk
                                            menerbitkan billing baru.</p>
                                    </td>
                                </tr>
                            @endforelse
                        </tbody>
                    </table>
                </div>

                @if($billings->hasPages())
                    <div class="d-flex justify-content-between align-items-center mt-4">
                        <div class="text-muted fs-7">
                            Menampilkan {{ $billings->firstItem() ?? 0 }} - {{ $billings->lastItem() ?? 0 }} dari
                            {{ $billings->total() }} data
                        </div>
                        <div>
                            {{ $billings->links('pagination::bootstrap-5') }}
                        </div>
                    </div>
                @endif
            </div>
        </div>
    </div>
@endsection