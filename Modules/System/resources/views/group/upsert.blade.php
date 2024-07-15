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
                                Nama Grup
                            </label>
                            <div class="col-sm-8">
                                <input class="form-control"
                                       placeholder="Masukkan Nama..."
                                       type="text" name="name" id="name"
                                       value="{{old('name') ?? $data?->name}}">
                            </div>
                        </div>
                        <div class="form-group row mb-3">
                            <label class="col-form-label col-sm-3" for="desc">
                                Deskripsi Grup
                            </label>
                            <div class="col-sm-8">
                                        <textarea class="form-control" placeholder="Masukkaan deskripsi..."
                                                  name="desc"
                                                  id="desc">{{old('desc') ?? $data?->desc}}</textarea>
                            </div>
                        </div>

                        <div class="form-group row mb-3">
                            <label class="col-form-label col-sm-3"
                                   for="is_active">Aktif ?</label>
                            <div class="col-sm-8">
                                <select class="form-control" name="is_active" id="is_active">
                                    <option value="yes">Yes</option>
                                    <option value="no">No</option>
                                </select>
                            </div>
                        </div>

                        <div class="form-group row mb-3">
                            <label class="col-form-label col-sm-3"
                                   for="no_telp">Hak Akses</label>
                            <div class="col-sm-8">
                                <div id="kt_tree_3" class="tree-demo">
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

@push('styles')
    <link href="{{asset('assets/plugins/custom/jstree/jstree.bundle.css')}}" rel="stylesheet" type="text/css"/>
@endpush


@push('scripts')
    <script src="{{asset('assets/plugins/custom/jstree/jstree.bundle.js')}}"></script>
    <script>
        $('#is_active').val('{{$data?->is_active}}')
        $('#kt_tree_3').jstree({
            "plugins": ["wholerow", "checkbox", "types"],
            "core": {
                "themes": {
                    "responsive": false
                },
                "check_callback": false,
                'data': {
                    'url': function (node) {
                        return '{{url("$url/ajax/treeview?group_id=" . $data?->id)}}'; // Demo API endpoint -- Replace this URL with your set endpoint
                    },
                    'data': function (node) {
                        return {
                            'parent': node.id
                        };
                    },
                }
            },
        })
            .on('changed.jstree', function (e, data) {
                let i, j, r = [];
                for (i = 0, j = data.selected.length; i < j; i++) {
                    // make sure not contains _
                    if (data.instance.get_node(data.selected[i]).id.indexOf('_') === -1) {
                        r.push(data.instance.get_node(data.selected[i]).id);
                    }
                }

                let selected = r.join(',')
                return $('#permission').val(selected);
            });
    </script>
@endpush
