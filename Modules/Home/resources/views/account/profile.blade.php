@extends('home::account.account')

@section('title', 'Profile')

@section('content_children')
    <div class="card mb-5 mb-xl-10" id="kt_profile_details_view">
        <!--begin::Card header-->
        <div class="card-header">
            <!--begin::Card title-->
            <div class="card-title m-0">
                <h3 class="fw-bold m-0">Profile Details</h3>
            </div>
            <!--end::Card title-->
            <!--begin::Action-->
            {{--<a href="{{ url('/account/update-profile') }}" class="btn btn-sm btn-primary align-self-center">
                <i class="fad fa-edit"></i> Edit Profile
            </a>--}}
            <!--end::Action-->
        </div>
        <!--begin::Card header-->
        <!--begin::Card body-->
        <div class="card-body p-9">
            <!--begin::Input group-->
            <div class="row mb-7">
                <!--begin::Label-->
                <label class="col-lg-4 fw-semibold text-muted">Email</label>
                <!--end::Label-->
                <!--begin::Col-->
                <div class="col-lg-8 fv-row">
                    <span class="fw-semibold text-gray-800 fs-6">{{ auth()->user()->email }}</span>
                </div>
                <!--end::Col-->
            </div>

            <!--begin::Input group-->
            <div class="row mb-7">
                <!--begin::Label-->
                <label class="col-lg-4 fw-semibold text-muted">Last Login</label>
                <!--end::Label-->
                <!--begin::Col-->
                <div class="col-lg-8 fv-row">
                    <span class="fw-semibold text-gray-800 fs-6">{{ auth()->user()->last_login }}</span>
                </div>
                <!--end::Col-->
            </div>
            <!--begin::Input group-->
            <div class="row mb-7">
                <!--begin::Label-->
                <label class="col-lg-4 fw-semibold text-muted">Last Update</label>
                <!--end::Label-->
                <!--begin::Col-->
                <div class="col-lg-8 fv-row">
                    <span class="fw-semibold text-gray-800 fs-6">{{ auth()->user()->updated_at }}</span>
                </div>
                <!--end::Col-->
            </div>

            <hr>

            <form method="post" action="{{ url()->current() }}">
                @csrf
                <!--begin::Row-->
                <div class="row mb-7">
                    <!--begin::Label-->
                    <label class="col-lg-4 fw-semibold text-muted">Full Name</label>
                    <!--end::Label-->
                    <!--begin::Col-->
                    <div class="col-lg-8">
                        <input type="text" class="form-control"
                               name="name" value="{{ old('name', auth()->user()->name) }}"/>
                    </div>
                    <!--end::Col-->
                </div>
                <!--end::Row-->
                <!--begin::Row-->
                <div class="row mb-7">
                    <!--begin::Label-->
                    <label class="col-lg-4 fw-semibold text-muted">NIK</label>
                    <!--end::Label-->
                    <!--begin::Col-->
                    <div class="col-lg-8">
                        <input type="text" class="form-control"
                               name="nik" value="{{ old('nik', auth()->user()->pegawai?->nik) }}"/>
                    </div>
                    <!--end::Col-->
                </div>
                <!--end::Row-->
                <!--begin::Row-->
                <div class="row mb-7">
                    <!--begin::Label-->
                    <label class="col-lg-4 fw-semibold text-muted">Whatsapp</label>
                    <!--end::Label-->
                    <!--begin::Col-->
                    <div class="col-lg-8">
                        <input type="text" class="form-control" name="whatsapp"
                               value="{{ old('whatsapp', auth()->user()->pegawai?->whatsapp) }}"/>
                        <small>Diawali dengan 62, Contoh: 62812345678910</small>
                    </div>
                    <!--end::Col-->
                </div>
                <!--end::Row-->

                <div class="offset-lg-4">
                    <button class="btn btn-sm btn-primary align-self-center" type="submit">
                        <i class="fad fa-save"></i> Save
                    </button>
                </div>
            </form>
        </div>
    </div>
@endsection
