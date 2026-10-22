@extends("$view.index_layout")

@section('title', 'Manage Homepage About Us')

@section('child_content')
    <div class="tab-pane fade show active" role="tabpanel">
        @if ($errors->any())
            <div class="alert alert-danger" role="alert">
                {!! implode('', $errors->all('<li>:message</li>')) !!}
            </div>
        @endif
        @if (session('message'))
            <div class="alert alert-success" role="alert">
                {{ session('message') }}
            </div>
        @endif
        <form method="post" id="kt_form" action="{{ url("$url/about/update") }}">
            @csrf
            @method('POST')
            <input name="action" type="hidden" value="about">

            <!-- Nav Tabs Localization -->
            <ul class="nav nav-tabs nav-line-tabs mb-4 fs-6" role="tablist">
                <li class="nav-item">
                    <a class="nav-link active fw-bold" data-bs-toggle="tab" href="#about_tab_id">🇮🇩 Indonesia</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link fw-bold" data-bs-toggle="tab" href="#about_tab_en">🇬🇧 English</a>
                </li>
            </ul>

            <div class="tab-content mb-4">
                <!-- Tab Indonesia -->
                <div class="tab-pane fade show active" id="about_tab_id" role="tabpanel">
                    <label class="form-label fw-semibold mb-2">Konten Tentang Kami (Indonesia)</label>
                    <div id="quillEditorId" style="height: 320px;"></div>
                    <textarea name="data_id" id="data_id" style="display: none;"></textarea>
                </div>

                <!-- Tab English -->
                <div class="tab-pane fade" id="about_tab_en" role="tabpanel">
                    <label class="form-label fw-semibold mb-2">About Us Content (English)</label>
                    <div id="quillEditorEn" style="height: 320px;"></div>
                    <textarea name="data_en" id="data_en" style="display: none;"></textarea>
                </div>
            </div>

            <div class="form-group row" style="padding-top: 50px">
                <div class="form-buttons-w">
                    <button class="btn btn-success" type="button" onclick="submitApi()">
                        <i class="fas fa-save"></i> Simpan
                    </button>
                </div>
            </div>
        </form>
    </div>
@endsection

@push('styles')
    <link href="https://cdn.jsdelivr.net/npm/quill@2.0.2/dist/quill.snow.css" rel="stylesheet" />
@endpush

@push('scripts')
    <script src="https://cdn.jsdelivr.net/npm/quill@2.0.2/dist/quill.js"></script>
    <script>
        "use strict";
        let quillId = null;
        let quillEn = null;

        const KTUpsert = function() {
            const initTextEditor = () => {
                const options = {
                    modules: {
                        toolbar: [
                            ['bold', 'italic', 'underline', 'strike'],
                            ['link', 'video'],
                            [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'list': 'check' }],
                            [{ 'direction': 'rtl' }],
                            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                            [{ 'color': [] }, { 'background': [] }],
                            [{ 'font': [] }],
                            [{ 'align': [] }],
                        ],
                    },
                    theme: 'snow'
                };

                quillId = new Quill('#quillEditorId', options);
                quillEn = new Quill('#quillEditorEn', options);

                quillId.root.innerHTML = `{!! addslashes($about_us ?? '') !!}`;
                quillEn.root.innerHTML = `{!! addslashes($about_us_en ?? '') !!}`;
            }

            return {
                init: function() {
                    initTextEditor();
                },
            }
        }();

        KTUtil.onDOMContentLoaded(function() {
            KTUpsert.init();
        });

        function submitApi() {
            if (quillId) {
                $("#data_id").val(quillId.root.innerHTML);
            }
            if (quillEn) {
                $("#data_en").val(quillEn.root.innerHTML);
            }

            document.getElementById("kt_form").submit();
        }
    </script>
@endpush
