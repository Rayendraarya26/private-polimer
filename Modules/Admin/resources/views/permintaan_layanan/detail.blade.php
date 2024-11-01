@extends('layouts.app')

@section('title', 'Detail Permintaan')


@section('content')
	<div class="app-content flex-column-fluid">
		<!--begin::Content container-->
		<div class="app-container container-xxl">
			<!--begin::Navbar-->
			<div class="card mb-10">
				<div class="card-body pt-9 pb-0">
					<!--begin::Details-->
					<div class="d-flex flex-wrap flex-sm-nowrap mb-6">
						<!--begin::Wrapper-->
						<div class="flex-grow-1">
							<!--begin::Head-->
							<div class="d-flex justify-content-between align-items-start flex-wrap mb-2">
								<!--begin::Details-->
								<div class="d-flex flex-column">
									<!--begin::Status-->
									<div class="d-flex align-items-center mb-1">
										<a href="#" class="text-gray-800 text-hover-primary fs-2 fw-bold me-3">{{ $data->kode_order }}</a>
									</div>
									<!--end::Status-->
									<!--begin::Description-->
									<div class="d-flex flex-wrap fw-semibold mb-4 fs-5 text-gray-500">
									
									</div>
									<!--end::Description-->
								</div>
								<!--end::Details-->
								<div class="d-flex mb-4">
									<a href="{{ url($url);}}" class="btn btn-sm btn-bg-light btn-active-color-primary me-3" >Kembali</a>
								</div>
							</div>
							<!--end::Head-->
							<!--begin::Info-->
							<div class="d-flex flex-wrap justify-content-start">
								<!--begin::Stats-->
								<div class="d-flex flex-wrap">
									<!--begin::Stat-->
									<div class="border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3">
										<!--begin::Number-->
										<div class="d-flex align-items-center">
											<div class="fs-4 fw-bold">{{ $data->tanggal_order->format('d M Y'); }}</div>
										</div>
										<!--end::Number-->
										<!--begin::Label-->
										<div class="fw-semibold fs-6 text-gray-500">Tanggal Order</div>
										<!--end::Label-->
									</div>
									<!--end::Stat-->
									<!--begin::Stat-->
									<div class="border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3">
										<!--begin::Number-->
										<div class="d-flex align-items-center">
											<div class="fs-4 fw-bold">{{ $data->last_sync_at ? $data->last_sync_at?->format('d M Y H:i:s') : '-' }}</div>
										</div>
										<!--end::Number-->
										<!--begin::Label-->
										<div class="fw-semibold fs-6 text-gray-500">Last Sync On Service</div>
										<!--end::Label-->
									</div>
									<!--end::Stat-->
									<!--begin::Stat-->
									<div class="border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3">
										<!--begin::Number-->
										<div class="d-flex align-items-center">
											<div class="fs-4 fw-bold">{{ $data->id_order; }}</div>
										</div>
										<!--end::Number-->
										<!--begin::Label-->
										<div class="fw-semibold fs-6 text-gray-500">ID Data</div>
										<!--end::Label-->
									</div>
									<!--end::Stat-->
								</div>
								<!--end::Stats-->
							</div>
							<!--end::Info-->
						</div>
						<!--end::Wrapper-->
					</div>
					<!--end::Details-->
					<div class="separator"></div>
					<!--begin::Nav-->
					<ul class="nav nav-stretch nav-line-tabs nav-line-tabs-2x border-transparent fs-5 fw-bold">
						<!--begin::Nav item-->
						<li class="nav-item">
							<a class="nav-link text-active-primary py-5 me-6 {{ $detail == 'overview' ? "active" : '' }} {{ $detail == '' ? "active" : '' }}" href="{{ url($url."/".$data->id."/detail?d=overview");}}">Overview</a>
						</li>
						<!--end::Nav item-->
						@if($data->is_given_feedback == 1)
						<!--begin::Nav item-->
						<li class="nav-item">
							<a class="nav-link text-active-primary py-5 me-6 {{ $detail == 'feedback' ? "active" : '' }}" href="{{ url($url."/".$data->id."/detail?d=feedback");}}">Feedback</a>
						</li>
						@endif
						<!--end::Nav item-->
						@if($data->status_order == 'selesai')
						<!--begin::Nav item-->
						<li class="nav-item">
							<a class="nav-link text-active-primary py-5 me-6 {{ $detail == 'file' ? "active" : '' }}" href="{{ url($url."/".$data->id."/detail?d=file");}}">Files</a>
						</li>
						@endif
						<!--end::Nav item-->
					</ul>
					<!--end::Nav-->
				</div>
			</div>
			<!--end::Navbar-->
			
			@if($detail == 'file')
				@include("$view._detail_file")
			@elseif($detail == 'feedback')
				@include("$view._detail_feedback")
			@else
				@include("$view._detail_overview")
			@endif
		</div>
		<!--end::Content container-->
	</div>
@endsection

