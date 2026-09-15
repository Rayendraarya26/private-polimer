@extends('layouts.app')
@section('title', 'Surat Tagihan Biaya Sertifikasi')

@push('styles')
    <link href="{{ asset('assets/plugins/custom/datatables/datatables.bundle.css') }}" rel="stylesheet" />
@endpush

@section('content')
    <div class="container-fluid py-4">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
                <h4 class="fw-bold mb-1">Surat Tagihan Biaya Sertifikasi</h4>
                <p class="text-muted mb-0 small">Daftar permohonan sertifikasi industri yang menunggu penetapan biaya dan
                    pengunggahan surat penawaran resmi.</p>
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
                    <table id="table-tagihan-biaya"
                        class="table table-row-dashed table-row-gray-200 align-middle gs-0 gy-4">
                        <thead>
                            <tr class="fw-bold text-muted bg-light">
                                <th class="ps-3 rounded-start" width="50">No</th>
                                <th width="180">No. Permohonan</th>
                                <th>Tgl Pengajuan</th>
                                <th>Nama Perusahaan</th>
                                <th>Pengajuan Sertifikasi</th>
                                <th>Status</th>
                                <th class="text-end pe-3 rounded-end" width="160">Aksi</th>
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
    <script>
        $(document).ready(function () {
            $('#table-tagihan-biaya').DataTable({
                processing: true,
                serverSide: true,
                ajax: "{{ route('permohonan.tagihan-biaya.ajax') }}",
                columns: [
                    { data: 'DT_RowIndex', name: 'DT_RowIndex', orderable: false, searchable: false, className: 'ps-3' },
                    { data: 'no_permohonan', name: 'no_permohonan' },
                    { data: 'tgl_pengajuan', name: 'created_at' },
                    { data: 'nama_perusahaan', name: 'nama_perusahaan' },
                    { data: 'pengajuan_sertifikasi', name: 'pengajuan_sertifikasi' },
                    { data: 'status', name: 'status', orderable: false, searchable: false },
                    { data: 'aksi', name: 'aksi', orderable: false, searchable: false, className: 'text-end pe-3' }
                ],
                language: {
                    search: "Cari permohonan:",
                    lengthMenu: "Tampilkan _MENU_ data",
                    zeroRecords: "Tidak ada permohonan yang menunggu penawaran biaya",
                    info: "Menampilkan _START_ sampai _END_ dari _TOTAL_ data",
                    infoEmpty: "Menampilkan 0 data",
                    paginate: { first: "Awal", last: "Akhir", next: "→", previous: "←" }
                }
            });
        });
    </script>
@endpush