@extends("$view.index_layout")

@section('title', 'Manage Homepage Social Media')

@section('child_content')
    <div class="widget-content searchable-container list" id="socialMediaVue">
        <div class="form-with-tabs">
            <h5 class="card-title fw-semibold mb-4">
                Data Social Media yang tampil pada landing page JIS
            </h5>

            <div class="d-flex flex-row-reverse">
                <button class="btn btn-primary btn-sm" @click="handleAddSocialMedia()">
                    <i class="fas fa-plus"></i> Tambah Social Media
                </button>
            </div>
            <social-media-table :list-social-media="listSocialMediaActive" @delete-social-media="handleDeleteSocialMedia"></social-media-table>
        </div>
    </div>
@endsection


@push('styles')
    <link rel="stylesheet" href="{{ asset('assets/plugins/custom/sweetalert2/dist/sweetalert2.min.css') }}">
    <link rel="stylesheet" href="{{ asset('assets/plugins/custom/flatpickr/flatpickr.min.css') }}">
@endpush

@push('scripts')
    <script src="{{ asset('assets/plugins/custom/sweetalert2/dist/sweetalert2.min.js') }}"></script>
    <script src="{{ asset('assets/plugins/custom/flatpickr/flatpickr.min.js') }}"></script>
    <script>
        const {
            createApp
        } = Vue;

        window.socialMediaVue = createApp({
            data() {
                return {
                    listSocialMediaActive: [],
                };
            },
            mounted() {
                this.refreshListSocialMedia();
            },
            methods: {
                refreshListSocialMedia() {
                    this.apiFetchSocialMedia('aktif').then(data => {
                        this.listSocialMediaActive = data;
                    });
                },
                handleAddSocialMedia() {
                    window.upsertVue.show();
                },
                handleDeleteSocialMedia(id) {
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
                                html: 'Sedang menghapus social media',
                                didOpen: () => {
                                    Swal.showLoading()
                                },
                            });

                            this.apiDeleteSocialMedia(id)
                                .then(() => {
                                    this.refreshListSocialMedia();
                                    Swal.fire(
                                        'Deleted!',
                                        'Social Media berhasil dihapus.',
                                        'success'
                                    )
                                })
                                .catch(() => {
                                    Swal.fire(
                                        'Failed!',
                                        'Social Media gagal dihapus.',
                                        'error'
                                    )
                                });
                        }
                    })
                },
                apiDeleteSocialMedia(id) {
                    return new Promise((resolve, reject) => {
                        $.ajax({
                            url: "{!! url("$url") !!}/destroy_social_media/delete?" + $.param({
                                "id": `${id}`
                            }),
                            type: 'DELETE',
                            processData: false,
                            contentType: false,
                            headers: {
                                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                            },
                            success: function(response) {
                                resolve(response);
                            },
                            error: function(xhr) {
                                reject(xhr);
                            }
                        });
                    });
                },
                apiFetchSocialMedia(tipe = 'aktif') {
                    return new Promise((resolve, reject) => {
                        fetch(`{!! url("$url/ajax?action=social_media") !!}`)
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
        }).component('social-media-table', {
            props: ['listSocialMedia'],
            methods: {
                handleDeleteSocialMedia(id) {
                    this.$emit('deleteSocialMedia', id);
                },
                handleEditSocialMedia(payload) {
                    window.upsertVue.show(payload);
                }
            },
            template: `
                <div class="table-responsive">
                    <table class="table">
                        <thead>
                        <tr>
                            <th>Urut</th>
                            <th>Icon</th>
                            <th>Nama Social Media</th>
                            <th>URL</th>
                            <th>Aksi</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="socialMedia in listSocialMedia">
                            <td>@{{ socialMedia.order }}</td>
                            <td><i :class="socialMedia.icon_class" style="font-size: 24px;"></i></td>
                            <td>@{{ socialMedia.title }}</td>
                            <td>@{{ socialMedia.url }}</td>
                            <td>
                            <div class="d-flex flex-row gap-2">
                                 <button class="btn btn-sm btn-primary" @click="handleEditSocialMedia(socialMedia)" title="Edit Social Media">
                                    <i class="fas fa-edit"></i>
                                </button>
                                 <button class="btn btn-sm btn-danger" @click="handleDeleteSocialMedia(socialMedia.id)" title="Delete Social Media">
                                    <i class="fas fa-trash"></i>
                                </button>
                             </div>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
`
        }).mount('#socialMediaVue');
    </script>
@endpush

@include("$view.upsert_social_media")
