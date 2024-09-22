<div class="d-flex flex-row justify-content-center gap-5 pb-10">
    <a href="{{ url('/') }}" class="text-center fw-bold text-decoration-underline">
        JIS
    </a>
    {{--<a href="#" class="text-center fw-bold text-decoration-underline">
        Panduan
    </a>--}}
    <a href="{{ route('faq') }}" class="text-center fw-bold text-decoration-underline">
        FAQ
    </a>
    <a href="{{ route('tte.verify') }}" class="text-center fw-bold text-decoration-underline">
        Verifikasi Dokumen
    </a>

    @if(auth()->check())
        <a href="{{ route('home') }}" class="text-center fw-bold text-decoration-underline">
            Polimer
        </a>
    @else
        <a href="{{ route('auth.login') }}" class="text-center fw-bold text-decoration-underline">
            Login
        </a>
    @endif
</div>
