@extends('layouts.app')

@section('title', 'Manage Homepage Partner')

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
						<div class="widget-content searchable-container list" id="partnerVue">
							<div class="form-with-tabs">
								<h5 class="card-title fw-semibold mb-4">
									Data Partner yang tampil pada halaman utama 
									<a href="{{ config('app.frontend_url') }}" target="_blank">
										{{ config('app.frontend_url') }}
									</a>
								</h5>

								<div class="d-flex flex-row-reverse">
									<button class="btn btn-primary" @click="handleAddPartner()">
										<i class="fas fa-plus"></i> Tambah Partner
									</button>
								</div>
								<partner-table :list-partner="listPartnerActive"
														  @delete-partner="handleDeletePartner"></partner-table>
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

        window.partnerVue = createApp({
            data() {
                return {
                    listPartnerActive: [],
                };
            },
            mounted() {
                this.refreshListPartner();
            },
            methods: {
                refreshListPartner() {
                    this.apiFetchPartner('aktif').then(data => {
                        this.listPartnerActive = data;
                    });
                },
                handleAddPartner() {
                    window.upsertVue.show();
                },
                handleDeletePartner(id) {
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
                                html: 'Sedang menghapus partner',
                                didOpen: () => {
                                    Swal.showLoading()
                                },
                            });

                            this.apiDeletePartner(id)
                                .then(() => {
                                    this.refreshListPartner();
                                    Swal.fire(
                                        'Deleted!',
                                        'Partner berhasil dihapus.',
                                        'success'
                                    )
                                })
                                .catch(() => {
                                    Swal.fire(
                                        'Failed!',
                                        'Partner gagal dihapus.',
                                        'error'
                                    )
                                });
                        }
                    })
                },
                apiDeletePartner(id) {
                    return new Promise((resolve, reject) => {
                        $.ajax({
                            url: "{!!  url("$url")  !!}/destroy_partner/delete?" + $.param({
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
                apiFetchPartner(tipe = 'aktif') {
                    return new Promise((resolve, reject) => {
                        fetch(`{!!  url("$url/ajax?action=partner")  !!}`)
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
        }).component('partner-table', {
            props: ['listPartner'],
            methods: {
                handleDeletePartner(id) {
                    this.$emit('deletePartner', id);
                },
                handleEditPartner(payload) {
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
                            <th>Nama</th>
                            <th>Aksi</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="partner in listPartner">
                            <td><img :src="partner.image_url" alt="partner" style="max-width: 100px"></td>
                            <td>@{{ partner.order }}</td>
                            <td>@{{ partner.title }}</td>
                            <td>
                            <div class="d-flex flex-row gap-2">
                                 <button class="btn btn-sm btn-primary" @click="handleEditPartner(partner)" title="Edit Partner">
                                    <i class="fas fa-edit"></i>
                                </button>
                                 <button class="btn btn-sm btn-danger" @click="handleDeletePartner(partner.id)" title="Delete Partner">
                                    <i class="fas fa-trash"></i>
                                </button>
                             </div>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
`
        }).mount('#partnerVue');
    </script>
@endpush



@include("$view.upsert_partner")