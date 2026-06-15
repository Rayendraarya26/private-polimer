@extends('layouts.auth')

@section('title', 'Register')

@section('content')
    <!--begin::Form-->
    <form
        class="form w-100"
        novalidate="novalidate"
        id="kt_sign_up_form"
        action="{{ url()->current() }}"
        method="post"
    >
        @csrf

        <input name='recaptcha' type='hidden'/>

        <div class="w-100 d-flex flex-column gap-10">
            <div class="text-center fs-1 fw-semibold">Pendaftaran</div>

            <div id="showError" class="alert alert-danger d-none" role="alert">
                <div class="alert-text font-weight-bold"></div>
            </div>

            <div id="kt_sign_up_client_type" class="w-100 d-flex flex-column gap-5">
                <div class="w-100 d-flex flex-column gap-3 fv-row">
                    <div class="fs-4 fw-medium">Pilih Jenis Klien</div>
                    <div class="w-100 d-flex gap-3 form-check">
                        <input
                            type="radio"
                            name="client_type"
                            value="{{ \App\Enums\PelangganJenisPelanggan::BADAN_USAHA->value }}"
                            id="client_type_badan_usaha"
                            class="form-check-input border-dark"
                        >
                        <label
                            class="form-check-label text-dark"
                            for="client_type_badan_usaha"
                        >
                            {{ \App\Enums\PelangganJenisPelanggan::BADAN_USAHA->value }}
                        </label>
                    </div>
                    <div class="w-100 d-flex gap-3 form-check">
                        <input
                            type="radio"
                            name="client_type"
                            value="{{ \App\Enums\PelangganJenisPelanggan::INSTANSI_PEMERINTAH->value }}"
                            id="client_type_instansi"
                            class="form-check-input border-dark"
                        >
                        <label
                            class="form-check-label text-dark"
                            for="client_type_instansi"
                        >
                            {{ \App\Enums\PelangganJenisPelanggan::INSTANSI_PEMERINTAH->value }}
                        </label>
                    </div>
                    <div class="w-100 d-flex gap-3 form-check">
                        <input
                            type="radio"
                            name="client_type"
                            value="{{ \App\Enums\PelangganJenisPelanggan::PERORANGAN->value }}"
                            id="client_type_perorangan"
                            class="form-check-input border-dark"
                        >
                        <label
                            class="form-check-label text-dark"
                            for="client_type_perorangan"
                        >
                            {{ \App\Enums\PelangganJenisPelanggan::PERORANGAN->value }}
                        </label>
                    </div>
                </div>
                <button
                    type="button"
                    id="kt_sign_up_next"
                    class="btn btn-primary"
                >
                    <span class="indicator-label">Selanjutnya</span>
                </button>
                <div class="w-100 text-center fw-semibold">
                    Sudah Punya Akun? <a class="text-primary" href="{{ route('auth.login') }}">Masuk</a>
                </div>
            </div>

            <div id="kt_sign_up_data" class="w-100 d-flex flex-column align-items-stretch gap-5">
                <div class="w-100 d-flex flex-column flex-md-row gap-5">
                    <div class="w-100 d-flex flex-column gap-3">
                        <div class="fs-3 fw-medium">Data Umum</div>
                        <div class="fv-row">
                            <input
                                type="text"
                                placeholder="Nama"
                                name="general_name"
                                autocomplete="off"
                                aria-label="general_name"
                                autofocus
                                class="form-control bg-transparent"
                            />
                        </div>

                        <div class="fv-row">
                            <input
                                type="email"
                                placeholder="Email"
                                name="general_email"
                                autocomplete="off"
                                aria-label="general_email"
                                class="form-control bg-transparent"
                            />
                        </div>
                        <div class="fv-row">
                            <input
                                type="number"
                                inputmode="numeric"
                                placeholder="Nomor Telepon"
                                name="general_phone"
                                autocomplete="off"
                                aria-label="general_phone"
                                class="form-control bg-transparent"
                            />
                        </div>
                        <div class="fv-row">
                            <input
                                type="number"
                                inputmode="numeric"
                                placeholder="Nomor Whatsapp"
                                name="general_whatsapp_number"
                                autocomplete="off"
                                aria-label="general_whatsapp_number"
                                class="form-control bg-transparent"
                            />
                        </div>
                        <div class="fv-row">
                            <input
                                type="text"
                                inputmode="numeric"
                                placeholder="Nomor FAX"
                                name="general_fax"
                                autocomplete="off"
                                aria-label="general_fax"
                                class="form-control bg-transparent"
                            />
                        </div>
                    </div>

                    <div class="w-100 d-flex flex-column gap-5">
                        <div class="w-100 d-flex flex-column gap-3">
                            <div class="fs-3 fw-medium">Penanggung Jawab</div>
                            <div class="fv-row">
                                <input
                                    type="text"
                                    placeholder="Nama Penanggung jawab"
                                    name="person_responsible_name"
                                    autocomplete="off"
                                    aria-label="person_responsible_name"
                                    autofocus
                                    class="form-control bg-transparent"
                                />
                            </div>
                            <div class="fv-row">
                                <input
                                    type="email"
                                    placeholder="Email"
                                    name="person_responsible_email"
                                    autocomplete="off"
                                    aria-label="person_responsible_email"
                                    class="form-control bg-transparent"
                                />
                            </div>
                            <div class="fv-row">
                                <input
                                    type="number"
                                    inputmode="numeric"
                                    placeholder="Nomor Whatsapp"
                                    name="person_responsible_whatsapp_number"
                                    autocomplete="off"
                                    aria-label="person_responsible_whatsapp_number"
                                    class="form-control bg-transparent"
                                />
                            </div>
                        </div>

                        <div class="w-100 d-flex flex-column gap-3">
                            <div class="fs-3 fw-medium">Akun</div>
                            <div class="fv-row">
                                <input
                                    type="email"
                                    placeholder="Email"
                                    name="account_email"
                                    autocomplete="off"
                                    aria-label="account_email"
                                    class="form-control bg-transparent"
                                />
                            </div>
                            <div class="fv-row">
                                <div class="input-group">
                                    <input
                                        type="password"
                                        placeholder="Password"
                                        name="account_password"
                                        autocomplete="off"
                                        aria-label="account_password"
                                        class="form-control bg-transparent"
                                    />
                                    <span id="password-toggle" class="input-group-text" style="cursor: pointer;">
                    <i id="show-password-icon" class="fas fa-eye d-none"></i>
                    <i id="hide-password-icon" class="fas fa-eye-slash"></i>
                  </span>
                                </div>
                            </div>
                            <div class="fv-row">
                                <div class="input-group">
                                    <input
                                        type="password"
                                        placeholder="Ulangi Password"
                                        name="account_password_confirmation"
                                        autocomplete="off"
                                        aria-label="account_password_confirmation"
                                        class="form-control bg-transparent"
                                    />
                                    <span id="password-retype-toggle" class="input-group-text" style="cursor: pointer;">
                    <i id="show-password-retype-icon" class="fas fa-eye d-none"></i>
                    <i id="hide-password-retype-icon" class="fas fa-eye-slash"></i>
                  </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    class="w-100 d-flex flex-column flex-md-row justify-content-between align-items-stretch align-items-md-center gap-3">
                    <button
                        type="button"
                        id="kt_sign_up_back"
                        class="btn btn-secondary"
                    >
                        <span class="indicator-label">Sebelumnya</span>
                    </button>
                    <button
                        type="submit"
                        id="kt_sign_up_submit"
                        class="btn btn-primary"
                    >
                        <span class="indicator-label">Buat Akun</span>
                        <span class="indicator-progress">Memproses...
                            <span class="spinner-border spinner-border-sm align-middle ms-2"></span>
                        </span>
                    </button>
                </div>
            </div>
        </div>
    </form>
    <!--end::Form-->
