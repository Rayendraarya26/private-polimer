@extends('layouts.auth')

@section('title', 'Login')

@section('content')
    <!--begin::Form-->
    <form class="form w-100" novalidate="novalidate" id="kt_form" action="{{ url()->current() }}" method="post">
        @csrf
        <!--begin::Heading-->
        <div class="text-center mb-11">
            <!--begin::Title-->
            <h1 class="text-gray-900 fw-bolder mb-3">
                @lang('Reset Password')
            </h1>
            <!--end::Title-->
            <!--begin::Link-->
            <div class="text-gray-500 fw-semibold fs-6">Masukkan email anda untuk memperbarui kata sandi</div>
            <!--end::Link-->
        </div>
        <!--begin::Heading-->

        <!--begin::Input group=-->
        <div class="fv-row mb-8">
            <!--begin::Email-->
            <input type="text" placeholder="Email" name="email" autocomplete="off"
                   class="form-control bg-transparent" value="kemal@mailinator.com"/>
            <!--end::Email-->
        </div>
        <!--end::Input group=-->

        <!--begin::Actions-->
        <div class="d-flex flex-wrap justify-content-center pb-lg-0">
            <button type="button" id="kt_submit" class="btn btn-primary me-4">
                <!--begin::Indicator label-->
                <span class="indicator-label">Kirim Email</span>
                <!--end::Indicator label-->
                <!--begin::Indicator progress-->
                <span class="indicator-progress">Mohon tunggu...
                    <span class="spinner-border spinner-border-sm align-middle ms-2"></span>
                </span>
                <!--end::Indicator progress-->
            </button>
            <a href="{{ url('/auth/login') }}" class="btn btn-light">Kembali</a>
        </div>
        <!--end::Actions-->
    </form>
    <!--end::Form-->
@endsection

@push('scripts')
    <script>
        "use strict";

        // Class definition
        const KTSigninGeneral = function () {
            // Elements
            let form;
            let submitButton;
            let validator;

            // Handle form
            const handleValidation = function (e) {
                // Init form validation rules. For more info check the FormValidation plugin's official documentation:https://formvalidation.io/
                validator = FormValidation.formValidation(
                    form,
                    {
                        fields: {
                            'email': {
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
                        },
                        plugins: {
                            trigger: new FormValidation.plugins.Trigger(),
                            bootstrap: new FormValidation.plugins.Bootstrap5({
                                rowSelector: '.fv-row',
                                eleInvalidClass: '',  // comment to enable invalid state icons
                                eleValidClass: '' // comment to enable valid state icons
                            })
                        }
                    }
                );
            };

            const handleSubmitAjax = function (e) {
                // Handle form submit
                submitButton.addEventListener('click', function (e) {
                    // Prevent button default action
                    e.preventDefault();

                    // Validate form
                    validator.validate().then(function (status) {
                        if (status === 'Valid') {
                            // Show loading indication
                            submitButton.setAttribute('data-kt-indicator', 'on');

                            // Disable button to avoid multiple click
                            submitButton.disabled = true;

                            // Check axios library docs: https://axios-http.com/docs/intro
                            // submit html form
                            document.querySelector('#kt_form').submit();
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

            // Public functions
            return {
                // Initialization
                init: function () {
                    form = document.querySelector('#kt_form');
                    submitButton = document.querySelector('#kt_submit');

                    handleValidation();

                    if (isValidUrl(submitButton.closest('form').getAttribute('action'))) {
                        handleSubmitAjax(); // use for ajax submit
                    }
                }
            };
        }();

        // On document ready
        KTUtil.onDOMContentLoaded(function () {
            KTSigninGeneral.init();
        });

    </script>
@endpush
