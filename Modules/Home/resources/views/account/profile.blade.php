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
                        <input type="text" class="form-control" v-model="form.name"/>
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
                        <input type="text" class="form-control" v-model="form.nik"/>
                        <small>akan digunakan untuk TTE</small>
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
                        <div class="input-group">
                            <input type="text" class="form-control" placeholder="Nomer Whatsapp, 6289...."
                                   v-model="form.whatsapp"/>
                            <span class="input-group-text cursor-pointer" @click="handleVerifyOtp"
                                  title="Anda hanya bisa mengirim 1x dalam 1 menit">
                            Verifikasi OTP</span>
                        </div>
                        <small>62 di depan, Contoh: 62812345678910</small>
                        <input type="text" class="form-control w-200px" placeholder="Kode OTP" v-show="showVerifyOtp"
                               v-model="form.whatsapp_otp"/>
                    </div>
                    <!--end::Col-->


                </div>
                <!--end::Row-->
                <div class="alert alert-danger" v-show="errorMessage">
                    @{{ errorMessage }}
                </div>

                <div class="offset-lg-4">
                    <button class="btn btn-sm btn-primary align-self-center" type="button"
                            @click="handleUpdateProfile">
                        <i class="fad fa-save"></i> Save
                    </button>
                </div>
            </form>
        </div>
    </div>
@endsection

@push('scripts')
    <script>
        const { createApp } = Vue;

        window.ProfileVue = createApp({
            data() {
                return {
                    showVerifyOtp: false,
                    errorMessage: null,

                    form: {
                        name: "{{ old('name', auth()->user()->name) }}",
                        nik: "{{ old('nik', auth()->user()->pegawai?->nik) }}",
                        whatsapp: "{{ old('whatsapp', auth()->user()->pegawai?->whatsapp) }}",
                        whatsapp_otp: ""
                    }
                }
            },
            methods: {
                formatWhatsapp(value) {
                    // sanitize whatsapp number
                    return value.replace(/[^0-9]/g, '');
                },
                async handleVerifyOtp() {
                    if (this.form.whatsapp !== "" && this.form.whatsapp === "{{ old('whatsapp', auth()->user()->pegawai?->whatsapp) }}") {
                        this.errorMessage = "Nomor Whatsapp tidak berubah";
                        return;
                    }
                    this.showVerifyOtp = true;

                    try {
                        const response = await axios.post("{{ url('/account/verify-whatsapp-otp') }}", {
                            whatsapp: this.formatWhatsapp(this.form.whatsapp)
                        })

                        swal.fire({
                            title: 'Berhasil',
                            text: response.data.message,
                            icon: 'success'
                        });
                    } catch (err) {
                        this.errorMessage = err.response.data.message;
                    }
                },
                handleUpdateProfile() {
                    axios.post("{{ url('/account/profile') }}", this.form)
                        .then(response => {
                            swal.fire({
                                title: 'Berhasil',
                                text: response.data.message,
                                icon: 'success'
                            }).then(() => {
                                window.location.reload();
                            });
                        })
                        .catch(error => {
                            this.errorMessage = error.response.data.message;
                        });
                }
            },
        }).mount('#kt_profile_details_view');
    </script>
@endpush
