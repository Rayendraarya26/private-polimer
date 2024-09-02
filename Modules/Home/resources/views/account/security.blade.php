@extends('home::account.account')

@section('title', 'Profile')

@section('content_children')
    <div class="card mb-5 mb-xl-10" id="kt_profile_details_view">
        <!--begin::Card header-->
        <div class="card-header">
            <!--begin::Card title-->
            <div class="card-title m-0">
                <h3 class="fw-bold m-0">Update Password</h3>
            </div>
            <!--end::Card title-->
        </div>
        <!--begin::Card header-->
        <!--begin::Card body-->
        <div class="card-body p-9">
            <form method="post" action="{{ url('/account/security/password') }}" id="kt_form">
                @csrf
                @if(auth()->user()->password)
                    <!--begin::Row-->
                    <div class="fv-row row mb-7">
                        <!--begin::Label-->
                        <label class="col-lg-4 fw-semibold text-muted">Current Password</label>
                        <!--end::Label-->
                        <!--begin::Col-->
                        <div class="col-lg-8">
                            <input type="password" class="form-control" id="current_password" name="current_password"
                                   aria-label="current password" placeholder="********"/>
                        </div>
                        <!--end::Col-->
                    </div>
                    <!--end::Row-->
                @endif

                <!--begin::Row-->
                <div class="fv-row row mb-7">
                    <!--begin::Label-->
                    <label class="col-lg-4 fw-semibold text-muted">New Password</label>
                    <!--end::Label-->
                    <!--begin::Col-->
                    <div class="col-lg-8">
                        <input type="password" class="form-control" id="new_password" name="new_password"
                               aria-label="new password" placeholder="********"/>
                    </div>
                    <!--end::Col-->
                </div>
                <!--end::Row-->

                <!--begin::Row-->
                <div class="fv-row row mb-7">
                    <!--begin::Label-->
                    <label class="col-lg-4 fw-semibold text-muted">Confirmation Password</label>
                    <!--end::Label-->
                    <!--begin::Col-->
                    <div class="col-lg-8">
                        <input type="password" class="form-control" id="new_password_confirmation"
                               name="new_password_confirmation"
                               aria-label="current password" placeholder="********"/>
                    </div>
                    <!--end::Col-->
                </div>
                <!--end::Row-->

                <div class="offset-lg-4">
                    <button href="{{ url('/account/update-profile') }}" class="btn btn-sm btn-primary align-self-center"
                            id="kt_btn_submit">
                        <i class="fad fa-save"></i> Save
                    </button>
                </div>
            </form>
        </div>
    </div>
@endsection

@push('scripts')
    <script>
        "use strict";

        // Class definition
        const KTUpdatePassword = function () {
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
                            'current_password': {
                                validators: {
                                    notEmpty: {
                                        message: 'Current password is required'
                                    }
                                }
                            },
                            'new_password': {
                                validators: {
                                    notEmpty: {
                                        message: 'New password is required'
                                    },
                                    // minimal 8 characters alphabet and number
                                    regexp: {
                                        message: 'The password must contain at least 8 characters, including at least one letter, one number, anc one special character',
                                        regexp: '^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,}$'
                                    }
                                }
                            },
                            'new_password_confirmation': {
                                validators: {
                                    notEmpty: {
                                        message: 'Confirmation password is required'
                                    },
                                    identical: {
                                        compare: function () {
                                            return form.querySelector('[name="new_password"]').value;
                                        },
                                        message: 'The password and its confirm are not the same'
                                    }
                                }
                            },
                        },
                        plugins: {
                            trigger: new FormValidation.plugins.Trigger(),
                            bootstrap: new FormValidation.plugins.Bootstrap5({
                                rowSelector: '.fv-row',
                                // eleInvalidClass: '',  // comment to enable invalid state icons
                                eleValidClass: '' // comment to enable valid state icons
                            })
                        }
                    }
                );
            };

            const handleSubmit = function (e) {
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
                    submitButton = document.querySelector('#kt_btn_submit');

                    handleValidation();

                    if (isValidUrl(form.getAttribute('action'))) {
                        handleSubmit(); // use for ajax submit
                    }
                }
            };
        }();

        // On document ready
        KTUtil.onDOMContentLoaded(function () {
            KTUpdatePassword.init();
        });

    </script>
@endpush
