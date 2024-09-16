@extends('layouts.app')

@section('title', 'Detail Pertanyaan Pelanggan')

@section('content')
    <!--begin::Inbox App - Messages -->
    <div class="d-flex flex-column flex-lg-row">
        <!--begin::Sidebar-->
        <div class="d-none d-lg-flex flex-column flex-lg-row-auto w-100 w-lg-275px" data-kt-drawer="true"
             data-kt-drawer-name="inbox-aside" data-kt-drawer-activate="{default: true, lg: false}"
             data-kt-drawer-overlay="true" data-kt-drawer-width="225px" data-kt-drawer-direction="start"
             data-kt-drawer-toggle="#kt_inbox_aside_toggle">
            <!--begin::Sticky aside-->
            <div class="card card-flush mb-0" data-kt-sticky="true" data-kt-sticky-name="inbox-aside-sticky"
                 data-kt-sticky-offset="{default: false, xl: '100px'}" data-kt-sticky-width="{lg: '275px'}"
                 data-kt-sticky-left="auto" data-kt-sticky-top="100px" data-kt-sticky-animation="false"
                 data-kt-sticky-zindex="95">
                <!--begin::Aside content-->
                <div class="card-body">
                    <!--begin::Menu-->
                    <div
                        class="menu menu-column menu-rounded menu-state-bg menu-state-title-primary menu-state-icon-primary menu-state-bullet-primary mb-10">
                        <!--begin::Menu item-->
                        <div class="menu-item mb-3">
                            <!--begin::Inbox-->
                            <a href="{{ url("$url") }}"
                               class="menu-link @if ($data->status != 'closed') ? active :  @endif">
                                <span class="menu-icon">
                                    <i class="fa-solid fa-comment fs-2 me-3"></i>
                                        <span class="path1"></span>
                                        <span class="path2"></span>
                                    </i>
                                </span>
                                <span class="menu-title fw-bold">Pertanyaan Aktif (Opened)</span>
                                @if($total_new > 0)
                                    <span class="badge badge-light-success">{{$total_new}}</span>
                                @endif
                            </a>
                            <!--end::Inbox-->
                        </div>
                        <!--end::Menu item-->
                        <!--begin::Menu item-->
                        <div class="menu-item mb-3">
                            <!--begin::Marked-->
                            <a href="{{ url("$url?status_message=closed") }}"
                               class="menu-link @if ($data->status == 'closed') ? active :  @endif">
                                <span class="menu-icon">
                                    <i class="fa-sharp-duotone fa-solid fa-comments fs-2 me-3">
                                        <span class="path1"></span>
                                        <span class="path2"></span>
                                    </i>
                                </span>
                                <span class="menu-title fw-bold">Arsip Pertanyaan (Closed)</span>
                            </a>
                            <!--end::Marked-->
                        </div>
                        <!--end::Menu item-->
                    </div>
                    <!--end::Menu-->
                </div>
                <!--end::Aside content-->
            </div>
            <!--end::Sticky aside-->
        </div>
        <!--end::Sidebar-->
        <!--begin::Content-->
        <div class="flex-lg-row-fluid ms-lg-7 ms-xl-10">
            <div class="card" id="kt_chat_messenger">
                <!--begin::Card header-->
                <div class="card-header" id="kt_chat_messenger_header">
                    <!--begin::Title-->
                    <div class="card-title">
                        <div class="d-flex justify-content-center flex-column me-3">
                            <h4 class="">Topik Pertanyaan : {{$data->topik}}</h4>
                            <!--begin::Info-->
                            <div class="mb-0 lh-1">
                                <span class="badge badge-success badge-circle w-10px h-10px me-1"></span>
                                <span class="fs-7 fw-semibold text-muted">Tiket : {{$data->id}}</span>
                            </div>
                            <!--end::Info-->
                        </div>
                    </div>
					@if ($data->status !== 'closed')
                    <!--end::Title-->
                    <div class="card-toolbar">
                        <!--begin::Menu-->
                        <button href="#" data-kt-btn-closed="closed_chat"
                                class="btn btn-danger btn-sm px-3 text-uppercase">
                            Tutup Pertanyaan
                        </button>
                        <!--end::Menu-->
                    </div>
					@else
						<div class="card-toolbar">
                        <!--begin::Menu-->
                        <button href="#" 
                                class="btn btn-warning btn-sm px-3 text-uppercase">
                            Closed
                        </button>
                        <!--end::Menu-->
                    </div>
					@endif
                </div>
                <!--end::Card header-->

                <!--begin::Card body-->
                <div class="card-body" id="kt_chat_messenger_body">
                    <!--begin::Messages-->
                    <div class="scroll-y me-n5 pe-5 h-300px h-lg-auto" data-kt-element="messages" data-kt-scroll="true"
                         data-kt-scroll-activate="{default: false, lg: true}" data-kt-scroll-max-height="auto"
                         data-kt-scroll-dependencies="#kt_header, #kt_app_header, #kt_app_toolbar, #kt_toolbar, #kt_footer, #kt_app_footer, #kt_chat_messenger_header, #kt_chat_messenger_footer"
                         data-kt-scroll-wrappers="#kt_content, #kt_app_content, #kt_chat_messenger_body"
                         data-kt-scroll-offset="5px" style="max-height: 225px;">
                        <!--end::Message(in)-->
                        @foreach($data->pesans as $pesan)
                            <!--begin::Message(out)-->
                            <div
                                class="d-flex @if($pesan->created_by !== $data->pelanggan->user->id) justify-content-end @else justify-content-start @endif mb-10 ">
                                <!--begin::Wrapper-->
                                <div
                                    class="d-flex flex-column @if($pesan->created_by !== $data->pelanggan->user->id) align-items-end @else align-items-start @endif">
                                    <!--begin::User-->
                                    <div class="d-flex align-items-center mb-2">
                                        @if($pesan->created_by == $data->pelanggan->user->id)
                                            <!--begin::Avatar-->
                                            <div class="symbol  symbol-35px symbol-circle ">
                                                <div class="symbol-label bg-light-danger">
                                                    <span class="text-danger">U</span>
                                                </div>
                                            </div><!--end::Avatar-->
                                        @endif
                                        <!--begin::Details-->
                                        <div class="me-3">
                                            @if($pesan->created_by !== $data->pelanggan->user->id)
                                                <span class="text-muted fs-7 mb-1">{{$pesan->user->created_at}}</span>
                                            @endif
                                            <a href="#"
                                               class="fs-5 fw-bold text-gray-900 text-hover-primary ms-1">{{$pesan->user->name}}</a>
                                            @if($pesan->created_by == $data->pelanggan->user->id)
                                                <span class="text-muted fs-7 mb-1">{{$pesan->user->created_at}}</span>
                                            @endif
                                        </div>
                                        <!--end::Details-->
                                        @if($pesan->created_by !== $data->pelanggan->user->id)
                                            <!--begin::Avatar-->
                                            <div class="symbol  symbol-35px symbol-circle ">
                                                <div class="symbol-label bg-light-warning">
                                                    <span class="text-danger">B</span>
                                                </div>
                                            </div>
                                            <!--end::Avatar-->
                                        @endif
                                    </div>
                                    <!--end::User-->

                                    <!--begin::Text-->
                                    <div
                                        class="p-5 rounded @if($pesan->created_by !== $data->pelanggan->user->id) bg-light-primary @else bg-light-info @endif text-gray-900 fw-semibold mw-lg-400px @if($pesan->created_by !== $data->pelanggan->user->id) text-end @else text-start @endif"
                                        data-kt-element="message-text">
                                        {{$pesan->pesan}}
                                    </div>
                                    <!--end::Text-->
                                </div>
                                <!--end::Wrapper-->
                            </div>
                            <!--end::Message(out)-->
                        @endforeach
                    </div>
                    <!--end::Messages-->
                </div>
                <!--end::Card body-->
				@if ($data->status !== 'closed')
                <!--begin::Card footer-->
                <div class="card-footer pt-4" id="kt_chat_messenger_footer">
                    @if ($errors->any())
                        <div class="alert alert-danger" role="alert">
                            {!! implode('', $errors->all('<li>:message</li>')) !!}
                        </div>
                    @endif
                    @if(session('message'))
                        <div class="alert alert-success" role="alert">
                            {{ session('message') }}
                        </div>
                    @endif
                    <form method="post" action="{{ $data ? url("$url/$data->id") : url("$url") }}"
                          enctype="multipart/form-data" onsubmit="$('#btnSubmit').attr('disabled', true)">
                        @csrf
                        @method('POST')
                        <!--begin::Input-->
                        <textarea class="form-control mb-3" rows="3" name="pesan"
                                  placeholder="Type a message"></textarea>
                        <!--end::Input-->

                        <!--begin:Toolbar-->
                        <div class="d-flex flex-stack">
                            <!--begin::Send-->
                            <button class="btn btn-primary" type="submit" id="btnSubmit">Kirim</button>
                            <!--end::Send-->
                        </div>
                    </form>
                    <!--end::Toolbar-->
                </div>
                <!--end::Card footer-->
				@else
				<div class="card-body">
					<div class="hover-scroll-overlay-y pe-6 me-n6" style="min-height: 100px">
						<div class="border border-dashed border-gray-300 rounded px-7 py-3 mb-6">                 
							<div class="mb-6">
							@if ($data->is_review !== 'no')
								<!--begin::Text-->
								<span class="fw-semibold text-gray-600 fs-6 mb-8 d-block">
									{{$data->testimoni}}
								</span>
								<!--end::Text-->

								<!--begin::Stats-->
								<div class="d-flex">
									<!--begin::Stat-->
									<div class="border border-gray-300 border-dashed rounded min-w-100px w-100 py-2 px-4 me-6 mb-3">
										<!--begin::Date-->                                     
										<span class="fs-6 text-gray-700 fw-bold">Closed By :</span>                                
										<!--end::Date-->

										<!--begin::Label-->
										<div class="fw-semibold text-gray-500">{{$data->user_closed->name}}</div>
										<!--end::Label-->
									</div>
									<!--end::Stat-->

									<!--begin::Stat-->
									<div class="border border-gray-300 border-dashed rounded min-w-100px w-100 py-2 px-4 mb-3">
										<!--begin::Number-->                                 
										<span class="fs-6 text-gray-700 fw-bold">Rating</span>                               
										<!--end::Number-->

										<!--begin::Label-->
										<div class="fw-semibold text-gray-500">{{$data->rating}} <i class="fa-regular fa-stars"></i></div>
										<!--end::Label-->
									</div>
									<!--end::Stat-->                             
								</div>
								<!--end::Stats-->
								@else
									<span class="badge py-3 px-4 fs-7 badge-light-warning">Belum Di-Review</span>
								@endif
							</div>
						</div>
					</div>
				</div>
				@endif
            </div>
            <!--end::Content-->
        </div>
    </div>
    <!--end::Inbox App - Messages -->
