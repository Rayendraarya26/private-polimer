@extends('layouts.app')
@section('title', 'Pencatatan Jasa Lainnya (PNBP)')

@push('styles')
    <link href="{{ asset('assets/plugins/custom/datatables/datatables.bundle.css') }}" rel="stylesheet" />
@endpush

@section('content')
    <div class="container-fluid py-4">
        {{-- Header & Action Button --}}
        <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
            <div>
                <h3 class="fw-bolder text-gray-900 mb-1">Pencatatan Jasa Lainnya</h3>
                <p class="text-muted mb-0 small">
                    Pencatatan penerimaan PNBP non-layanan utama langsung oleh Bendahara Penerimaan.
                </p>
            </div>
            @if($isBendahara)
                <div>
                    <a href="{{ route('permohonan.jasa-lainnya.create') }}" class="btn btn-primary">
                        <i class="fas fa-plus me-1"></i> Catat Jasa Lainnya
                    </a>
                </div>
            @endif
        </div>

        {{-- Alerts --}}
        @if(session('success'))
            <div class="alert alert-success alert-dismissible fade show rounded-3 mb-4 d-flex align-items-center gap-3 p-4" role="alert">
                <i class="fas fa-check-circle fs-2 text-success"></i>
                <div class="flex-grow-1">
                    <span class="fw-bold">{{ session('success') }}</span>
                </div>
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        @endif

        @if($errors->any())
            <div class="alert alert-danger alert-dismissible fade show rounded-3 mb-4 d-flex align-items-center gap-3 p-4" role="alert">
                <i class="fas fa-exclamation-triangle fs-2 text-danger"></i>
                <div class="flex-grow-1">
                    <span class="fw-bold">{{ $errors->first() }}</span>
                </div>
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        @endif

        {{-- Main Table Card --}}
        <div class="card border-0 shadow-sm rounded-3">
            <div class="card-body p-4">
                <div class="table-responsive">
                    <table id="table-jasa-lainnya" class="table table-row-dashed table-row-gray-200 align-middle gs-0 gy-4 w-100">
                        <thead>
                            <tr class="fw-bold text-muted bg-light">
                                <th class="ps-3 rounded-start" width="50">No</th>
                                <th width="180">No. Permohonan</th>
                                <th>Pelanggan</th>
                                <th>Jenis</th>
                                <th>Lokasi</th>
                                <th>Uraian</th>
                                <th>Total (Rp)</th>
                                <th>Tgl Bayar</th>
                                <th class="text-end pe-3 rounded-end" width="130">Aksi</th>
                            </tr>
                        </thead>
                        <tbody></tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
@endsection

@push('scripts')
    <script src="{{ asset('assets/plugins/custom/datatables/datatables.bundle.js') }}"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script>
        $(document).ready(function () {
            const table = $('#table-jasa-lainnya').DataTable({
                processing: true,
                serverSide: true,
                responsive: true,
                ajax: "{{ route('permohonan.jasa-lainnya.ajax') }}",
                columns: [
                    { data: 'DT_RowIndex', name: 'DT_RowIndex', orderable: false, searchable: false, className: 'ps-3' },
                    { data: 'no_permohonan', name: 'permohonan.no_permohonan' },
                    { data: 'pelanggan_nama', name: 'pelanggan_nama' },
                    { data: 'jenis_pelanggan', name: 'jenis_pelanggan' },
                    { data: 'lokasi', name: 'lokasi', orderable: false },
                    { data: 'uraian', name: 'uraian' },
                    { data: 'total', name: 'total' },
                    { data: 'tgl_bayar', name: 'tgl_bayar' },
                    { data: 'aksi', name: 'aksi', orderable: false, searchable: false, className: 'text-end pe-3' }
                ],
                order: [[1, 'desc']],
                language: {
                    processing: '<div class="spinner-border text-primary" role="status"><span class="visually-hidden">Memuat...</span></div>',
                    search: "Cari:",
                    lengthMenu: "Tampilkan _MENU_ data",
                    info: "Menampilkan _START_ sampai _END_ dari _TOTAL_ data",
                    infoEmpty: "Menampilkan 0 sampai 0 dari 0 data",
                    infoFiltered: "(disaring dari _MAX_ entri)",
                    zeroRecords: "Tidak ada data jasa lainnya ditemukan",
                    emptyTable: "Belum ada transaksi jasa lainnya yang dicatat",
                    paginate: {
                        first: "Awal",
                        previous: "Sebelumnya",
                        next: "Berikutnya",
                        last: "Akhir"
                    }
                }
            });

            // Handle Delete
            $(document).on('click', '.btn-delete', function () {
                const id = $(this).data('id');
                const url = "{{ url('permohonan/jasa-lainnya') }}/" + id;

                Swal.fire({
                    title: 'Hapus Pencatatan?',
                    text: "Data pencatatan jasa lainnya yang dihapus tidak dapat dipulihkan!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#d33',
                    cancelButtonColor: '#6c757d',
                    confirmButtonText: 'Ya, Hapus!',
                    cancelButtonText: 'Batal'
                }).then((result) => {
                    if (result.isConfirmed) {
                        $.ajax({
                            url: url,
                            type: 'DELETE',
                            headers: {
                                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                            },
                            success: function (res) {
                                if (res.success) {
                                    Swal.fire('Berhasil!', res.message, 'success');
                                    table.ajax.reload(null, false);
                                } else {
                                    Swal.fire('Gagal!', res.message || 'Terjadi kesalahan.', 'error');
                                }
                            },
                            error: function (xhr) {
                                const msg = xhr.responseJSON?.message || 'Terjadi kesalahan saat menghapus data.';
                                Swal.fire('Error!', msg, 'error');
                            }
                        });
                    }
                });
            });
        });
    </script>
@endpush
