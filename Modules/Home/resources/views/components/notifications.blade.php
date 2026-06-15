<div class="app-navbar-item ms-1 ms-md-4">
    <!--begin::Menu- wrapper-->
    <div class="btn btn-icon btn-custom btn-icon-muted btn-active-light btn-active-color-primary w-35px h-35px"
         data-kt-menu-trigger="{default: 'click', lg: 'hover'}" data-kt-menu-attach="parent"
         data-kt-menu-placement="bottom-end" id="kt_menu_item_wow">
        <div>
            <i class="position-relative">
                <i class="fa-duotone fa-bell fs-2 {{ ($navTotal ?? 0) > 0 ? 'text-primary' : '' }}"></i>
                @if(($navTotal ?? 0) > 0)
                    <span class="position-absolute top-100 start-100 translate-middle badge badge-circle badge-primary">
                        {{$navTotal}}
                    </span>
                @endif
            </i>
        </div>

    </div>

    <!-- MENU -->
    <div class="menu menu-sub menu-sub-dropdown menu-column w-350px w-lg-375px"
         data-kt-menu="true">

        <div class="d-flex flex-column bgi-no-repeat rounded-top"
             style="background-image:url('{{asset('assets/media/misc/menu-header-bg.jpg')}}')">

            <h3 class="text-white fw-semibold px-9 mt-10 mb-6">
                Notifikasi
                @if(($navTotal ?? 0) > 0)
                    <span class="fs-8 opacity-75 ps-3">{{ $navTotal }} belum terbaca</span>
                @endif
            </h3>
            <!--end::Title-->
        </div>

        <div class="tab-content">
            <!--begin::Tab panel-->
            <div class="tab-pane fade show active">
                @if(($navTotal ?? 0) == 0)
                    <div class="d-flex flex-column px-9">
                        <!--begin::Section-->
                        <div class="pt-10 pb-5">
                            <!--begin::Title-->
                            <h3 class="text-dark text-center fw-bold">Kosong</h3>
                            <!--end::Title-->
                            <!--begin::Text-->
                            <div class="text-center text-gray-600 fw-semibold pt-1">
                                Belum ada notifikasi baru yang masuk.
                            </div>
                            <!--end::Text-->
                        </div>
                        <!--end::Section-->
                    </div>

                @else
                    <div class="scroll-y mh-325px my-5 px-8">
                        @foreach($navNotif ?? [] as $n)
                            <a href="{{ url('/notifications/open/' . $n->id) }}"
                               class="text-gray-800 text-hover-primary fw-semibold">

                                <div class="d-flex flex-stack py-4 {{ $n->is_read == 'no' ? 'text-primary' : '' }}">

                                    <div class="d-flex align-items-center me-2">
                                        {{ \Illuminate\Support\Str::limit($n->title, 30, '...') }}
                                    </div>

                                    <span class="badge {{ $n->is_read == 'no' ? 'badge-primary' : 'bg-light' }} fs-8">
                                        {{ $n->created_at->diffForHumans() }}
                                    </span>

                                </div>
                                <!--end::Item-->
                            </a>
                        @endforeach
                    </div>
                @endif
                <!--end::Wrapper-->


                <div class="py-3 text-center border-top">
                    <a href="{{ route('notifications') }}"
                       class="btn btn-color-gray-600 btn-active-color-primary">
                        Lihat Semua
                        <i class="fa-solid fa-arrow-right"></i>
                    </a>
                </div>
            </div>
            <!--end::Tab panel-->
        </div>
        <!--end::Tab content-->
    </div>
</div>
