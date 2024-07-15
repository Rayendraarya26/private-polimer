@extends('eksternal::layouts.master')

@section('content')
    <h1>Hello World</h1>

    <p>Module: {!! config('eksternal.name') !!}</p>
@endsection
