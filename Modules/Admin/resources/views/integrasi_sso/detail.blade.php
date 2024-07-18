@extends('layouts.app')

@section('title', 'Detail App')

@section('content')
    <div class="card">
        <!--begin::Card body-->
        <div class="card-body">

            <div class="form-group row mb-3">
                <label class="col-form-label col-sm-3">Client ID</label>
                <div class="col-sm-8">
                    <input class="form-control" placeholder="Auto Generated..." type="text"
                           value="{{$data?->id}}" readonly>
                </div>
            </div>
            <div class="form-group row mb-3">
                <label class="col-form-label col-sm-3">Client Secret</label>
                <div class="col-sm-8">
                    <input class="form-control" placeholder="Auto Generated..." type="text"
                           value="{{$data?->secret}}" readonly>
                </div>
            </div>
            <div class="form-group row mb-3">
                <label class="col-form-label col-sm-3" for="name">Nama App*</label>
                <div class="col-sm-8">
                    <input class="form-control" placeholder="Masukkan nama..." type="text"
                           name="name" id="name" value="{{$data?->name}}" readonly>
                </div>
            </div>
            <div class="form-group row mb-3">
                <label class="col-form-label col-sm-3" for="redirect">Callback URL*</label>
                <div class="col-sm-8">
                    <input class="form-control" placeholder="Halaman redirect https://application.com/callback..."
                           type="text"
                           name="redirect" id="redirect" value="{{$data?->redirect}}" readonly>
                </div>
            </div>
            <div class="form-group row mb-3">
                <label class="col-form-label col-sm-3" for="accessibility">Accesibility*</label>
                <div class="col-sm-8 d-flex flex-column gap-2">
                    <select class="form-control" name="accessibility" id="accessibility" readonly>
                        <option
                            value="public" {{(old('accessibility') ?? $data?->accessibility) == 'public' ? 'selected' : ''}}>
                            Public
                        </option>
                        <option
                            value="private" {{(old('accessibility') ?? $data?->accessibility) == 'private' ? 'selected' : ''}}>
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
                    <select class="form-control" name="revoked" id="revoked" readonly>
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
        </div>

    </div>
@endsection

