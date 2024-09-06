@extends('layouts.app')

@section('title', 'Manage Homepage Services')

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
                <div class="mb-5 hover-scroll-x">
					<div class="d-grid">
						<ul class="nav nav-tabs">
							@foreach($key as $dt)
							<li class="nav-link @if($selected_key === strtolower($dt)) active @endif">
								<a class="nav-link @if($selected_key === strtolower($dt)) btn btn-text-danger @endif" href="{{ url("$url?data=".strtolower($dt)) }}">{{ $dt }}</a>
							</li>
							@endforeach
						</ul>
					</div>
				</div>

				<div class="tab-content">
					<div class="tab-pane fade show active" role="tabpanel">
						<div class="widget-content searchable-container list" id="servicesVue">
							<div class="form-with-tabs">
								<h5 class="card-title fw-semibold mb-4">
									Data Services yang tampil pada halaman utama 
									<a href="{{ config('app.frontend_url') }}" target="_blank">
										{{ config('app.frontend_url') }}
									</a>
								</h5>

								<div class="d-flex flex-row-reverse">
									<button class="btn btn-primary" @click="handleAddServices()">
										<i class="fas fa-plus"></i> Tambah Services
									</button>
								</div>
								<services-table :list-services="listServicesActive"
														  @delete-services="handleDeleteServices"></services-table>
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
                            <th>Judul</th>
                            <th>Aksi</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="services in listServices">
                            <td><img :src="services.image_url" alt="services" style="max-width: 100px"></td>
                            <td>@{{ services.order }}</td>
                            <td>@{{ services.title }}</td>
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
    </script>
@endpush



@include("$view.upsert_services")