@extends('layouts.app')

@section('title', 'Update User')

@section('content')
    <div class="card" id="vue-app">
        <!--begin::Card body-->
        <div class="card-body">
            <div class="row">
                <div class="col-lg-12">
                    @if ($errors->any())
                        <div class="alert alert-danger" role="alert">
                            {!! implode('', $errors->all('<li>:message</li>')) !!}
                        </div>
                    @endif
                    <form method="post" action="{{ $data ? url("$url/$data->id") : url("$url") }}"
                          enctype="multipart/form-data">
                        @csrf
                        @method($data ? 'PUT' : 'POST')
                        <div class="form-group row mb-3">
                            <label class="col-form-label col-sm-3"
                                   for="fullname">Nama*</label>
                            <div class="col-sm-8">
                                <input class="form-control" placeholder="Masukkan fullname ..."
                                       type="text"
                                       name="name" id="name"
                                       value="{{ old('name') ?? $data?->name }}">
                            </div>
                        </div>
                        <div class="form-group row mb-3">
                            <label class="col-form-label col-sm-3" for="email">Email*</label>
                            <div class="col-sm-8">
                                <input class="form-control" placeholder="Masukkan email..." type="email"
                                       name="email" id="email"
                                       value="{{old('email') ?? $data?->email}}">
                            </div>
                        </div>
                        <div class="form-group row mb-3">
                            <label class="col-form-label col-sm-3" for="username">username*</label>
                            <div class="col-sm-8">
                                <input class="form-control" placeholder="Masukkan username..."
                                       type="text"
                                       name="username" id="username"
                                       value="{{old('username') ?? $data?->username}}">
                            </div>
                        </div>

                        <div class="form-group row mb-3">
                            <label class="col-form-label col-sm-3" for="password">Kata sandi*</label>
                            <div class="col-sm-8">
                                <input class="form-control" placeholder="Masukkan kata sandi..."
                                       type="password" name="password" id="password"
                                       value="{{old('password')}}">
                            </div>
                        </div>

                        <div class="form-group row mb-3">
                            <label class="col-form-label col-sm-3"
                                   for="password_confirmation">Konfirmasi Password*</label>
                            <div class="col-sm-8">
                                <input class="form-control"
                                       placeholder="Masukkan ulang kata sandi..."
                                       type="password" name="password_confirmation"
                                       id="password_confirmation"
                                       value="{{old('password_confirmation')}}">
                            </div>
                        </div>

                        <div class="form-group row mb-3">
                            <label class="col-sm-3 col-form-label" for="tgl_lahir">
                                Foto
                                <small>(jpg/jpeg/png)</small>
                            </label>
                            <div class="col-sm-4">
                                <input class="form-control" type="file" name="foto" id="foto"
                                       accept="image/*">
                            </div>
                            <div class="col-sm-4">
                                @if(!empty($data->picture))
                                    <div style="text-align: center; justify-content: center">
                                        <img
                                            src="{{ \Illuminate\Support\Facades\Storage::disk('public')->url($data->picture) }}"
                                            style="width: 200px" alt="foto">
                                    </div>
                                @endif
                            </div>
                        </div>

                        <div class="form-group row mb-3">
                            <label class="col-form-label col-sm-3"
                                   for="is_active">User Aktif?*</label>
                            <div class="col-sm-8">
                                <div class="d-flex flex-row gap-4">
                                    <div class="form-check form-check-custom form-check-solid">
                                        <input class="form-check-input" type="radio"
                                               value="yes" {{$data?->is_active == "yes" ? "checked" : ""}}
                                               name="is_active" aria-label="is_active"/>
                                        <label class="form-check-label" for="flexRadioDefault">
                                            Aktif
                                        </label>
                                    </div>

                                    <div class="form-check form-check-custom form-check-solid">
                                        <input class="form-check-input" type="radio"
                                               value="no" {{$data?->is_active == "no" ? "checked" : ""}}
                                               name="is_active" aria-label="is_active"/>
                                        <label class="form-check-label" for="flexRadioDefault">
                                            Tidak Aktif
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <hr>
                        <div class="form-group row mb-3">
                            <label class="col-form-label col-sm-3"
                                   for="no_telp">Group</label>
                            <div class="col-sm-8">
                                <div class="row">
                                    @foreach($groups as $group)
                                        <div class="col-6 pt-2">
                                            <label class="form-check-label">
                                                <input class="form-check-input" type="checkbox"
                                                       name="group[]" v-model="groups"
                                                       value="{{$group->id}}">
                                                {{$group->name}}
                                            </label>
                                        </div>
                                        <div class="col-6">
                                            <label class="form-check-label">
                                                <input class="form-check-input" type="radio"
                                                       name="group_default" value="{{$group->id}}"
                                                    {{$group->id == $default_group ? "checked" :""}}>
                                                default
                                            </label>
                                        </div>
                                    @endforeach
                                </div>
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

@push('scripts')
    <script>
        const { createApp } = Vue;

        createApp({
            data() {
                return {
                    groups: {!! json_encode($selected_group_id) !!},
                }
            },
            mounted() {

            },
            methods: {},
        }).mount('#vue-app');
    </script>
@endpush
