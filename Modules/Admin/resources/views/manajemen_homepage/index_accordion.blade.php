@extends("$view.index_layout")

@section('title', 'Manage Homepage Accordion')

@section('child_content')
<div class="widget-content searchable-container list" id="accordionVue">
    <div class="form-with-tabs">
        <h5 class="card-title fw-semibold mb-4">
            Data Accordion yang tampil pada landing page JIS
        </h5>

        <div class="d-flex flex-row-reverse">
            <button class="btn btn-primary btn-sm" @click="handleAddAccordion()">
                <i class="fas fa-plus"></i> Tambah Accordion
            </button>
        </div>
        <accordion-table :list-accordion="listAccordionActive"
                         @delete-accordion="handleDeleteAccordion"></accordion-table>
    </div>
</div>
@endsection


@push('styles')
    <link rel="stylesheet" href="{{ asset('assets/plugins/custom/sweetalert2/dist/sweetalert2.min.css') }}">
    <link rel="stylesheet" href="{{ asset('assets/plugins/custom/flatpickr/flatpickr.min.css') }}">
    <link href="https://cdn.jsdelivr.net/npm/quill@2.0.2/dist/quill.snow.css" rel="stylesheet"/>
    <style>
        .ql-toolbar.ql-snow {
            border-top-left-radius: 6px;
            border-top-right-radius: 6px;
            border-color: #e4e6ef;
            background-color: #fcfcfd;
        }
        .ql-container.ql-snow {
            border-bottom-left-radius: 6px;
            border-bottom-right-radius: 6px;
            border-color: #e4e6ef;
            font-family: inherit;
            font-size: 0.95rem;
        }
        .ql-editor {
            min-height: 160px;
        }
    </style>
@endpush

@push('scripts')
    <script src="{{ asset('assets/plugins/custom/sweetalert2/dist/sweetalert2.min.js') }}"></script>
    <script src="{{ asset('assets/plugins/custom/flatpickr/flatpickr.min.js') }}"></script>
    <script src="https://cdn.jsdelivr.net/npm/quill@2.0.2/dist/quill.js"></script>
    <script>
        const { createApp } = Vue;

        window.accordionVue = createApp({
            data() {
                return {
                    listAccordionActive: [],
                };
            },
            mounted() {
                this.refreshListAccordion();
            },
            methods: {
                refreshListAccordion() {
                    this.apiFetchAccordion('aktif').then(data => {
                        this.listAccordionActive = data || [];
                    });
                },
                handleAddAccordion() {
                    window.upsertVue.show();
                },
                handleDeleteAccordion(id) {
                    Swal.fire({
                        title: 'Apakah anda yakin?',
                        text: "Anda tidak akan dapat mengembalikan ini!",
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                    }).then((result) => {
                        if (result.isConfirmed) {
                            // swal loading
                            Swal.fire({
                                title: 'Mohon tunggu',
                                html: 'Sedang menghapus accordion',
                                didOpen: () => {
                                    Swal.showLoading()
                                },
                            });

                            this.apiDeleteAccordion(id)
                                .then(() => {
                                    this.refreshListAccordion();
                                    Swal.fire(
                                        'Deleted!',
                                        'Accordion berhasil dihapus.',
                                        'success'
                                    )
                                })
                                .catch(() => {
                                    Swal.fire(
                                        'Failed!',
                                        'Accordion gagal dihapus.',
                                        'error'
                                    )
                                });
                        }
                    })
                },
                apiDeleteAccordion(id) {
                    return new Promise((resolve, reject) => {
                        $.ajax({
                            url: "{!! url("$url") !!}/destroy_accordion/delete?" + $.param({
                                "id": `${id}`
                            }),
                            type: 'DELETE',
                            processData: false,
                            contentType: false,
                            headers: {
                                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                            },
                            success: function (response) {
                                resolve(response);
                            },
                            error: function (xhr) {
                                reject(xhr);
                            }
                        });
                    });
                },
                apiFetchAccordion(tipe = 'aktif') {
                    return new Promise((resolve, reject) => {
                        fetch(`{!! url("$url/ajax?action=accordion") !!}`)
                            .then(response => response.json())
                            .then(data => {
                                resolve(data.results || []);
                            })
                            .catch(error => {
                                reject(error);
                            });
                    });
                },
            },
        }).component('accordion-table', {
            props: ['listAccordion'],
            methods: {
                handleDeleteAccordion(id) {
                    this.$emit('deleteAccordion', id);
                },
                handleEditAccordion(payload) {
                    window.upsertVue.show(payload);
                }
            },
            template: `
                <div class="table-responsive">
                    <table class="table">
                        <thead>
                        <tr>
                            <th>Urut</th>
                            <th>Judul Accordion</th>
                            <th>Deskripsi / Konten</th>
                            <th>Default Buka</th>
                            <th>Aksi</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="accordion in listAccordion" :key="accordion.id">
                            <td>@{{ accordion.order }}</td>
                            <td>
                                <div class="fw-bold">@{{ typeof accordion.title === 'object' && accordion.title !== null ? (accordion.title.id || '-') : (accordion.title || '-') }}</div>
                                <div v-if="typeof accordion.title === 'object' && accordion.title && accordion.title.en" class="text-muted fs-8">🇬🇧 @{{ accordion.title.en }}</div>
                            </td>
                            <td style="max-width:380px; white-space:normal;">
                                <div v-html="typeof accordion.description === 'object' && accordion.description !== null ? (accordion.description.id || '-') : (accordion.description || '-')"></div>
                                <div v-if="typeof accordion.description === 'object' && accordion.description && accordion.description.en" class="text-muted fs-8 mt-2 p-2 bg-light rounded">
                                    <span class="badge badge-light-primary fs-9 mb-1">🇬🇧 English:</span>
                                    <div v-html="accordion.description.en"></div>
                                </div>
                            </td>
                            <td>
                                <span v-if="accordion.is_default_open" class="badge badge-light-success">
                                    <i class="fas fa-check-circle text-success me-1"></i> Terbuka
                                </span>
                                <span v-else class="badge badge-light-secondary">
                                    Tertutup
                                </span>
                            </td>
                            <td>
                            <div class="d-flex flex-row gap-2">
                                 <button class="btn btn-sm btn-primary" @click="handleEditAccordion(accordion)" title="Edit Accordion">
                                    <i class="fas fa-edit"></i>
                                </button>
                                 <button class="btn btn-sm btn-danger" @click="handleDeleteAccordion(accordion.id)" title="Delete Accordion">
                                    <i class="fas fa-trash"></i>
                                </button>
                             </div>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
`
        }).mount('#accordionVue');
    </script>
@endpush



@include("$view.upsert_accordion")
