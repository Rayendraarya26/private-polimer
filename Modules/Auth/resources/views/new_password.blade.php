@extends('layouts.auth')

@section('title', 'Login')

@section('content')
    <img src="{{ asset('assets/media/logos/polimer-logo.svg') }}" class="app-logo mt-15 mb-10" alt=""/>
    <!--begin::Form-->
    <form class="form w-100" novalidate="novalidate" id="kt_form" action="{{ url()->current() }}" method="post">
        @csrf
        <input type="hidden" value="{{ $token }}" name="token">
        <input type="hidden" value="{{ $email }}" name="email">
        <!--begin::Heading-->
        <div class="text-center mb-11">
            <!--begin::Title-->
            <h1 class="text-gray-900 fw-bolder mb-3">
                @lang('Reset Password')
            </h1>
            <!--end::Title-->
        </div>
        <!--begin::Heading-->


        <!--begin::Input group=-->
        <!--begin::Input group-->
        <div class="fv-row mb-8" data-kt-password-meter="true">
            <!--begin::Wrapper-->
            <div class="mb-1">
                <!--begin::Input wrapper-->
                <div class="position-relative mb-3">
                    <input class="form-control bg-transparent" type="password" placeholder="Password" name="password"
                           autocomplete="off"/>
                    <span class="btn btn-sm btn-icon position-absolute translate-middle top-50 end-0 me-n2"
                          data-kt-password-meter-control="visibility">
                        <i class="ki-duotone ki-eye-slash fs-2"></i>
                        <i class="ki-duotone ki-eye fs-2 d-none"></i>
                    </span>
                </div>
                <!--end::Input wrapper-->
                <!--begin::Meter-->
                <div class="d-flex align-items-center mb-3" data-kt-password-meter-control="highlight">
                    <div class="flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2"></div>
                    <div class="flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2"></div>
                    <div class="flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2"></div>
                    <div class="flex-grow-1 bg-secondary bg-active-success rounded h-5px"></div>
                </div>
                <!--end::Meter-->
            </div>
            <!--end::Wrapper-->
        </div>
        <!--end::Input group=-->
        <!--end::Input group=-->
        <div class="fv-row mb-8">
            <!--begin::Repeat Password-->
            <input type="password" placeholder="Repeat Password" name="password_confirmation" autocomplete="off"
                   class="form-control bg-transparent"/>
            <!--end::Repeat Password-->
        </div>
        <!--end::Wrapper-->
        <!--begin::Submit button-->
        <div class="d-grid mb-10">
            <button type="submit" id="kt_submit" class="btn btn-primary">
                <!--begin::Indicator label-->
                <span class="indicator-label">@lang('Update')</span>
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

        // Class Definition
        const KTAuthResetPassword = function () {
            // Elements
            let form;
            let submitButton;
            let validator;

            const handleForm = function (e) {
                // Init form validation rules. For more info check the FormValidation plugin's official documentation:https://formvalidation.io/
                validator = FormValidation.formValidation(
                    form,
                    {
                        fields: {
                            password: {
                                validators: {
                                    notEmpty: {
                                        message: 'Password is required'
                                    },
                                    stringLength: {
                                        min: 8,
                                        message: 'The password must have at least 8 characters'
                                    }
                                }
                            },
                            password_confirmation: {
                                validators: {
                                    notEmpty: {
                                        message: 'Password confirmation is required'
                                    },
                                    identical: {
                                        compare: function () {
                                            return form.querySelector('[name="password"]').value;
                                        },
                                        message: 'The password and its confirm are not the same'
                                    }
                                }
                            }
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

            // Public Functions
            return {
                // public functions
                init: function () {
                    form = document.querySelector('#kt_form');
                    submitButton = document.querySelector('#kt_submit');
                    console.log(submitButton);

                    handleForm();

                    if (isValidUrl(form.getAttribute('action'))) {
                        handleSubmitAjax(); // use for ajax submit
                    }
                }
            };
        }();

        // On document ready
        KTUtil.onDOMContentLoaded(function () {
            KTAuthResetPassword.init();
        });

    </script>
@endpush
