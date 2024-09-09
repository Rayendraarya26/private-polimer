@extends('layouts.app')

@section('title', ($data ? 'Edit' : 'Tambah') . ' App')

@section('content')
    <div class="card">
        <!--begin::Card body-->
        <div class="card-body">
            @if ($errors->any())
                <div class="alert alert-danger" role="alert">
                    {!! implode('', $errors->all('<li>:message</li>')) !!}
                </div>
            @endif
            <form method="post" action="{{ $data ? url("$url/$data->id") : url("$url") }}"
                  enctype="multipart/form-data" onsubmit="$('#btnSubmit').attr('disabled', true)">
                @csrf
                @method($data ? 'PUT' : 'POST')
                <div class="form-group row mb-3">
                    <label class="col-form-label col-sm-3">Client ID</label>
                    <div class="col-sm-8">
                        <input class="form-control" placeholder="Auto Generated..." type="text"
                               value="{{$data?->id}}" disabled>
                    </div>
                </div>
                <div class="form-group row mb-3">
                    <label class="col-form-label col-sm-3">Client Secret</label>
                    <div class="col-sm-8">
                        <input class="form-control" placeholder="Auto Generated..." type="text"
                               value="{{$data?->secret}}" disabled>
                    </div>
                </div>
                <div class="form-group row mb-3">
                    <label class="col-form-label col-sm-3" for="name">Nama App*</label>
                    <div class="col-sm-8">
                        <input class="form-control" placeholder="Masukkan nama..." type="text"
                               name="name" id="name" value="{{old('name') ?? $data?->name}}">
                    </div>
                </div>
                <div class="form-group row mb-3">
                    <label class="col-form-label col-sm-3" for="name_full">Nama Lengkap App*</label>
                    <div class="col-sm-8">
                        <input class="form-control" placeholder="Masukkan nama..." type="text"
                               name="name_full" id="name_full" value="{{old('name_full') ?? $data?->name_full}}">
                        <small>Ditampilkan pada login form Oauth2</small>
                    </div>
                </div>
                <div class="form-group row mb-3">
                    <label class="col-form-label col-sm-3" for="redirect">Callback URL*</label>
                    <div class="col-sm-8">
                        <input class="form-control" placeholder="Halaman redirect https://application.com/callback..."
                               type="text"
                               name="redirect" id="redirect" value="{{old('redirect') ?? $data?->redirect}}">
                        <small>Digunakan saat proses Oauth2</small>
                    </div>
                </div>
                <div class="form-group row mb-3">
                    <label class="col-form-label col-sm-3" for="login_url">Login URL*</label>
                    <div class="col-sm-8">
                        <input class="form-control"
                               placeholder="URL Login di dashboard https://application.com/callback..."
                               type="text" name="login_url" id="login_url"
                               value="{{old('login_url') ?? $data?->login_url}}">
                        <small>URL Login di dashboard</small>
                    </div>
                </div>
                <div class="form-group row mb-3">
                    <label class="col-form-label col-sm-3" for="accessibility">Accesibility*</label>
                    <div class="col-sm-8 d-flex flex-column gap-2">
                        <select class="form-control" name="accessibility" id="accessibility">
                            <option
                                value="public" {{(old('accessibility') ?? $data?->accessibility) == \App\Enums\OauthClientAccesibility::PUBLIC ? 'selected' : ''}}>
                                Public
                            </option>
                            <option
                                value="private" {{(old('accessibility') ?? $data?->accessibility) == \App\Enums\OauthClientAccesibility::PRIVATE ? 'selected' : ''}}>
                                Private
                            </option>
                        </select>
                        <small>
                            <ul>
                                <li>Public: Aplikasi dapat diakses oleh <b>umum</b>.</li>
                                <li>Private: Aplikasi hanya dapat diakses oleh <b>internal BBKKP</b>.</li>
                            </ul>
                        </small>
                    </div>
                </div>
                <div class="form-group row mb-3">
                    <label class="col-form-label col-sm-3" for="name">Izinkan Aplikasi*</label>
                    <div class="col-sm-8 d-flex flex-column gap-2">
                        <select class="form-control" name="revoked" id="revoked">
                            <option value="0" {{(old('revoked') ?? $data?->revoked) == 0 ? 'selected' : ''}}>Ya</option>
                            <option value="1" {{(old('revoked') ?? $data?->revoked) == 1 ? 'selected' : ''}}>Tidak
                            </option>
                        </select>
                        <small>
                            <ul>
                                <li>Ya: <b>Beri izin</b> aplikasi untuk menggunkan SSO BBKKP.</li>
                                <li>Tidak: <b>Cabut izin</b> aplikasi sehingga tidak bisa menggunakan SSO BBKKP.</li>
                            </ul>
                        </small>
                    </div>
                </div>
                <div class="form-group row mt-5">
                    <div class="form-buttons-w offset-sm-3 col-sm-8">
                        <button class="btn btn-primary btn-sm" type="submit" id="btnSubmit">
                            <i class="fas fa-save"></i> Simpan
                        </button>
                    </div>
                </div>
            </form>
        </div>

    </div>
@endsection

