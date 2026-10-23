<!-- Modal Upsert Accordion -->
<div class="modal fade" id="upsertModal" tabindex="-1" aria-labelledby="upsertModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content" id="upsertVue">
            <div class="modal-header">
                <h5 class="modal-title" id="upsertModalLabel">@{{ mode === 'create' ? 'Tambah' : 'Edit' }} Accordion</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form @submit.prevent="handleSubmit">
                    <div class="mb-3">
                        <label for="accordion_title" class="form-label fw-semibold">Judul Accordion <span class="text-danger">*</span></label>
                        <input type="text" class="form-control" id="accordion_title" v-model="form.title" required placeholder="Contoh: Kenapa Harus JIS ?">
                    </div>
                    <div class="mb-3">
                        <label class="form-label fw-semibold">Deskripsi / Konten <span class="text-danger">*</span></label>
                        <div ref="editor" style="height: 220px;"></div>
                    </div>
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label for="accordion_order" class="form-label fw-semibold">Urutan Tampilan <span class="text-danger">*</span></label>
                            <input type="number" class="form-control" id="accordion_order" v-model="form.order" required min="1">
                            <small class="text-muted">Nomor urutan kemunculan pada landing page.</small>
                        </div>
                        <div class="col-md-6 mb-3 d-flex align-items-center">
                            <div class="form-check mt-3">
                                <input class="form-check-input" type="checkbox" id="accordion_default_open" v-model="form.is_default_open">
                                <label class="form-check-label fw-semibold" for="accordion_default_open">
                                    Buka Secara Default
                                </label>
                                <div class="text-muted small">Jika dicentang, accordion akan langsung terbuka saat halaman dimuat.</div>
                            </div>
                        </div>
                    </div>
                    <input type="hidden" v-model="form.id">
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Batal</button>
                <button type="button" class="btn btn-primary" @click="handleSubmit">
                    @{{ mode === 'create' ? 'Simpan' : 'Perbarui' }}
                </button>
            </div>
        </div>
    </div>
</div>

@push('scripts')
    <script>
        window.upsertVue = createApp({
            data() {
                return {
                    mode: 'create',
                    editor: null,
                    form: {
                        id: null,
                        title: '',
                        description: '',
                        order: 1,
                        is_default_open: false,
                    },
                    modal: null,
                };
            },
            mounted() {
                this.modal = new bootstrap.Modal(document.getElementById('upsertModal'), {
                    keyboard: false,
                    backdrop: 'static',
                });

                const quillOptions = {
                    modules: {
                        toolbar: [
                            ['bold', 'italic', 'underline', 'strike'],
                            ['link', 'image'],
                            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                            [{ 'direction': 'rtl' }],
                            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                            [{ 'color': [] }, { 'background': [] }],
                            [{ 'font': [] }],
                            [{ 'align': [] }],
                        ]
                    },
                    placeholder: 'Tuliskan deskripsi atau konten accordion...',
                    theme: 'snow'
                };

                this.editor = new Quill(this.$refs.editor, quillOptions);

                this.editor.on('text-change', () => {
                    this.form.description = this.editor.getText().trim() ? this.editor.root.innerHTML : '';
                });
            },
            methods: {
                show(data = null) {
                    if (data) {
                        this.mode = 'edit';
                        const desc = typeof data.description === 'object' && data.description !== null
                            ? (data.description.id || '')
                            : (data.description || '');
                        const title = typeof data.title === 'object' && data.title !== null
                            ? (data.title.id || '')
                            : (data.title || '');

                        this.form = {
                            id: data.id || null,
                            title: title,
                            description: desc,
                            order: data.order || 1,
                            is_default_open: Boolean(data.is_default_open),
                        };

                        if (this.editor) {
                            this.editor.root.innerHTML = desc;
                        }
                    } else {
                        this.mode = 'create';
                        this.form = {
                            id: null,
                            title: '',
                            description: '',
                            order: 1,
                            is_default_open: false,
                        };

                        if (this.editor) {
                            this.editor.root.innerHTML = '';
                        }
                    }
                    this.modal.show();
                },
                hide() {
                    this.modal.hide();
                },
                handleSubmit() {
                    if (this.editor) {
                        this.form.description = this.editor.getText().trim() ? this.editor.root.innerHTML : '';
                    }

                    if (!this.form.title || !this.form.description) {
                        Swal.fire({
                            icon: 'warning',
                            title: 'Peringatan',
                            text: 'Judul dan Deskripsi wajib diisi!',
                        });
                        return;
                    }

                    let formData = new FormData();
                    if (this.form.id) {
                        formData.append('id', this.form.id);
                    }
                    formData.append('title', this.form.title);
                    formData.append('description', this.form.description);
                    formData.append('order', this.form.order);
                    formData.append('is_default_open', this.form.is_default_open ? '1' : '0');

                    let url;
                    if (this.mode === 'create') {
                        url = '{{ url("$url") }}/store_accordion/update';
                    } else {
                        url = '{{ url("$url") }}/update_accordion/update';
                    }

                    Swal.fire({
                        title: 'Mohon tunggu...',
                        allowOutsideClick: false,
                        didOpen: () => {
                            Swal.showLoading()
                        },
                    });

                    $.ajax({
                        url: url,
                        method: 'POST',
                        data: formData,
                        headers: {
                            'X-CSRF-TOKEN': '{{ csrf_token() }}'
                        },
                        processData: false,
                        contentType: false,
                        success: (res) => {
                            this.hide();
                            if (window.accordionVue && typeof window.accordionVue.refreshListAccordion === 'function') {
                                window.accordionVue.refreshListAccordion();
                            }
                            Swal.fire({
                                icon: 'success',
                                title: 'Berhasil',
                                text: res.message || 'Data accordion berhasil disimpan.',
                            });
                        },
                        error: (xhr) => {
                            Swal.fire({
                                icon: 'error',
                                title: 'Gagal',
                                text: xhr.responseJSON?.message || 'Terjadi kesalahan saat menyimpan data.',
                            });
                        }
                    });
                },
            },
        }).mount('#upsertVue');
    </script>
@endpush