@endsection

@push('scripts')
    <script>
        "use strict";

        // Class definition
        const KTSignUpGeneral = function () {
            // Elements
            const form = document.querySelector('#kt_sign_up_form');
            const nextButton = document.querySelector('#kt_sign_up_next');
            const backButton = document.querySelector('#kt_sign_up_back');
            const submitButton = document.querySelector('#kt_sign_up_submit');
            let validatorClientType;
            let validatorGeneral;

            const showError = function (message) {
                const error = document.getElementById('showError')
                error.querySelector('.alert-text').innerText = message
                error.classList.remove('d-none')
            }

            // Handle form
            const handleValidation = function (e) {
                // Init form validation rules. For more info check the FormValidation plugin's official documentation:https://formvalidation.io/
                validatorClientType = FormValidation.formValidation(
                    form,
                    {
                        fields: {
                            'client_type': {
                                validators: {
                                    notEmpty: {
                                        message: 'Mohon pilih jenis klien'
                                    }
                                }
                            }
                        },
                        plugins: {
                            trigger: new FormValidation.plugins.Trigger({
                                event: 'blur'
                            }),
                            bootstrap: new FormValidation.plugins.Bootstrap5({
                                rowSelector: '.fv-row',
                                eleInvalidClass: '',  // comment to enable invalid state icons
                                eleValidClass: '' // comment to enable valid state icons
                            })
                        }
                    }
                );

                validatorGeneral = FormValidation.formValidation(
                    form,
                    {
                        fields: {
                            'general_name': {
                                validators: {
                                    notEmpty: {
                                        message: 'Nama perusahaan tidak boleh kosong'
                                    }
                                }
                            },
                            
                            'general_email': {
                                validators: {
                                    regexp: {
                                        regexp: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                        message: 'Email tidak valid',
                                    },
                                    notEmpty: {
                                        message: 'Email tidak boleh kosong'
                                    }
                                }
                            },
                            'general_phone': {
                                validators: {
                                    notEmpty: {
                                        message: 'Nomor telepon tidak boleh kosong'
                                    }
                                }
                            },
                            'general_whatsapp_number': {
                                validators: {
                                    notEmpty: {
                                        message: 'Nomor whatsapp tidak boleh kosong'
                                    }
                                }
                            },
                            'general_fax': {
                                validators: {
                                    notEmpty: {
                                        message: 'Nomor FAX tidak boleh kosong'
                                    }
                                }
                            },
                            'person_responsible_name': {
                                validators: {
                                    notEmpty: {
                                        message: 'Nama tidak boleh kosong'
                                    }
                                }
                            },
                            'person_responsible_email': {
                                validators: {
                                    regexp: {
                                        regexp: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                        message: 'Email tidak valid',
                                    },
                                    notEmpty: {
                                        message: 'Email tidak boleh kosong'
                                    }
                                }
                            },
                            'person_responsible_whatsapp_number': {
                                validators: {
                                    notEmpty: {
                                        message: 'Nomor whatsapp tidak boleh kosong'
                                    }
                                }
                            },
                            'account_email': {
                                validators: {
                                    regexp: {
                                        regexp: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                        message: 'Email tidak valid',
                                    },
                                    notEmpty: {
                                        message: 'Email tidak boleh kosong'
                                    }
                                }
                            },
                            'account_password': {
                                validators: {
                                    notEmpty: {
                                        message: 'Password tidak boleh kosong'
                                    }
                                }
                            },
                            'account_password_confirmation': {
                                validators: {
                                    notEmpty: {
                                        message: 'Ulangi password tidak boleh kosong'
                                    },
                                    identical: {
                                        compare: function () {
                                            return document.querySelector('[name="account_password"]').value;
                                        },
                                        message: 'Ulangi password tidak cocok'
                                    }
                                }
                            }
                        },
                        plugins: {
                            trigger: new FormValidation.plugins.Trigger({
                                event: 'submit'
                            }),
                            bootstrap: new FormValidation.plugins.Bootstrap5({
                                rowSelector: '.fv-row',
                                eleInvalidClass: '',  // comment to enable invalid state icons
                                eleValidClass: '' // comment to enable valid state icons
                            })
                        }
                    }
                );
            };

            const switchStep = function (num) {
                switch (num) {
                    case 1:
                        document.querySelector('#kt_sign_up_client_type').classList.remove('d-none');
                        document.querySelector('#kt_sign_up_data').classList.add('d-none');
                        document.getElementById('content-wrapper').classList.remove('app-auth-form-wider');
                        break;
                    case 2:
                        document.querySelector('#kt_sign_up_client_type').classList.add('d-none');
                        document.querySelector('#kt_sign_up_data').classList.remove('d-none');
                        document.getElementById('content-wrapper').classList.add('app-auth-form-wider');

                        // get value from client type
                        const clientType = document.querySelector('input[name="client_type"]:checked').value
                        // set placeholder general_name based on client type
                        let clientPlaceholder = ''
                        if (clientType === 'BADAN_USAHA') {
                            clientPlaceholder = 'Nama Perusahaan'
                        } else if (clientType === 'INSTANSI_PEMERINTAH') {
                            clientPlaceholder = 'Nama Instansi'
                        } else {
                            clientPlaceholder = 'Nama Lengkap'
                        }
                        document.querySelector('[name="general_name"]').setAttribute('placeholder', clientPlaceholder)
                        break;
                    default:
                        break;
                }
            }

            const handleSubmitClientType = function (e) {
                // Handle form submit
                nextButton.addEventListener('click', function (e) {
                    // Prevent button default action
                    e.preventDefault();

                    // Validate form
                    validatorClientType.validate().then(function (status) {
                        if (status === 'Valid') {
                            switchStep(2)
                        }
                    });
                });
            }

            const handleSubmitAjax = function (e) {
                // Handle form submit
                submitButton.addEventListener('click', function (e) {
                    // Prevent button default action
                    e.preventDefault();

                    // Validate form
                    validatorGeneral.validate().then(async function (status) {
                        if (status === 'Valid') {
                            // Show loading indication
                            submitButton.setAttribute('data-kt-indicator', 'on');
                            // Disable button to avoid multiple click
                            submitButton.disabled = true;

                            // regenerate recaptcha token
                            await initRecaptcha();

                            const form = document.querySelector('#kt_sign_up_form')
                            const formData = new FormData(form)

                            axios.post(form.getAttribute('action'), formData)
                                .then(function (response) {
                                    // clear form
                                    form.reset()

                                    Swal.fire({
                                        text: response.data.message || 'Verifikasi email telah dikirim, silahkan cek email anda',
                                        icon: 'success',
                                        showConfirmButton: false,
                                        timer: 5000,
                                        timerProgressBar: true,
                                        willClose: function () {
                                            window.location.href = response.data.redirect || '{{ route('auth.login') }}'
                                        }
                                    });
                                })
                                .catch(function (error) {
                                    showError(error.response.data.message || error.message || 'Terjadi kesalahan')
                                })
                                .finally(function () {
                                    // Hide loading indication
                                    submitButton.removeAttribute('data-kt-indicator');

                                    // Enable button
                                    submitButton.disabled = false;
                                });
                        }
                    });
                });
            };

            const isValidUrl = function (url) {
                try {
                    new URL(url);
                    return true;
                } catch (e) {
                    return false;
                }
            };

            const initRecaptcha = async function () {
                const token = await grecaptcha.execute("{{config('google.recaptcha.site_key')}}", { action: 'submit' });
                const recaptchaInput = document.querySelector('[name="recaptcha"]')
                if (recaptchaInput) recaptchaInput.setAttribute('value', token || '')
            };


            const handlePasswordToggle = function () {
                const toggleElement = document.getElementById('password-toggle')
                if (toggleElement) {
                    toggleElement.addEventListener('click', function () {
                        const passwordInput = document.querySelector('[name="account_password"]')
                        const showPasswordIcon = document.getElementById('show-password-icon')
                        const hidePasswordIcon = document.getElementById('hide-password-icon')
                        const isShowPassword = passwordInput.getAttribute('type') === 'text'
                        passwordInput.setAttribute('type', isShowPassword ? 'password' : 'text')
                        if (isShowPassword) {
                            showPasswordIcon.classList.add('d-none')
                            hidePasswordIcon.classList.remove('d-none')
                        } else {
                            showPasswordIcon.classList.remove('d-none')
                            hidePasswordIcon.classList.add('d-none')
                        }
                    })
                }

                const toggleElement2 = document.getElementById('password-retype-toggle')
                if (toggleElement2) {
                    toggleElement2.addEventListener('click', function () {
                        const passwordInput = document.querySelector('[name="account_password_confirmation"]')
                        const showPasswordIcon = document.getElementById('show-password-retype-icon')
                        const hidePasswordIcon = document.getElementById('hide-password-retype-icon')
                        const isShowPassword = passwordInput.getAttribute('type') === 'text'
                        passwordInput.setAttribute('type', isShowPassword ? 'password' : 'text')
                        if (isShowPassword) {
                            showPasswordIcon.classList.add('d-none')
                            hidePasswordIcon.classList.remove('d-none')
                        } else {
                            showPasswordIcon.classList.remove('d-none')
                            hidePasswordIcon.classList.add('d-none')
                        }
                    })
                }
            }

            // Public functions
            return {
                // Initialization
                init: function () {
                    switchStep(1);
                    handleSubmitClientType();
                    handleValidation();
                    handlePasswordToggle();

                    backButton.addEventListener('click', function () {
                        switchStep(1)
                    })

                    if (isValidUrl(submitButton.closest('form').getAttribute('action'))) {
                        handleSubmitAjax(); // use for ajax submit
                    }
                }
            };
        }();

        // On document ready
        KTUtil.onDOMContentLoaded(function () {
            KTSignUpGeneral.init();
        });

    </script>
@endpush
