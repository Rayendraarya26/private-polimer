@extends('layouts.app')

@section('title', 'Ubah Group')

@section('content')
    <div class="card" id="kt_card">
        <!--begin::Card body-->
        <div class="card-body">
            <!--begin::Row-->
            <div class="row">
                <div class="col-lg-12">
                    @if ($errors->any())
                        <div class="alert alert-danger" role="alert">
                            {!! implode('', $errors->all('<li>:message</li>')) !!}
                        </div>
                    @endif
                    @if(session('message'))
                        <div class="alert alert-success" role="alert">
                            {{ session('message') }}
                        </div>
                    @endif
                    <form method="post" action="{{ $data ? url("$url/$data->id") : url("$url") }}">
                        @csrf
                        @method($data ? 'PUT' : 'POST')

                        <input type="hidden" id="permission" name="permission">
                        <div class="form-group row mb-3">
                            <label class="col-form-label col-sm-3" for="name">
                                Nama Topik
                            </label>
                            <div class="col-sm-8">
                                <input class="form-control"
                                       placeholder="Masukkan Nama Topik..."
                                       type="text" name="name" id="name"
                                       value="{{old('name') ?? $data?->name}}">
                            </div>
                        </div>
                        <div class="form-group row mb-3">
                            <label class="col-form-label col-sm-3" for="desc">
                                Deskripsi Topik
                            </label>
                            <div class="col-sm-8">
                                        <textarea class="form-control" placeholder="Masukkaan deskripsi topik..."
                                                  name="desc"
                                                  id="desc">{{old('desc') ?? $data?->desc}}</textarea>
                            </div>
                        </div>

                        <div class="form-group row mt-10">
                            <div class="offset-3">
                                <button class="btn btn-success" type="submit">
                                    <i class="fas fa-save"></i> Simpan
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
@endsection
