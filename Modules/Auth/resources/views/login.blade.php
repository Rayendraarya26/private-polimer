@extends('layouts.auth')

@section('title', 'Login')

@section('content')
    <div class="text-center mb-20">
        <img src="{{ asset('assets/media/logos/polimer-logo.svg') }}" class="h-100px h-md-150px" alt=""/>
    </div>

    <!--begin::Form-->
    <form class="form w-100" novalidate="novalidate" id="kt_sign_in_form" action="{{ url()->current() }}" method="post">
        @csrf

        <!--begin::Input group=-->
        <div class="fv-row mb-8">
            <!--begin::Email-->
            <input type="text" placeholder="Email" name="email" autocomplete="off" aria-label="email" autofocus
                   class="form-control bg-transparent" value="dolkode@mailinator.com"/>
            <!--end::Email-->
        </div>
        <!--end::Input group=-->
        <div class="fv-row mb-3">
            <!--begin::Password-->
            <input type="password" placeholder="Kata Sandi" name="password" autocomplete="off" aria-label="password"
                   class="form-control bg-transparent" value="password"/>
            <!--end::Password-->
        </div>
        <!--end::Input group=-->
        <!--begin::Wrapper-->
        <div class="d-flex flex-stack flex-wrap gap-3 fs-base fw-semibold mb-8">
            <div></div>
            <!--begin::Link-->
            <a href="#">
                Lupa Password?
            </a>
            <!--end::Link-->
        </div>
        <!--end::Wrapper-->
        <!--begin::Submit button-->
        <div class="d-grid mb-10">
            <button type="submit" id="kt_sign_in_submit" class="btn btn-primary">
                <!--begin::Indicator label-->
                <span class="indicator-label">@lang('Login')</span>
                <!--end::Indicator label-->
                <!--begin::Indicator progress-->
                <span class="indicator-progress">Please wait...
                    <span class="spinner-border spinner-border-sm align-middle ms-2"></span>
                </span>
                <!--end::Indicator progress-->
            </button>
        </div>
        <!--end::Submit button-->
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
                            'password': {
                                validators: {
                                    notEmpty: {
                                        message: 'Password tidak boleh kosong'
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
                            document.querySelector('#kt_sign_in_form').submit();
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
                    form = document.querySelector('#kt_sign_in_form');
                    submitButton = document.querySelector('#kt_sign_in_submit');

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
