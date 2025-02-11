@extends('layouts.app')

@section('content')
	<div class="card" id="kt_card" id="vueApp">
        <!--begin::Card body-->
        <div class="card-body">
            <!--begin::Row-->
            <div class="row">
                <div class="mb-5">
                    <div class="d-flex justify-content-center">
                        <div class="nav-wrapper position-relative">
                            <ul class="nav nav-pills nav-fill p-1 bg-light rounded-pill shadow-sm" role="tablist">
                                @foreach($key as $dt)
                                <li class="nav-item mx-1">
                                    <a class="nav-link @if($selected_key === strtolower($dt)) active bg-primary text-white shadow @else text-dark @endif rounded-pill px-4" 
                                       href="{{ url("$url?data=".strtolower($dt)) }}">
                                        <i class="fas fa-{{ strtolower($dt) === 'slider' ? 'images' : (strtolower($dt) === 'services' ? 'cogs' : (strtolower($dt) === 'partners' ? 'handshake' : (strtolower($dt) === 'social_media' ? 'share-nodes' : 'info-circle'))) }} me-2"></i>
                                        {{ str_replace('_', ' ', $dt) }}
                                    </a>
                                </li>
                                @endforeach
                            </ul>
                        </div>
                    </div>
                </div>

				@yield('child_content')
            </div>
        </div>
    </div>
@endsection


