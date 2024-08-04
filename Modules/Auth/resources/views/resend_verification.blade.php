@extends('layouts.auth')

@section('title', 'Login')

@section('content')
    <!--begin::Form-->
    <form class="form w-100" novalidate="novalidate" id="kt_form" action="{{ url()->current() }}" method="post">
        @csrf
        <input type="hidden" name="recaptcha">

        <!--begin::Heading-->
        <div class="text-center mb-11">
            <!--begin::Title-->
            <h1 class="text-gray-900 fw-bolder mb-3">
                Verifikasi Email
                <i>{{ auth()->user()->email }}</i>
            </h1>
            <!--end::Title-->
        </div>
        <!--begin::Heading-->


        <!--begin::Submit button-->
        <div class="d-grid mb-10">
            <button type="submit" id="kt_submit" class="btn btn-primary">
                <!--begin::Indicator label-->
                <span class="indicator-label">Kirim Verifikasi Email Sekarang</span>
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
        // inject recaptcha
        grecaptcha.ready(function () {
            grecaptcha.execute('{{ config('services.recaptcha.site_key') }}', { action: 'submit' }).then(function (token) {
                document.querySelector('input[name=recaptcha]').value = token;
            });
        });

        // add kt indicator when submit
        const submitButton = document.getElementById('kt_submit');
        submitButton.addEventListener('click', function (e) {
            submitButton.setAttribute('data-kt-indicator', 'on');

            // Disable button to avoid multiple click
            submitButton.disabled = true;

            // submit form
            submitButton.closest('form').submit();
        });
    </script>
@endpush
