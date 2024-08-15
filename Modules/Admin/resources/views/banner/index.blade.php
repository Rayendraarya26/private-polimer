@extends('layouts.app')

@section('title', 'Setting Slider')

@section('content')
    <div class="card" id="kt_card">
        <!--begin::Card body-->
        <div class="card-body">
            <div class="widget-content searchable-container list" id="sliderVue">
                <div class="form-with-tabs">
                    <h5 class="card-title fw-semibold mb-4">
                        Banner yang tampil pada halaman utama
                        <a href="{{ config('app.frontend_url') }}" target="_blank">
                            {{ config('app.frontend_url') }}
                        </a>
                    </h5>
                    <div class="card">
                        <div class="d-flex flex-row-reverse">
                            <button class="btn btn-primary" @click="handleAddSlider()">
                                <i class="fas fa-plus"></i> Tambah Banner
                            </button>
                        </div>
                        <ul class="nav nav-pills user-profile-tab border-bottom" id="pills-tab" role="tablist">
                            <li class="nav-item" role="presentation">
                                <button
                                    class="nav-link position-relative rounded-0 active d-flex align-items-center justify-content-center bg-transparent fs-3 py-6 fw-bold"
                                    id="banner-active" data-bs-toggle="pill"
                                    data-bs-target="#pills-banner-active"
                                    type="button" role="tab" aria-controls="pills-banner-active" aria-selected="true">
                                    Aktif
                                </button>
                            </li>
                            <li class="nav-item" role="presentation">
                                <button
                                    class="nav-link position-relative rounded-0 d-flex align-items-center justify-content-center bg-transparent fs-3 py-6 fw-bold"
                                    id="pills-banner-upcoming-tab" data-bs-toggle="pill"
                                    data-bs-target="#pills-banner-upcoming"
                                    type="button" role="tab" aria-controls="pills-banner-upcoming"
                                    aria-selected="false">
                                    Akan Datang
                                </button>
                            </li>
                            <li class="nav-item" role="presentation">
                                <button
                                    class="nav-link position-relative rounded-0 d-flex align-items-center justify-content-center bg-transparent fs-3 py-6 fw-bold"
                                    id="pills-banner-expited-tab" data-bs-toggle="pill"
                                    data-bs-target="#pills-banner-expited" type="button"
                                    role="tab" aria-controls="pills-banner-expited" aria-selected="false"> Kadaluarsa/Lewat
                                </button>
                            </li>
                        </ul>
                        <div class="card-body p-4">
                            <div class="tab-content" id="pills-tabContent">
                                <div class="tab-pane fade show active" id="pills-banner-active" role="tabpanel"
                                     aria-labelledby="pills-banner-active-tab" tabindex="0">
                                    <banner-table :list-slider="listSliderActive"
                                                  @delete-banner="handleDeleteSlider"></banner-table>
                                </div>
                                <div class="tab-pane fade" id="pills-banner-upcoming" role="tabpanel"
                                     aria-labelledby="pills-banner-upcoming-tab" tabindex="0">
                                    <banner-table :list-slider="listSliderUpcoming"
                                                  @delete-banner="handleDeleteSlider"></banner-table>
                                </div>
                                <div class="tab-pane fade" id="pills-banner-expited" role="tabpanel"
                                     aria-labelledby="pills-banner-expited-tab" tabindex="0">
                                    <banner-table :list-slider="listSliderExpired"
                                                  @delete-banner="handleDeleteSlider"></banner-table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
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
                    listSliderUpcoming: [],
                    listSliderExpired: [],
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
                    this.apiFetchSlider('akan-datang').then(data => {
                        this.listSliderUpcoming = data;
                    });
                    this.apiFetchSlider('kadaluarsa').then(data => {
                        this.listSliderExpired = data;
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
                            url: `{!!  url("$url")  !!}/${id}`,
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
                        fetch(`{!!  url("$url/ajax?action=slider&tipe=")  !!}${tipe}`)
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
                renderSliderDate(slider) {
                    if (_.isEmpty(slider.start_at) && _.isEmpty(slider.end_at)) {
                        return '-';
                    } else if (_.isEmpty(slider.start_at) && !_.isEmpty(slider.end_at)) {
                        return `Sampai ${humanDateTime(slider.end_at)}`;
                    } else if (!_.isEmpty(slider.start_at) && _.isEmpty(slider.end_at)) {
                        return `Dari ${humanDateTime(slider.start_at)}`;
                    } else {
                        return `${humanDateTime(slider.start_at)} - ${humanDateTime(slider.end_at)}`;
                    }
                },
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
                            <th>Deskripsi</th>
                            <th>Link</th>
                            <th>Tanggal</th>
                            <th>Aksi</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="slider in listSlider">
                            <td><img :src="slider.image_url" alt="banner" style="max-width: 100px"></td>
                            <td>@{{ slider.description }}</td>
                            <td>@{{ slider.link }}</td>
                            <td>@{{ renderSliderDate(slider) }}</td>
                            <td>
                            <div class="d-flex flex-row gap-2">
                                 <button class="btn btn-sm btn-primary" @click="handleEditSlider(slider)">
                                    <i class="fas fa-edit"></i>
                                </button>
                                 <button class="btn btn-sm btn-danger" @click="handleDeleteSlider(slider.id)">
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


@include("$view.upsert")
