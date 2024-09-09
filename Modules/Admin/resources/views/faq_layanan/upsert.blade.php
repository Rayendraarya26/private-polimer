@extends('layouts.app')

@section('title', 'Tambah/Ubah FAQ Layanan')

@section('content')
    <div class="card" id="kt_card" id="vueApp">
        <!--begin::Card body-->
        <div class="card-body">
            <!--begin::Row-->
            <div class="row">
                <div class="col-lg-12">
                    @if ($errors->any())
                        <div class="alert alert-danger" role="alert">
                            {!! implode('', $errors->all('<li>:message</li>')) !!}
                        </div>
                    @endif
                    @if(session('message'))
                        <div class="alert alert-success" role="alert">
                            {{ session('message') }}
                        </div>
                    @endif
                    <form method="post" id="kt_form" action="{{ $data ? url("$url/$data->id") : url("$url") }}">
                        @csrf
                        @method($data ? 'PUT' : 'POST')

                        <input type="hidden" id="permission" name="permission">
                        <div class="form-group row mb-3">
                            <label class="col-form-label col-sm-3 required" for="order">
                                Urutan
                            </label>
                            <div class="col-sm-3">
                                <input class="form-control"
                                       placeholder="Urutan"
                                       type="text" name="order" id="order"
                                       value="{{old('order') ?? $data?->order}}" required autocomplete="off">
                            </div>
                        </div>


                        <div class="form-group row mb-3">
                            <label class="col-form-label col-sm-3 required" for="layanan_id">
                                Layanan
                            </label>
                            <div class="col-sm-8">
                                <select class="form-select" name="layanan_id" id="layanan_id" required>
                                    <option value="">-Silahkan Pilih Layanan-</option>
                                    @foreach($data_layanan as $dt)
                                        <option value="{{$dt->id}}"
                                                @if ($dt->id == old('layanan', $data?->layanan_id))
                                                    selected="selected"
                                            @endif
                                        >{{$dt->name}}</option>
                                    @endforeach
                                </select>
                            </div>
                        </div>

                        <div class="form-group row mb-3">
                            <label class="col-form-label col-sm-3 required" for="question">
                                Pertanyaan?
                            </label>
                            <div class="col-sm-8">
                                <input class="form-control"
                                       placeholder="Masukkan Pertanyaan..."
                                       type="text" name="question" id="question"
                                       value="{{old('question') ?? $data?->question}}" required autocomplete="off">
                            </div>
                        </div>
                        <div class="form-group row mb-3">
                            <label class="col-form-label col-sm-3" for="answer">
                                Jawaban
                            </label>
                            <div class="col-sm-8">
                                <div id="quilEditorApp"></div>
                                <textarea name="answer" id="answer" style="display: none;"></textarea>
                            </div>
                        </div>

                        <div class="form-group row pt-20">
                            <div class="form-buttons-w offset-sm-3 col-sm-8">
                                <div class="form-check form-switch form-check-custom form-check-solid">
                                    <input name="is_active" class="form-check-input" type="checkbox" value="1"
                                           id="flexSwitchDefault"
                                           @if(old('is_active') == '1')
                                               checked
                                           @elseif($data?->is_active == '1')
                                               checked
                                        @endif
                                    />
                                    <label class="form-check-label" for="flexSwitchDefault">
                                        Aktif?
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div class="form-group row mt-5">
                            <div class="form-buttons-w offset-sm-3 col-sm-8">
                                <button class="btn btn-success" type="button" onclick="KTUpsert.submitApi()">
                                    <i class="fas fa-save"></i> Simpan
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
@endsection
@push('styles')
    <link href="https://cdn.jsdelivr.net/npm/quill@2.0.2/dist/quill.snow.css" rel="stylesheet"/>
@endpush

@push('scripts')
    <script src="https://cdn.jsdelivr.net/npm/quill@2.0.2/dist/quill.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/quill-blot-formatter@1.0.5/dist/quill-blot-formatter.min.js"></script>
    <script src="https://unpkg.com/quill-html-edit-button@2.2.7/dist/quill.htmlEditButton.min.js"></script>
    <script>
        "use strict";
        const KTUpsert = function () {

            let quill;

            const submitApi = () => {
                $("#answer").val(quill.root.innerHTML);

                let stats = true;
                const answer = document.getElementById("answer");
                if (answer.value.length === 0) {
                    stats = false;
                }

                if (stats) {
                    document.getElementById("kt_form").submit();
                }
            }

            const initTextEditor = () => {
                const options = {
                    modules: {
                        toolbar: [
                            ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
                            ['blockquote', 'code-block'],
                            ['link', 'image', 'video', 'formula'],

                            [{ 'header': 1 }, { 'header': 2 }],               // custom button values
                            [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'list': 'check' }],
                            [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
                            [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
                            [{ 'direction': 'rtl' }],                         // text direction

                            [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
                            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

                            [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
                            [{ 'font': [] }],
                            [{ 'align': [] }],

                            ['clean']
                        ],
                        blotFormatter: {},
                        htmlEditButton: {},
                    },
                    theme: 'snow'
                };
                Quill.register('modules/blotFormatter', QuillBlotFormatter.default);
                Quill.register("modules/htmlEditButton", htmlEditButton);
                quill = new Quill('#quilEditorApp', options);
                quill.root.innerHTML = `{!! old('answer') ?? $data?->answer !!}`;
            }

            // Public methods
            return {
                init: function () {
                    initTextEditor();
                },
                submitApi: function () {
                    submitApi();
                }
            }
        }();

        // On document ready
        KTUtil.onDOMContentLoaded(function () {
            KTUpsert.init();
        });
    </script>
@endpush


