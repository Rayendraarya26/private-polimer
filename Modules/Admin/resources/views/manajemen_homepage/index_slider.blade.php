@extends("$view.index_layout")

@section('title', 'Manage Homepage Slider')

@section('child_content')
<div class="widget-content searchable-container list" id="sliderVue">
    <div class="form-with-tabs">
        <h5 class="card-title fw-semibold mb-4">
            Slider yang tampil pada hero section JIS
        </h5>

        <div class="d-flex flex-row-reverse">
            <button class="btn btn-primary btn-sm" @click="handleAddSlider()">
                <i class="fas fa-plus"></i> Tambah Slider
            </button>
        </div>
        <banner-table :list-slider="listSliderActive"
                                  @delete-banner="handleDeleteSlider"></banner-table>
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
        const { createApp } = Vue;

        window.sliderVue = createApp({
            data() {
                return {
                    listSliderActive: [],
                };
            },
            mounted() {
                this.refreshListSlider();
            },
            methods: {
                refreshListSlider() {
                    this.apiFetchSlider('aktif').then(data => {
                        this.listSliderActive = data;
                    });
                },
                handleAddSlider() {
                    window.upsertVue.show();
                },
                handleDeleteSlider(id) {
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
                                html: 'Sedang menghapus banner',
                                didOpen: () => {
                                    Swal.showLoading()
                                },
                            });

                            this.apiDeleteSlider(id)
                                .then(() => {
                                    this.refreshListSlider();
                                    Swal.fire(
                                        'Deleted!',
                                        'Banner berhasil dihapus.',
                                        'success'
                                    )
                                })
                                .catch(() => {
                                    Swal.fire(
                                        'Failed!',
                                        'Banner gagal dihapus.',
                                        'error'
                                    )
                                });
                        }
                    })
                },
                apiDeleteSlider(id) {
                    return new Promise((resolve, reject) => {
                        $.ajax({
                            url: "{!!  url("$url")  !!}/destroy_slider/delete?" + $.param({
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
                apiFetchSlider(tipe = 'aktif') {
                    return new Promise((resolve, reject) => {
                        fetch(`{!!  url("$url/ajax?action=slider")  !!}`)
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
        }).component('banner-table', {
            props: ['listSlider'],
            methods: {
                handleDeleteSlider(id) {
                    this.$emit('deleteBanner', id);
                },
                handleEditSlider(payload) {
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
                            <th>Title</th>
                            <th>Deskripsi</th>
                            <th>CTA Text</th>
                            <th>CTA URL</th>
                            <th>Aksi</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="slider in listSlider">
                            <td><img :src="slider.image_url" alt="banner" style="max-width: 100px"></td>
                            <td>@{{ slider.order }}</td>
                            <td>@{{ slider.title }}</td>
                            <td style="max-width:320px; white-space:normal;">@{{ slider.description }}</td>
                            <td>@{{ slider.cta_text || '-' }}</td>
                            <td style="max-width:260px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">@{{ slider.cta_url || '-' }}</td>
                            <td>
                            <div class="d-flex flex-row gap-2">
                                 <button class="btn btn-sm btn-primary" @click="handleEditSlider(slider)" title="Edit Banner">
                                    <i class="fas fa-edit"></i>
                                </button>
                                 <button class="btn btn-sm btn-danger" @click="handleDeleteSlider(slider.id)" title="Delete Banner">
                                    <i class="fas fa-trash"></i>
                                </button>
                             </div>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
`
        }).mount('#sliderVue');
    </script>
@endpush



@include("$view.upsert_slider")