@endsection

@push('scripts')
    <script>
        "use strict";

        // Class definition
        const KTChat = function () {
            // Shared variables
            let table;
            let dt;
			@if ($data->status !== 'closed')
            const swalActionError = (message) => {
                Swal.fire({
                    text: message,
                    icon: "error",
                    buttonsStyling: false,
                    confirmButtonText: "Ok, tutup!",
                    customClass: {
                        confirmButton: "btn fw-bold btn-primary",
                    }
                });
            }

            const swalActionSuccess = (message) => {
                Swal.fire({
                    text: message,
                    icon: "success",
                    buttonsStyling: false,
                    confirmButtonText: "Ok, tutup!",
                    customClass: {
                        confirmButton: "btn fw-bold btn-primary",
                    }
                }).then(function () {
                    window.location = "{{url("$url")}}";
                });

                // Remove header checked box
                const container = document.querySelector('#kt_datatable');
                const headerCheckbox = container.querySelectorAll('[type="checkbox"]')[0];
                headerCheckbox.checked = false;
            }

            const apiClosed = () => {
                axios.put(`{{ url("$url") }}/{{$data->id}}/closed`)
                    .then(res => {
                        swalActionSuccess("Berhasil menutup pertanyaan tiket : {{$data->id}}");
                    })
                    .catch(err => {
                        swalActionError(err.response.data.message);
                    });
            }

            // Delete customer
            const handleClosed = () => {
                // Select all delete buttons
                const closedChat = document.querySelectorAll('[data-kt-btn-closed="closed_chat"]');

                closedChat.forEach(d => {
                    // Delete button on click
                    d.addEventListener('click', function (e) {
                        e.preventDefault();
                        Swal.fire({
                            text: "Anda yakin untuk menutup percakapan dengan nomor tiket {{$data->id}}?",
                            icon: "warning",
                            showCancelButton: true,
                            buttonsStyling: false,
                            confirmButtonText: "Ya, Tutup!",
                            cancelButtonText: "Batal",
                            customClass: {
                                confirmButton: "btn fw-bold btn-danger",
                                cancelButton: "btn fw-bold btn-active-light-primary"
                            }
                        }).then(function (result) {
                            if (result.value) {
                                apiClosed()
                            }
                        });
                    })
                });
            }
			@endif

            // Public methods
            return {
                init: function () {
					@if ($data->status !== 'closed')
                    handleClosed();
					@endif
                },
            }
        }();

        // On document ready
        KTUtil.onDOMContentLoaded(function () {
            KTChat.init();
        });
    </script>
@endpush

