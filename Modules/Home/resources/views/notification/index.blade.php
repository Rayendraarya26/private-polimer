@extends('layouts.app')

@section('title', 'Notification')

@section('content')
    <div class="card" id="kt_card">
        @if($total > 0)
            <!--begin::Card header-->
            <div class="pt-10 px-10">
                <div class="d-flex flex-wrap justify-content-between">
                    <!--begin::Card title-->
                    <div class="card-title text-center">
                        <h3 class="fw-bolder text-dark">{{$total}} Notifikasi belum dibuka</h3>
                    </div>
                    <!--end::Card title-->

                    <div>
                        <a href="{{url('notifications/mark-all-as-read')}}" class="btn btn-primary btn-sm">
                            <i class="fas fa-check-double"></i>
                            Baca Semua
                        </a>
                    </div>
                </div>
            </div>
        @endif

        <!--begin::Card body-->
        <div class="card-body">
            <!--begin::Row-->
            <div class="row">
                <div class="timeline">

                    @foreach($notif as $n)
                        <!--begin::Timeline item-->
                        <div class="timeline-item">
                            <!--begin::Timeline line-->
                            <div class="timeline-line w-40px"></div>
                            <!--end::Timeline line-->
                            <!--begin::Timeline icon-->
                            <div class="timeline-icon symbol symbol-circle symbol-40px me-4">
                                <div class="symbol-label {{$n->is_read == "yes" ? 'bg-light' : 'bg-primary'}}">
                                    <!--begin::Svg Icon | path: icons/duotune/communication/com003.svg-->
                                    <span
                                        class="svg-icon svg-icon-2 {{$n->is_read == "yes" ? 'svg-icon-gray-500' : ' svg-icon-white'}}">
                                        <i class="fas fa-message"></i>
                                    </span>
                                    <!--end::Svg Icon-->
                                </div>
                            </div>
                            <!--end::Timeline icon-->
                            <!--begin::Timeline content-->
                            <div class="timeline-content mb-10 mt-n1">
                                <!--begin::Timeline heading-->
                                <div class="pe-3 mb-5">
                                    <!--begin::Title-->
                                    <div class="fs-5 fw-semibold mb-2">
                                        <a href="{{ url('notifications/open/' . $n->id) }}" class="text-dark">
                                            {{ $n->title }}
                                        </a>
                                    </div>
                                    <!--end::Title-->
                                    <!--begin::Description-->
                                    <div class="mt-1 fs-6">
                                        <div>
                                            <a href="{{ url('notifications/open/' . $n->id) }}" class="text-dark">
                                                {{ $n->content }}
                                            </a>
                                        </div>

                                        <!--begin::Info-->
                                        <div class="text-muted me-2 fs-7">{{ $n->created_at->isoFormat('LLLL') }}</div>
                                        <!--end::Info-->
                                    </div>
                                    <!--end::Description-->
                                </div>
                                <!--end::Timeline heading-->
                            </div>
                            <!--end::Timeline content-->
                        </div>
                        <!--end::Timeline item-->
                    @endforeach

                    {{ $notif->links() }}
                </div>
            </div>
        </div>
    </div>
@endsection
