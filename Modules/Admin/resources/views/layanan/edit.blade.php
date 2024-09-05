@extends('layouts.app')

@section('title', 'Edit ' . $data->name)

@section('content')
    @if ($errors->any())
        <div class="alert alert-danger w-100" role="alert">
            {!! implode('', $errors->all('<li>:message</li>')) !!}
        </div>
    @endif

    <form method="post" action="{{ url("$url/$data->id") }}">
        @csrf
        @method('PATCH')
        <div class="card shadow-sm">
            <div class="card-header">
                <h3 class="card-title">Perbarui Data Layanan {{$data->name}}</h3>
                <div class="card-toolbar">
                    <a href="{{ url("$url") }}" type="button" class="btn btn-sm btn-light">
                        Kembali
                    </a>
                </div>
            </div>
            <div class="card-body">
                <div class="form-group row mb-3">
                    <label class="col-form-label col-sm-3">Deskripsi</label>
                    <div class="col-sm-8">
                        <textarea class="form-control" rows="3" name="description" placeholder="Deskripsi layanan"
                        >{{old('description', $data->description)}}</textarea>
                    </div>
                </div>
                {{--<div class="form-group row mb-3">
                    <label class="col-form-label col-sm-3">Icon</label>
                    <div class="col-sm-8">
                        <input class="form-control" type="text" name="icon"
                               value="{{$data->icon}}">
                    </div>
                </div>--}}
                <div class="form-group row mb-3">
                    <label class="col-form-label col-sm-3">Integration URL</label>
                    <div class="col-sm-8">
                        <input class="form-control" placeholder="http://..." type="text"
                               name="integration_url"
                               value="{{old('integration_url', $data->integration_url)}}">
                        <small>Anda juga dapat menginputkan URL internal docker</small>
                    </div>
                </div>
                <div class="form-group row mb-3">
                    <label class="col-form-label col-sm-3">Aktif?</label>
                    <div class="col-sm-8 d-flex flex-row gap-4">
                        <div class="form-check form-check-custom form-check-solid">
                            <input class="form-check-input" type="radio" value="yes" name="is_active"
                                @checked($data->is_active == 'yes')/>
                            <label class="form-check-label" for="flexRadioDefault">Aktif</label>
                        </div>

                        <label class="form-check form-check-custom form-check-solid">
                            <input class="form-check-input" type="radio" value="no" name="is_active"
                                @checked($data->is_active == 'no') />
                            <span class="form-check-label">Tidak</span>
                        </label>
                    </div>
                </div>
            </div>
            <div class="card-footer">
                <button class="btn btn-primary">Simpan</button>
            </div>
        </div>
    </form>
@endsection
