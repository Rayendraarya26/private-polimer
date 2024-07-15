@extends('layouts.app')

@section('title', 'Ubah Menu')

@section('content')
    <div class="card" id="kt_card">
        <!--begin::Card body-->
        <div class="card-body">
            <!--begin::Row-->
            <div class="row">
                <div class="col-xl-12">
                    <div class="dt-card">
                        @if ($errors->any())
                            <div class="alert alert-danger" role="alert">
                                {!! implode('', $errors->all('<li>:message</li>')) !!}
                            </div>
                        @endif

                        <form method="post" action="{{ $data ? url("$url/$data->id") : url("$url") }}">
                            @csrf
                            @method($data ? 'PUT' : 'POST')

                            <div class="form-group row mb-3">
                                <label class="col-form-label col-sm-3" for="parent_id">
                                    Induk Menu
                                </label>
                                <div class="col-sm-8">
                                    <select class="form-control" name="parent_id" id="parent_id">
                                        <option value="">Induk Menu</option>
                                        @foreach($parents as $parent)
                                            <option value="{{$parent->id}}">{{$parent->name}}</option>
                                        @endforeach
                                    </select>
                                </div>
                            </div>
                            <div class="form-group row mb-3">
                                <label class="col-form-label col-sm-3" for="name">
                                    Nama Menu
                                </label>
                                <div class="col-sm-8">
                                    <input class="form-control"
                                           placeholder="Masukkan nama..."
                                           type="text" name="name" id="name"
                                           value="{{old('name') ?? $data?->name}}">
                                </div>
                            </div>

                            <div class="form-group row mb-3">
                                <label class="col-form-label col-sm-3" for="desc">
                                    Deskripsi Menu
                                </label>
                                <div class="col-sm-8">
                                                <textarea class="form-control" placeholder="Masukkan deskripsi..."
                                                          name="desc"
                                                          id="desc">{{old('desc') ?? $data?->desc}}</textarea>
                                </div>
                            </div>

                            <div class="form-group row mb-3">
                                <label class="col-form-label col-sm-3" for="order">
                                    Urutan
                                </label>
                                <div class="col-sm-8">
                                    <input type="number" class="form-control"
                                           value="{{old('order') ?? $data?->order}}"
                                           placeholder="Masukkan urutan..." name="order" id="order">
                                </div>
                            </div>

                            <div class="form-group row mb-3">
                                <label class="col-form-label col-sm-3" for="icon">
                                    Icon
                                </label>
                                <div class="col-sm-8">
                                    <input type="text" value="{{$data?->icon}}" class="form-control"
                                           id="icon" name="icon">
                                </div>
                            </div>

                            <div class="form-group row mb-3">
                                <label class="col-form-label col-sm-3"
                                       for="is_active">Aktif ?</label>
                                <div class="col-sm-8">
                                    <select class="form-control" name="is_active" id="is_active">
                                        <option value="yes">Ya</option>
                                        <option value="no">Tidak</option>
                                    </select>
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
    </div>
@endsection

@push('scripts')
    <script>
        $(document).ready(function () {
            $('#is_active').val("{{$data?->is_active ?? 'yes'}}");

            $("#parent_id").val("{{$data?->parent_id}}" ?? 0);
            $('#parent_id').select2({
                height: '40px',
            });
        })
    </script>
@endpush
