@extends('layouts.app')

@section('title', 'Home')

@section('content')
    <div class="card" id="kt_card">
        <!--begin::Card body-->
        <div class="card-body">
            <!--begin::Row-->
            <div class="row">
                <div class="col-md-12">
                    Selamat Datang {{ Auth::user()->name }}
                </div>
            </div>
        </div>
    </div>
@endsection
