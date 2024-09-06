@extends('layouts.app')

@section('title', 'Manage Homepage')

@section('content')
    <div class="card" id="kt_card">
        <!--begin::Card body-->
        <div class="card-body">
            @if(session('message'))
                <div class="alert alert-success" role="alert">
                    {{ session('message') }}
                </div>
            @endif
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
						asdasdasd
					</div>
				</div>


            </div>
        </div>
    </div>
@endsection