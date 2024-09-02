@extends('layouts.no_header')

@section('title', "FAQ $layanan->name")

@push('styles')
    <style>
        .faq-container {
            gap: 3rem;
        }
        .faq-title {
            font-size: 1.5rem;
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
            width: 2.75rem;
            aspect-ratio: 1/1;
            object-fit: cover;
            object-position: center;
        }

        @media screen and (min-width: 768px) {
            .faq-container {
                gap: 2rem;
            }
            .faq-title {
                font-size: 3rem;
            }
            .faq-layanan-icon {
                width: 4.5rem;
            }
        }
    </style>
@endpush

@section('content')
    <div class="w-100 d-flex flex-column align-items-center faq-container">
        <div class="d-inline-flex align-items-center gap-4 gap-lg-5">
            @if($layanan->icon)
                <img
                    alt=""
                    draggable="false"
                    src="{{ $layanan->icon }}"
                    class="faq-layanan-icon"
                />
            @endif
            <h1 class="faq-title mb-0">{{ $layanan->name }}</h1>
        </div>
        <h2 class="faq-subtitle">Telusuri Topik Pertanyaan</h2>
        <div class="d-flex flex-column gap-4">
            @foreach($listFaq as $faq)
                <a href="{{ route('faq.detail', [$layanan->slug, $faq->slug]) }}">
                    <h3 class="border-bottom border-bottom-2 border-black pb-2">
                        {{ $faq->question }}
                    </h3>
                </a>
            @endforeach
        </div>
    </div>
@endsection
