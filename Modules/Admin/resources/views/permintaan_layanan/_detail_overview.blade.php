<!--begin::Card-->
<div class="card">
	<!--begin::Card header-->
	<div class="card-header">
		<!--begin::Card header-->
		<div class="card-title fs-3 fw-bold">Overview Data Order</div>
		<!--end::Card header-->
	</div>
	<!--end::Card header-->
	<!--begin::Card body-->
	<div class="card-body">
		<!--begin::Row-->
		<div class="row mb-8">
			<!--begin::Col-->
			<div class="col-xl-3">
				<div class="fs-6 fw-semibold mt-2 mb-3">Current Status</div>
			</div>
			<!--end::Col-->
			<!--begin::Col-->
			<div class="col-xl-9">
				<span class="badge badge-light-{{ $data->status_order == 'ditolak' ? 'danger' : 'success' }} fw-bold px-4 py-3">{{ strtoupper($data->status_order) }}</span>
			</div>
			<!--end::Col-->
		</div>
		<!--end::Row-->
		<!--begin::Row-->
		<div class="row mb-8">
			<!--begin::Col-->
			<div class="col-xl-3">
				<div class="fs-6 fw-semibold mt-2 mb-3">Layanan</div>
			</div>
			<!--end::Col-->
			<!--begin::Col-->
			<div class="col-xl-9">
				{{$data->layanan->name}}
			</div>
			<!--end::Col-->
		</div>
		<!--end::Row-->
		@foreach($data_detail as $key => $val)
		<div class="row mb-8">
			<!--begin::Col-->
			<div class="col-xl-3">
				<div class="fs-6 fw-semibold mt-2 mb-3">{{ucfirst($key)}}</div>
			</div>
			<!--end::Col-->
			<!--begin::Col-->
			<div class="col-xl-9">
				{{$val}}
			</div>
			<!--end::Col-->
		</div>
		@endforeach
	</div>
	<!--end::Card body-->
</div>
<!--end::Card-->