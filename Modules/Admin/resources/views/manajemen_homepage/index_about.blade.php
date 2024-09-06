@extends('layouts.app')

@section('title', 'Manage Homepage About Us')

@section('content')
	<div class="card" id="kt_card" id="vueApp">
        <!--begin::Card body-->
        <div class="card-body">
            <!--begin::Row-->
            <div class="row">
                <div class="mb-5 hover-scroll-x">
					<div class="d-grid">
						<ul class="nav nav-tabs">
							@foreach($key as $dt)
							<li class="nav-link @if($selected_key === strtolower($dt)) active @endif">
								<a class="nav-link @if($selected_key === strtolower($dt)) btn btn-text-danger @endif" href="{{ url("$url?data=".strtolower($dt)) }}">{{ $dt }}</a>
							</li>
							@endforeach
						</ul>
					</div>
				</div>

				<div class="tab-content">
					<div class="tab-pane fade show active" role="tabpanel">
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
						<form method="post" id="kt_form" action="{{ url("$url/about/update") }}">
							@csrf
							@method('POST')
							
							<div class="form-group row mb-3">
								<div class="col-sm-12">
									<div id="quilEditorApp"></div>
									<textarea name="data" id="data" style="display: none;"></textarea>
									<input name="action" type="hidden" value="about">
								</div>
							</div>
							<div class="form-group row mt-20">
								<div class="form-buttons-w offset-sm-3 col-sm-8">
									<button class="btn btn-success" type="button" onclick="submitApi()">
										<i class="fas fa-save"></i> Simpan
									</button>
								</div>
							</div>
						</form>
					</div>
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
    <script>
		
        "use strict";
        const KTUpsert = function () {

            const initTextEditor = () => {
                const options = {
                    modules: {
                        toolbar: [
                            [{
                                header: [1, 2, false]
                            }],
                            ['bold', 'italic', 'underline']
                        ]
                    },
                    theme: 'snow'
                };
                const quill = new Quill('#quilEditorApp', options);
                quill.root.innerHTML = "{!! old('question') ?? $about_us !!}";
            }

            // Public methods
            return {
                init: function () {
                    initTextEditor();
                },
            }
        }();

        // On document ready
        KTUtil.onDOMContentLoaded(function () {
            KTUpsert.init();
        });

        function submitApi () {
            const quill = new Quill('#quilEditorApp');
            $("#data").val(quill.root.innerHTML);

            var stats = true;
            const data = document.getElementById("data");
            if(data.value.length === 0){
                stats = false;
            }

            if(stats){
                document.getElementById("kt_form").submit();
            }
        }
    </script>
@endpush


