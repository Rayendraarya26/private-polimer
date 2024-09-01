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
        <h1 class="title">Verif Dokumen</h1>
        <h2 class="subtitle">
            Cek keaslian dokumen yang telah ditandatangani elektronik
        </h2>
        <div class="row" style="width: 100%; max-width: 600px; padding-top: 20px;">
            <ul class="nav nav-tabs" id="verifyTte" role="tablist">
                <li class="nav-item" role="presentation">
                    <button class="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#verify-by-id"
                            type="button" role="tab" aria-controls="verify-by-id" aria-selected="true">
                        Verifikasi by ID
                    </button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#verify-by-doc"
                            type="button" role="tab" aria-controls="verify-by-doc" aria-selected="false">
                        Verifikasi by Dokumen
                    </button>
                </li>
            </ul>
            <div class="tab-content mt-5" id="verifyTteContent">
                <div class="tab-pane fade show active" id="verify-by-id" role="tabpanel" aria-labelledby="home-tab"
                     tabindex="0">
                    <form action="{{ route('tte.verify-by-id') }}" method="POST" id="verif-by-id-form">
                        <input name='recaptcha-by-id' type='hidden'/>
                        @csrf
                        <div class="mb-3">
                            <label for="id" class="form-label">ID Dokumen / Ref Code</label>
                            <input type="text" class="form-control" id="dokumen_id" name="dokumen_id"
                                   placeholder="5b9768d6-d78c...">
                        </div>
                        <button type="submit" class="btn btn-primary">Verifikasi</button>
                    </form>
                </div>
                <div class="tab-pane fade" id="verify-by-doc" role="tabpanel" aria-labelledby="profile-tab"
                     tabindex="0">
                    <form action="{{ route('tte.verify-by-doc') }}" method="POST" id="verif-by-doc-form">
                        <input name='recaptcha-by-doc' type='hidden'/>
                        @csrf
                        <div class="mb-3">
                            <label for="id" class="form-label">Upload PDF</label>
                            <input type="file" class="form-control" id="dokumen_file" name="dokumen_file"
                                   accept="application/pdf">
                        </div>
                        <button type="submit" class="btn btn-primary">Verifikasi</button>
                    </form>
                </div>
            </div>

            {{--return result document--}}
            <div class="card d-none" style="width: 100%; max-width: 600px;" id="result">
                <div class="card-body">
                    <h3 class="card-title text-center">Dokumen Valid</h3>
                    <p class="card-text">Layanan: <span id="doc-layanan"></span></p>
                    <p class="card-text">Nama Dokumen: <span id="doc-name"></span></p>
                    <p class="card-text">Tanggal Verifikasi: <span id="doc-verify-date"></span></p>
                    <p class="card-text">Unduh Dokumen: <span id="doc-download"></span></p>
                    <div id="doc-metadata"></div>
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

        const KTVerifyTte = function () {
            const initRecaptcha = async function (name) {
                const token = await grecaptcha.execute("{{config('google.recaptcha.site_key')}}", { action: 'submit' });
                const recaptchaInput = document.querySelector(`[name="recaptcha-by-${name}"]`)
                if (recaptchaInput) recaptchaInput.setAttribute('value', token || '')
            };

            const handleSubmitAjax = function (jenis) {
                const submitButton = document.querySelector(`#verif-by-${jenis}-form button[type="submit"]`);

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
                    const form = document.querySelector(`#verif-by-${jenis}-form`);
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
                            const doc = response.results;
                            const docLayanan = document.querySelector('#doc-layanan');
                            const docName = document.querySelector('#doc-name');
                            const docVerifyDate = document.querySelector('#doc-verify-date');
                            const docMetadata = document.querySelector('#doc-metadata');
                            const docDownload = document.querySelector('#doc-download');

                            // format to local time doc.date_verify
                            const date = new Date(doc.date_verify);
                            const options = { year: 'numeric', month: 'long', day: 'numeric' };
                            doc.date_verify = date.toLocaleDateString('id-ID', options);

                            docLayanan.innerText = doc.layanan;
                            docName.innerText = doc.file_name;
                            docVerifyDate.innerText = doc.date_verify;
                            docDownload.innerHTML = `<a href="${doc.file_link}" target="_blank">Download</a>`;
                            docMetadata.innerHTML = '';

                            if (doc.metadata) {
                                Object.keys(doc.metadata).forEach(key => {
                                    docMetadata.innerHTML += `<p>${key}: ${doc.metadata[key]}</p>`;
                                });
                            }

                            document.querySelector('.card').classList.remove('d-none');
                        },
                        error: function (response) {
                            // Hide loading indication
                            submitButton.removeAttribute('data-kt-indicator');

                            // Enable button
                            submitButton.disabled = false;

                            document.querySelector('#error-message-text').innerText = "Dokumen tidak ditemukan";
                            document.querySelector('#error-message').classList.remove('d-none');

                            // Reset form for next input
                            form.reset();
                        }
                    });
                });
            };

            return {
                init: function () {
                    handleSubmitAjax('id');
                    handleSubmitAjax('doc');
                }
            }
        }();

        // On document ready
        KTUtil.onDOMContentLoaded(function () {
            KTVerifyTte.init();
        });
    </script>
@endpush
