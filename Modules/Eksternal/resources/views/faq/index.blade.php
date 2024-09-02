@extends('layouts.no_header')

@section('title', 'FAQ')

@push('styles')
    <style>
        .faq-container {
            gap: 3rem;
        }
        .faq-title {
            padding-top: 2rem;
            font-size: 3rem;
        }
        .faq-subtitle {
            font-size: 1.25rem;
        }
        .faq-card {
            width: 100%;
            padding: 1.5rem;
            box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
            height: 8rem;
            cursor: pointer;
            color: black;
            display: flex;
            border-radius: 2.25rem;
        }
        .faq-layanan-content {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-top: auto;
            margin-bottom: auto;
        }
        .faq-layanan-content h3 {
            font-size: 1.15rem !important;
        }
        .faq-layanan-icon {
            width: 3.5rem;
            aspect-ratio: 1/1;
            object-fit: cover;
            object-position: center;
        }

        @media screen and (min-width: 768px) {
            .faq-container {
                gap: 2rem;
            }
        }
    </style>
@endpush

@section('content')
    <div class="w-100 d-flex flex-column align-items-center faq-container">
        <h1 class="faq-title">FAQ Layanan</h1>
        <h2 class="faq-subtitle">Telusuri Layanan</h2>
        <div class="row">
            @foreach($listLayanan as $layanan)
                <div class="col-12 col-md-6 col-lg-4 col-xl-3 p-2 p-lg-4">
                    <a href="{{ route('faq.topic', $layanan->slug) }}">
                        <div class="faq-card border border-2">
                            <div class="faq-layanan-content">
                                @if($layanan->icon)
                                    <img
                                        alt=""
                                        draggable="false"
                                        src="{{ $layanan->icon }}"
                                        class="faq-layanan-icon"
                                    />
                                @endif
                                <h3 class="mb-0">
                                    {{ $layanan->name }}
                                </h3>
                            </div>
                        </div>
                    </a>
                </div>
            @endforeach
        </div>
    </div>
@endsection
