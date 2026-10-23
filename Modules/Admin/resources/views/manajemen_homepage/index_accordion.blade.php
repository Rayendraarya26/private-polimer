@extends("$view.index_layout")

@section('title', 'Manage Homepage Accordion')

@section('child_content')
<div class="widget-content searchable-container list" id="accordionVue">
    <div class="form-with-tabs">
        <h5 class="card-title fw-semibold mb-4">
            Daftar Accordion / Tanya Jawab yang tampil pada Homepage
        </h5>

        <div class="d-flex flex-row-reverse mb-3">
            <button class="btn btn-primary btn-sm" @click="handleAddAccordion()">
                <i class="fas fa-plus me-1"></i> Tambah Accordion
            </button>
        </div>

        {{-- Tabel Daftar Accordion --}}
        <div class="table-responsive">
            <table class="table table-bordered table-hover align-middle">
                <thead class="table-light">
                    <tr>
                        <th style="width: 60px;">Urut</th>
                        <th>Judul (Pertanyaan)</th>
                        <th>Deskripsi (Konten)</th>
                        <th style="width: 120px;" class="text-center">Default Open</th>
                        <th style="width: 100px;" class="text-center">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in listAccordion" :key="item.id">
                        <td>@{{ item.order }}</td>
                        <td class="fw-bold">@{{ item.title }}</td>
                        <td v-html="item.description"></td>
                        <td class="text-center">
                            <span :class="item.is_default_open ? 'badge bg-success' : 'badge bg-secondary'">
                                @{{ item.is_default_open ? 'Ya' : 'Tidak' }}
                            </span>
                        </td>
                        <td class="text-center">
                            <button class="btn btn-sm btn-primary me-1" @click="handleEdit(item)">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-danger" @click="handleDelete(item.id)">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</div>
@endsection
