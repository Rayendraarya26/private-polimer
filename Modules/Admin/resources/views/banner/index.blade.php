@extends('layouts.app')

@section('title', 'Master Divisi')

@section('content')
    <div class="card" id="kt_card">
        <h2>Banner</h2>
    </div>

@endsection

@push('styles')
    <link href="{{asset('assets/plugins/custom/datatables/datatables.bundle.css')}}" rel="stylesheet" type="text/css"/>
@endpush

@push('scripts')
    <script src="{{asset('assets/plugins/custom/datatables/datatables.bundle.js')}}"></script>

@endpush
