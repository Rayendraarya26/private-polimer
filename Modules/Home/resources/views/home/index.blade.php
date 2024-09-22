@extends('layouts.app')

@section('title', 'Home')

@push('styles')
    <style>
        .card-hover {
            transition: transform 0.3s ease;
        }

        .card-hover:hover {
            transform: scale(1.05);
            background-color: #f9f9f9;
        }
    </style>

@endpush

@section('content')
    <div class="text-center">
        <h2>Halo Selamat Datang {{ Auth::user()->name }} !</h2>
    </div>

    <div class="card shadow-sm mt-10">
        <div class="card-header collapsible cursor-pointer rotate" data-bs-toggle="collapse"
             data-bs-target="#kt_docs_card_collapsible">
            <h3 class="card-title">
                Daftar Aplikasi
            </h3>
            <div class="card-toolbar rotate-180">
                <i class="ki-duotone ki-down fs-1"></i>
            </div>
        </div>
        <div class="collapse show">
            <div class="card-body row">
                @foreach($listSso as $sso)
                    <div class="col-md-3 mb-4">
                        <a href="{{ $sso->login_url }}">
                            <div class="card card-hover">
                                <div class="card-header mx-4 p-3 d-flex flex-row justify-content-center">

                                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor"
                                         class="bi bi-stack" viewBox="0 0 16 16">
                                        <path
                                            d="m14.12 10.163 1.715.858c.22.11.22.424 0 .534L8.267 15.34a.6.6 0 0 1-.534 0L.165 11.555a.299.299 0 0 1 0-.534l1.716-.858 5.317 2.659c.505.252 1.1.252 1.604 0l5.317-2.66zM7.733.063a.6.6 0 0 1 .534 0l7.568 3.784a.3.3 0 0 1 0 .535L8.267 8.165a.6.6 0 0 1-.534 0L.165 4.382a.299.299 0 0 1 0-.535z"/>
                                        <path
                                            d="m14.12 6.576 1.715.858c.22.11.22.424 0 .534l-7.568 3.784a.6.6 0 0 1-.534 0L.165 7.968a.299.299 0 0 1 0-.534l1.716-.858 5.317 2.659c.505.252 1.1.252 1.604 0z"/>
                                    </svg>
                                </div>
                                <div class="card-body pt-0 p-3 text-center">
                                    <h6 class="text-center mb-0">
                                        {{ $sso->name }}
                                    </h6>
                                    <span class="text-xs">{{ $sso->name_full }}</span>
                                    <hr class="horizontal dark my-3">
                                    <div class="mb-0">
                                        <span class="btn btn-default"
                                              style="width: 100%">Buka &nbsp; <i
                                                class="fad fa-arrow-up-right-from-square"></i></span>
                                    </div>
                                </div>
                            </div>
                        </a>
                    </div>
                @endforeach
                <div class="col-md-3 mb-4">
                    <a href="https://lookerstudio.google.com/u/0/reporting/413af404-7305-44e6-9914-b3d2ef0e0ab7/page/JAy8D"
                       target="_blank">
                        <div class="card card-hover">
                            <div class="card-header mx-4 p-3 d-flex flex-row justify-content-center">

                                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor"
                                     class="bi bi-stack" viewBox="0 0 16 16">
                                    <path
                                        d="m14.12 10.163 1.715.858c.22.11.22.424 0 .534L8.267 15.34a.6.6 0 0 1-.534 0L.165 11.555a.299.299 0 0 1 0-.534l1.716-.858 5.317 2.659c.505.252 1.1.252 1.604 0l5.317-2.66zM7.733.063a.6.6 0 0 1 .534 0l7.568 3.784a.3.3 0 0 1 0 .535L8.267 8.165a.6.6 0 0 1-.534 0L.165 4.382a.299.299 0 0 1 0-.535z"/>
                                    <path
                                        d="m14.12 6.576 1.715.858c.22.11.22.424 0 .534l-7.568 3.784a.6.6 0 0 1-.534 0L.165 7.968a.299.299 0 0 1 0-.534l1.716-.858 5.317 2.659c.505.252 1.1.252 1.604 0z"/>
                                </svg>
                            </div>
                            <div class="card-body pt-0 p-3 text-center">
                                <h6 class="text-center mb-0">
                                    PNBP
                                </h6>
                                <span class="text-xs">Monitoring Capaian PNBP</span>
                                <hr class="horizontal dark my-3">
                                <div class="mb-0">
                                        <span class="btn btn-default"
                                              style="width: 100%">Buka &nbsp; <i
                                                class="fad fa-arrow-up-right-from-square"></i></span>
                                </div>
                            </div>
                        </div>
                    </a>
                </div>
            </div>
        </div>
    </div>
@endsection
