@extends('layouts.no_header')

@section('title', 'FAQ')

@push('styles')
    <style>
        .title {
            font-size: 3rem;
            padding-top: 2rem;
        }

        .subtitle {
            font-size: 1.25rem;
            text-align: center;
        }
    </style>
@endpush

@section('content')
    <div class="w-100 d-flex flex-column align-items-center container gap-5">
        <h1 class="title">Lacak Permohonan</h1>
        <h2 class="subtitle">
            Cek status permohonan Anda dengan memasukkan ID permohonan yang telah diberikan oleh sistem.
        </h2>
        <div class="row" style="width: 100%; max-width: 600px; padding-top: 20px;">

            <form action="{{ route('tracking-permohonan') }}" method="POST" id="tracking-permohonan">
                <input name='recaptcha' type='hidden'/>
                @csrf
                <div class="mb-3">
                    <label for="id" class="form-label">ID Permohonan</label>
                    <input type="text" class="form-control" id="id_permohonan" name="id_permohonan"
                           placeholder="UJI-XXXX-XXXXXXXX" required
                           value="{{ $code }}">
                </div>
                <button type="submit" class="btn btn-primary">
                    <i class="fas fa-search"></i> Cari
                </button>
            </form>

            <div class="card d-none" style="width: 100%; max-width: 600px;" id="result">
                <div class="card-body">
                    <h3 class="card-title text-center">Status Permohonan</h3>
                    <p class="card-text">Layanan: <span id="res-layanan"></span></p>
                    <p class="card-text">Kode Layanan: <span id="res-kode"></span></p>
                    <p class="card-text">Tanggal Permohonan: <span id="res-tanggal"></span></p>
                    <p class="card-text">Status: <span id="res-status"></span></p>
                </div>
            </div>

            <div class="alert alert-danger d-none" role="alert" id="error-message">
                <p id="error-message-text"></p>
            </div>
        </div>
    </div>
@endsection

@push('scripts')
    <script>

        const KTTrackingPermohonan = function () {
            const initRecaptcha = async function (name) {
                const token = await grecaptcha.execute("{{config('google.recaptcha.site_key')}}", { action: 'submit' });
                const recaptchaInput = document.querySelector(`[name="recaptcha"]`)
                if (recaptchaInput) recaptchaInput.setAttribute('value', token || '')
            };

            const handleSubmitAjax = function (jenis) {
                const submitButton = document.querySelector(`#tracking-permohonan button[type="submit"]`);

                // Handle form submit
                submitButton.addEventListener('click', async function (e) {
                    // Prevent button default action
                    e.preventDefault();

                    // hide result
                    document.querySelector('.card').classList.add('d-none');

                    // Show loading indication
                    submitButton.setAttribute('data-kt-indicator', 'on');

                    // Disable button to avoid multiple click
                    submitButton.disabled = true;

                    await initRecaptcha(jenis);

                    // submit using ajax
                    const form = document.querySelector(`#tracking-permohonan`);
                    const formData = new FormData(form);

                    $.ajax({
                        url: form.action,
                        method: form.method,
                        data: formData,
                        contentType: false,
                        processData: false,
                        success: function (response) {
                            // Reset form for next input
                            form.reset();

                            // Hide loading indication
                            submitButton.removeAttribute('data-kt-indicator');
                            // Hide error message
                            document.querySelector('#error-message').classList.add('d-none');

                            // Enable button
                            submitButton.disabled = false;

                            // Show result
                            const res = response.results;

                            document.querySelector('#res-layanan').innerText = res.layanan;
                            document.querySelector('#res-kode').innerText = res.kode;
                            document.querySelector('#res-tanggal').innerText = res.tanggal;
                            document.querySelector('#res-status').innerText = res.status;

                            document.querySelector('.card').classList.remove('d-none');
                        },
                        error: function (response) {
                            // Hide loading indication
                            submitButton.removeAttribute('data-kt-indicator');

                            // Enable button
                            submitButton.disabled = false;

                            document.querySelector('#error-message-text').innerText = "Permohonan tidak ditemukan";
                            document.querySelector('#error-message').classList.remove('d-none');

                            // Reset a form for next input
                            form.reset();
                        }
                    });
                });
            };

            return {
                init: function () {
                    handleSubmitAjax('id');
                }
            }
        }();

        // On document ready
        KTUtil.onDOMContentLoaded(function () {
            KTTrackingPermohonan.init();
        });
    </script>
@endpush
