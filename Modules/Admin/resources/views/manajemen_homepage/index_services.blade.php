@extends("$view.index_layout")

@section('title', 'Manage Homepage Services')

@section('child_content')
<div class="widget-content searchable-container list" id="servicesVue">
    <div class="form-with-tabs">
        <h5 class="card-title fw-semibold mb-4">
            Data Layanan yang tampil pada landing page JIS
        </h5>

        <div class="d-flex flex-row-reverse">
            <button class="btn btn-primary btn-sm" @click="handleAddServices()">
                <i class="fas fa-plus"></i> Tambah Layanan
            </button>
        </div>
        <services-table :list-services="listServicesActive"
                                  @delete-services="handleDeleteServices"></services-table>
    </div>
</div>
	
@include("$view.upsert_services")
@endsection


@push('styles')
    <link rel="stylesheet" href="{{ asset('assets/plugins/custom/sweetalert2/dist/sweetalert2.min.css') }}">
    <link rel="stylesheet" href="{{ asset('assets/plugins/custom/flatpickr/flatpickr.min.css') }}">
    <link href="https://cdn.jsdelivr.net/npm/quill@2.0.2/dist/quill.snow.css" rel="stylesheet"/>
@endpush

@push('scripts')
    <script src="{{ asset('assets/plugins/custom/sweetalert2/dist/sweetalert2.min.js') }}"></script>
    <script src="{{ asset('assets/plugins/custom/flatpickr/flatpickr.min.js') }}"></script>
    <script src="https://cdn.jsdelivr.net/npm/quill@2.0.2/dist/quill.js"></script>
    <script>
        const { createApp } = Vue;

        window.servicesVue = createApp({
            data() {
                return {
                    listServicesActive: [],
                };
            },
            mounted() {
                this.refreshListServices();
            },
            methods: {
                refreshListServices() {
                    this.apiFetchServices('aktif').then(data => {
                        this.listServicesActive = data;
                    });
                },
                handleAddServices() {
                    window.upsertVue.show();
                },
                handleDeleteServices(id) {
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
                                html: 'Sedang menghapus services',
                                didOpen: () => {
                                    Swal.showLoading()
                                },
                            });

                            this.apiDeleteServices(id)
                                .then(() => {
                                    this.refreshListServices();
                                    Swal.fire(
                                        'Deleted!',
                                        'Services berhasil dihapus.',
                                        'success'
                                    )
                                })
                                .catch(() => {
                                    Swal.fire(
                                        'Failed!',
                                        'Services gagal dihapus.',
                                        'error'
                                    )
                                });
                        }
                    })
                },
                apiDeleteServices(id) {
                    return new Promise((resolve, reject) => {
                        $.ajax({
                            url: "{!!  url("$url")  !!}/destroy_services/delete?" + $.param({
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
                apiFetchServices(tipe = 'aktif') {
                    return new Promise((resolve, reject) => {
                        fetch(`{!!  url("$url/ajax?action=services")  !!}`)
                            .then(response => response.json())
                            .then(data => {
                                resolve(data.results);
                            })
                            .catch(error => {
                                reject(error);
                            });
                    });
                },
            },
        }).component('services-table', {
            props: ['listServices'],
            methods: {
                handleDeleteServices(id) {
                    this.$emit('deleteServices', id);
                },
                handleEditServices(payload) {
                    window.upsertVue.show(payload);
                }
            },
            template: `
                <div class="table-responsive">
                    <table class="table">
                        <thead>
                        <tr>
                            <th>Image</th>
                            <th>Urut</th>
                            <th>Nama Layanan</th>
                            <th>Deskripsi Layanan</th>
                            <th>Aksi</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="services in listServices">
                            <td><img :src="services.image_url" alt="services" style="max-width: 100px"></td>
                            <td>@{{ services.order }}</td>
                            <td>
                                <div class="fw-bold">@{{ typeof services.title === 'object' && services.title !== null ? (services.title.id || '-') : (services.title || '-') }}</div>
                                <div v-if="typeof services.title === 'object' && services.title && services.title.en" class="text-muted fs-8">🇬🇧 @{{ services.title.en }}</div>
                            </td>
                            <td>
                                <div v-html="typeof services.description === 'object' && services.description !== null ? (services.description.id || '-') : (services.description || '-')"></div>
                                <div v-if="typeof services.description === 'object' && services.description && services.description.en" class="text-muted fs-8 mt-2 p-2 bg-light rounded">
                                    <span class="badge badge-light-primary fs-9 mb-1">🇬🇧 English:</span>
                                    <div v-html="services.description.en"></div>
                                </div>
                            </td>
                            <td>
                            <div class="d-flex flex-row gap-2">
                                 <button class="btn btn-sm btn-primary" @click="handleEditServices(services)" title="Edit Services">
                                    <i class="fas fa-edit"></i>
                                </button>
                                 <button class="btn btn-sm btn-danger" @click="handleDeleteServices(services.id)" title="Delete Services">
                                    <i class="fas fa-trash"></i>
                                </button>
                             </div>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
`
        }).mount('#servicesVue');
		
		window.upsertVue = createApp({
            data() {
                return {
                    title: '',
                    modal: null,
                    editorId: null,
                    editorEn: null,
                    mode: 'create',

                    payload: {
                        id: '',
                        order: 1,
                        title_id: '',
                        title_en: '',
                        description_id: '',
                        description_en: '',
                        image_url: '',
                        image_path: '',
                    }
                }
            },
            mounted() {
                this.modal = new bootstrap.Modal(document.getElementById('modalUpsert'), {
                    keyboard: false,
                    backdrop: 'static',
                });
				
                const quillOptions = {
                    modules: {
                        toolbar: [
                            ['bold', 'italic', 'underline', 'strike'],
                            ['link', 'video'],
                            [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'list': 'check' }],
                            [{ 'direction': 'rtl' }],
                            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                            [{ 'color': [] }, { 'background': [] }],
                            [{ 'font': [] }],
                            [{ 'align': [] }],
                        ]
                    },
                    theme: 'snow'
                };

                this.editorId = new Quill(this.$refs.editorId, quillOptions);
                this.editorEn = new Quill(this.$refs.editorEn, quillOptions);

                this.editorId.on('text-change', () => {
                    this.payload.description_id = this.editorId.getText().trim() ? this.editorId.root.innerHTML : '';
                });

                this.editorEn.on('text-change', () => {
                    this.payload.description_en = this.editorEn.getText().trim() ? this.editorEn.root.innerHTML : '';
                });
            },
            methods: {
                buildFormData() {
                    const formData = new FormData()

                    formData.append('_method', 'PUT')
                    formData.append('_token', "{{ csrf_token() }}")
                    formData.append('order', this.payload.order)
                    formData.append('title_id', this.payload.title_id || '')
                    formData.append('title_en', this.payload.title_en || '')
                    formData.append('description_id', this.payload.description_id || '')
                    formData.append('description_en', this.payload.description_en || '')
                    formData.append('id', this.payload.id)

                    if (this.mode === 'create') {
                        if (_.isNil(document.getElementById('modal-file-image').files[0])) {
                            throw new Error('Image tidak boleh kosong')
                        }
                        formData.append('image', document.getElementById('modal-file-image').files[0])
                    } else {
                        formData.append('image', document.getElementById('modal-file-image').files[0])
                        formData.append('image_old', this.payload.image_path)
                    }

                    return formData
                },
                show(payload) {
                    if (_.isNil(payload)) {
                        this.title = 'Tambah Services'
                        this.mode = 'create'
                        this.payload = {
                            id: '',
                            order: 1,
                            title_id: '',
                            title_en: '',
                            description_id: '',
                            description_en: '',
                            image_url: '',
                            image_path: '',
                        }
                        if (this.editorId) this.editorId.root.innerHTML = '';
                        if (this.editorEn) this.editorEn.root.innerHTML = '';
                    } else {
                        this.title = 'Perbarui Services'
                        this.mode = 'update'
                        const title = payload.title
                        const desc = payload.description
                        this.payload = {
                            id: payload.id,
                            order: payload.order,
                            title_id: typeof title === 'object' && title !== null ? (title.id || '') : (title || ''),
                            title_en: typeof title === 'object' && title !== null ? (title.en || '') : '',
                            description_id: typeof desc === 'object' && desc !== null ? (desc.id || '') : (desc || ''),
                            description_en: typeof desc === 'object' && desc !== null ? (desc.en || '') : '',
                            image_url: payload.image_url,
                            image_path: payload.image_path,
                        }
                        if (this.editorId) this.editorId.root.innerHTML = this.payload.description_id;
                        if (this.editorEn) this.editorEn.root.innerHTML = this.payload.description_en;
                    }
                    this.modal.show()
                },
                hide() {
                    this.modal.hide()
                },
                handleSubmit() {
                    // Swal confirmation
                    Swal.fire({
                        title: 'Apakah anda yakin?',
                        text: "Data akan disimpan",
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                    }).then((result) => {
                        if (result.isConfirmed) {
                            var formData = this.buildFormData();
                            let url = '';
                            if (this.mode === 'create') {
                                url = '{{ url("$url") }}/store_services/update'
                            } else {
                                url = '{{ url("$url") }}/update_services/update'
                            }
							
                            // show loading
                            Swal.fire({
                                title: 'Loading...',
                                allowOutsideClick: false,
                                didOpen: () => {
                                    Swal.showLoading()
                                },
                            })

                            $.ajax({
                                url: url,
                                method: 'POST',
                                data: formData,
								headers: {
									'X-CSRF-TOKEN': '{{ csrf_token() }}'
								},
                                processData: false,
                                contentType: false,
                                success: (res) => {
                                    this.hide()
                                    window.servicesVue.refreshListServices()

                                    // show success
                                    Swal.fire({
                                        title: 'Berhasil',
                                        text: res.message,
                                        icon: 'success',
                                        showCancelButton: false,
                                        confirmButtonColor: '#3085d6',
                                        confirmButtonText: 'OK',
                                    })
                                },
                                error: (err) => {
                                    this.hide()

                                    // show error
                                    Swal.fire({
                                        title: 'Gagal',
                                        text: err.responseJSON.message,
                                        icon: 'error',
                                        showCancelButton: false,
                                        confirmButtonColor: '#3085d6',
                                        confirmButtonText: 'OK',
                                    })
                                }
                            })
                        }
                    })
                },
            }
        }).mount('#modalUpsert');
    </script>
@endpush
