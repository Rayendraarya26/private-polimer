@extends('layouts.no_header')

@section('title', "FAQ $layanan->name :: $faq->question")

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

        .faq-question {
            font-size: 2.5rem;
        }

        .faq-answer {
            font-size: 1.25rem;
        }

        /*Align Center Iframe that have class ql-video ql-align-center */
        iframe.ql-video.ql-align-center {
            margin-left: auto;
            margin-right: auto;
            display: block;
        }

        @media screen and (min-width: 768px) {
            .faq-container {
                gap: 5rem;
            }

            .faq-title {
                font-size: 3rem;
            }

            .faq-layanan-icon {
                width: 4.5rem;
            }

            .faq-subtitle {
                font-size: 1.5rem;
            }

            .faq-question {
                font-size: 3rem;
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
            <h3 class="faq-title mb-0">{{ $layanan->name }}</h3>
        </div>
        <h2 class="faq-subtitle text-left">
            <a href="{{ route('faq') }}">FAQ</a> / <a
                href="{{ route('faq.topic', $layanan->slug) }}"> {{ $layanan->name }}</a> / {{ $faq->question }}
        </h2>
        <div class="d-flex flex-column gap-2 text-left">
            <h1 class="faq-question">{{ $faq->question }}</h1>
            <p class="faq-answer">{!! $faq->answer !!}</p>
        </div>
    </div>
@endsection
