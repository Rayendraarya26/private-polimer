@extends('layouts.app')

@section('title', 'Manage Menu')

@section('content')
    <div class="card" id="kt_card">
        <!--begin::Card body-->
        <div class="card-body">
            @if(session('message'))
                <div class="alert alert-success" role="alert">
                    {{ session('message') }}
                </div>
            @endif
            <!--begin::Row-->
            <div class="row">
                <div id="toolbar" class="d-flex">
                    <div style="padding-right: 20px">
                        <a href="{{ url("$url/create") }}" class="btn btn-light-success btn-sm">
                            <i class="fa-solid fa-plus"></i>
                            Tambah
                        </a>
                    </div>
                    <div class="px-1">
                        <button class="btn btn-light-primary btn-sm" onclick="handleActive('yes')">
                            <i class="fa-solid fa-check"></i>
                            Aktifkan
                        </button>
                    </div>
                    <div class="px-1">
                        <button class="btn btn-light-danger btn-sm" onclick="handleActive('no')">
                            <i class="fa-solid fa-times"></i>
                            Non Aktifkan
                        </button>
                    </div>
                </div>
                <table class="table" id="table"></table>
            </div>
        </div>
    </div>
@endsection

@push('styles')
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/jquery-treegrid@0.3.0/css/jquery.treegrid.css">
    <link href="https://unpkg.com/bootstrap-table@1.21.4/dist/bootstrap-table.min.css" rel="stylesheet">
@endpush

@push('scripts')

    <script src="https://cdn.jsdelivr.net/npm/jquery-treegrid@0.3.0/js/jquery.treegrid.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap-table@1.22.3/dist/bootstrap-table.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap-table@1.22.3/dist/extensions/treegrid/bootstrap-table-treegrid.min.js"></script>

    <script>
        let $table = $('#table')

        function apiDelete(id) {
            return axios.delete(`{{ url("$url") }}/${id}`)
                .then(res => {
                    toastr.success(res.data.message)
                    $table.bootstrapTable('refresh')
                })
        }

        function apiActive(ids, isActive) {
            return axios.post(`{{ url("$url/ajax/active") }}`, { ids, status: isActive })
                .then(res => {
                    toastr.success(res.data.message)
                    $table.bootstrapTable('refresh')
                })
        }

        function getSelected() {
            return $table.bootstrapTable('getSelections')
        }

        function handleActive(isActive) {
            const selected = getSelected()
            if (selected.length > 0) {
                const ids = selected.map(item => item.id)
                apiActive(ids, isActive)
            }
        }

        function handleDelete(id, nama) {
            Swal.fire({
                text: "Anda yakin untuk menghapus " + nama + "?",
                icon: "warning",
                showCancelButton: true,
                buttonsStyling: false,
                confirmButtonText: "Ya, hapus!",
                cancelButtonText: "Tidak, batal",
                customClass: {
                    confirmButton: "btn fw-bold btn-danger",
                    cancelButton: "btn fw-bold btn-active-light-primary"
                }
            }).then(function (result) {
                if (result.value) {
                    apiDelete(id)
                }
            });
        }

        $(function () {
            $table.bootstrapTable({
                toolbar: '#toolbar',
                url: `{{ url("$url/ajax/treegrid") }}`,
                idField: 'id',
                showColumns: true,
                columns: [
                    {
                        field: 'ck',
                        checkbox: true
                    },
                    {
                        field: 'name',
                        title: 'Nama Menu',
                        formatter: function (value, row, index) {
                            return row.icon ? `<i class="${row.icon}"></i> ${value}` : value
                        }
                    },
                    {
                        field: 'order',
                        title: 'Urutan',
                        sortable: true,
                        align: 'center',
                    },
                    {
                        field: 'is_active',
                        title: 'Status Menu',
                        formatter: function (value, row, index) {
                            return value === 'yes' ? '<span class="badge badge-success">Aktif</span>' : '<span class="badge badge-danger">Tidak Aktif</span>';
                        },
                    },
                    {
                        field: 'action',
                        title: 'Aksi',
                        formatter: function (value, row, index) {
                            return `
                                <a href="{{ url("$url") }}/${row.id}/edit" class="btn btn-outline btn-outline-dashed btn-outline-success btn-active-light-success btn-sm">Edit</a>
                                <button class="btn btn-outline btn-outline-dashed btn-outline-danger btn-active-light-danger btn-sm" onclick="handleDelete('${row.id}', '${row.name}')">Delete</button>
                                <a href="{{url("$url")}}/${row.id}/menu-action" class="btn btn-outline btn-outline-dashed btn-outline-primary btn-active-light-primary btn-sm">Menu Action</button>
                            `
                        }
                    }
                ],
                treeShowField: 'name',
                parentIdField: 'parent_id',
                onPostBody: function () {
                    const columns = $table.bootstrapTable('getOptions').columns
                    if (columns && columns[0][1].visible) {
                        $table.treegrid({
                            treeColumn: 1,
                            onChange: function () {
                                $table.bootstrapTable('resetView')
                            }
                        })
                    }
                }
            })
        })
    </script>
@endpush
