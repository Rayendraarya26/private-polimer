@extends('layouts.app')

@section('title', 'Manage Menu Action')

@section('content')
    <div class="card" id="vue-app">
        <!--begin::Card header-->
        <div class="card-header">
            <div class="card-title">
                {{ $menu->name }}
            </div>

        </div>

        <!--begin::Card body-->
        <div class="card-body">
            <!--begin::Row-->
            <div class="row">
                <div class="col-12">
                    <div class="d-flex flex-wrap justify-content-center pb-5">
                        <div class="mx-1 w-100 w-md-200px">
                            <label class="form-label">Nama</label>
                            <input type="text" class="form-control" v-model="form.payload.name"/>
                        </div>
                        <div class="mx-1 w-100 w-md-200px">
                            <label class="form-label">Module</label>
                            <input type="text" class="form-control" v-model="form.payload.mod"/>

                        </div>
                        <div class="mx-1 w-100 w-md-400px">
                            <label class="form-label">Function</label>
                            <input type="text" class="form-control" v-model="form.payload.fun"/>
                        </div>
                        <div class="mx-1 mt-8 w-100 w-md-200px">
                            <button class="btn btn-light-primary" title="Simpan" @click="handleSave">
                                <i class="fa-solid fa-save"></i>
                            </button>
                            &nbsp;
                            <button v-if="this.form.method === 'PUT'" class="btn btn-light-warning" title="Cancel"
                                    @click="handleCancelEdit">
                                <i class="fa-solid fa-close"></i>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="col-12 table-responsive">
                    <table class="table">
                        <thead>
                        <tr>
                            <th>Nama</th>
                            <th>Lokasi Controller</th>
                            <th>Terakhir Diperbarui</th>
                            <th>Aksi</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="d in listItem">
                            <td>@{{ d.name }}</td>
                            <td>@{{ d.controller }}</td>
                            <td>@{{ formatDate(d.updated_at || d.created_at) }}</td>
                            <td>
                                <button class="btn btn-light-primary btn-sm"
                                        @click="handleEdit(d.id, d.name, d.controller)">
                                    <i class="fa-solid fa-pencil"></i>
                                </button>
                                &nbsp;
                                <button class="btn btn-light-danger btn-sm" @click="handleDelete(d.id, d.name)">
                                    <i class="fa-solid fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
@endsection

@push('scripts')
    <script>
        const { createApp } = Vue

        createApp({
            data() {
                return {
                    form: {
                        method: 'POST',
                        payload: {
                            id: '',
                            name: '',
                            mod: '',
                            fun: ''
                        }
                    },
                    listItem: [],
                }
            },
            created() {
                this.apiGet();
            },
            methods: {
                formatDate(date) {
                    return moment(date).format('DD MMMM YYYY HH:mm:ss');
                },
                formatController(mod, fun) {
                    if (mod === '' || fun === '') return '#';
                    return `Modules\\${mod}\\Http\\Controllers\\${fun}`;
                },
                handleCancelEdit() {
                    this.form.method = 'POST';
                    this.form.payload.id = '';
                    this.form.payload.name = '';
                    this.form.payload.mod = '';
                    this.form.payload.fun = '';
                },
                handleEdit(id, name, controller) {
                    this.form.method = 'PUT';
                    this.form.payload.id = id;
                    this.form.payload.name = name;

                    // extract module and function from controller
                    let arr = controller.split('\\');
                    if (arr.length > 2) {
                        this.form.payload.mod = arr[1];
                        this.form.payload.fun = arr[arr.length - 1];
                    }else{
                        this.form.payload.mod = ''
                        this.form.payload.fun = '#'
                    }
                },
                handleDelete(id, name) {
                    Swal.fire({
                        title: `Apakah anda yakin?`,
                        text: `Hapus "${name}". Data yang dihapus tidak dapat dikembalikan!`,
                        icon: 'warning',
                        showCancelButton: true,
                        buttonsStyling: false,
                        showLoaderOnConfirm: true,
                        confirmButtonText: "Ya!",
                        cancelButtonText: "Tidak, batalkan",
                        customClass: {
                            confirmButton: "btn fw-bold btn-danger",
                            cancelButton: "btn fw-bold btn-active-light-primary"
                        },
                    }).then((result) => {
                        if (result.isConfirmed) {
                            this.apiDelete(id);
                        }
                    })
                },
                handleSave() {
                    if (this.form.method === 'POST') {
                        this.apiCreate();
                    } else {
                        this.apiUpdate(this.form.payload.id);
                    }
                },
                apiGet() {
                    axios.get('{{ url("$url/ajax/items") }}')
                        .then((response) => {
                            this.listItem = response.data.results;
                        })
                        .catch((error) => {
                            alert(error.response.data.message)
                        });
                },
                apiDelete(id) {
                    axios.delete(`{{ url("$url") }}/${id}`)
                        .then((response) => {
                            this.apiGet();
                            toastr.success(response.data.message)
                        })
                        .catch((error) => {
                            alert(error.response.data.message)
                        });
                },
                apiCreate() {
                    axios.post('{{ url("$url") }}', {
                        name: this.form.payload.name,
                        controller: this.formatController(this.form.payload.mod, this.form.payload.fun)
                    })
                        .then((response) => {
                            this.apiGet()
                            toastr.success(response.data.message)
                        })
                        .catch((error) => {
                            alert(error.response.data.message)
                        });
                },
                apiUpdate(id) {
                    axios.put(`{{url("$url")}}/${id}`, {
                        name: this.form.payload.name,
                        controller: this.formatController(this.form.payload.mod, this.form.payload.fun)
                    })
                        .then((response) => {
                            this.apiGet()
                            toastr.success(response.data.message)
                            this.handleCancelEdit()
                        })
                        .catch((error) => {
                            alert(error.response.data.message)
                        });
                },
            }
        }).mount('#vue-app')
    </script>
@endpush
