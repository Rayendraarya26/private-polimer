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
                    <!-- Nav Tabs Localization -->
                    <ul class="nav nav-tabs nav-line-tabs mb-3 fs-6" role="tablist">
                        <li class="nav-item">
                            <a class="nav-link active fw-bold" data-bs-toggle="tab" href="#accordion_tab_id">🇮🇩 Indonesia</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link fw-bold" data-bs-toggle="tab" href="#accordion_tab_en">🇬🇧 English</a>
                        </li>
                    </ul>

                    <div class="tab-content mb-3">
                        <!-- Tab Indonesia -->
                        <div class="tab-pane fade show active" id="accordion_tab_id" role="tabpanel">
                            <div class="mb-3">
                                <label for="accordion_title_id" class="form-label fw-semibold">Judul Accordion (Indonesia) <span class="text-danger">*</span></label>
                                <input type="text" class="form-control" id="accordion_title_id" v-model="form.title_id" placeholder="Contoh: Kenapa Harus JIS ?">
                            </div>
                            <div class="mb-3">
                                <label class="form-label fw-semibold">Deskripsi / Konten (Indonesia) <span class="text-danger">*</span></label>
                                <div ref="editorId" style="height: 200px;"></div>
                            </div>
                        </div>

                        <!-- Tab English -->
                        <div class="tab-pane fade" id="accordion_tab_en" role="tabpanel">
                            <div class="mb-3">
                                <label for="accordion_title_en" class="form-label fw-semibold">Judul Accordion (English)</label>
                                <input type="text" class="form-control" id="accordion_title_en" v-model="form.title_en" placeholder="Example: Why Choose JIS ?">
                            </div>
                            <div class="mb-3">
                                <label class="form-label fw-semibold">Deskripsi / Konten (English)</label>
                                <div ref="editorEn" style="height: 200px;"></div>
                            </div>
                        </div>
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
                    editorId: null,
                    editorEn: null,
                    form: {
                        id: null,
                        title_id: '',
                        title_en: '',
                        description_id: '',
                        description_en: '',
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
                    theme: 'snow'
                };

                this.editorId = new Quill(this.$refs.editorId, {
                    ...quillOptions,
                    placeholder: 'Tuliskan deskripsi atau konten accordion (Indonesia)...',
                });

                this.editorEn = new Quill(this.$refs.editorEn, {
                    ...quillOptions,
                    placeholder: 'Write accordion description or content (English)...',
                });

                this.editorId.on('text-change', () => {
                    this.form.description_id = this.editorId.getText().trim() ? this.editorId.root.innerHTML : '';
                });

                this.editorEn.on('text-change', () => {
                    this.form.description_en = this.editorEn.getText().trim() ? this.editorEn.root.innerHTML : '';
                });
            },
            methods: {
                show(data = null) {
                    if (data) {
                        this.mode = 'edit';
                        const title = data.title;
                        const desc = data.description;
                        const titleId = typeof title === 'object' && title !== null ? (title.id || '') : (title || '');
                        const titleEn = typeof title === 'object' && title !== null ? (title.en || '') : '';
                        const descId = typeof desc === 'object' && desc !== null ? (desc.id || '') : (desc || '');
                        const descEn = typeof desc === 'object' && desc !== null ? (desc.en || '') : '';

                        this.form = {
                            id: data.id || null,
                            title_id: titleId,
                            title_en: titleEn,
                            description_id: descId,
                            description_en: descEn,
                            order: data.order || 1,
                            is_default_open: Boolean(data.is_default_open),
                        };

                        if (this.editorId) {
                            this.editorId.root.innerHTML = descId;
                        }
                        if (this.editorEn) {
                            this.editorEn.root.innerHTML = descEn;
                        }
                    } else {
                        this.mode = 'create';
                        this.form = {
                            id: null,
                            title_id: '',
                            title_en: '',
                            description_id: '',
                            description_en: '',
                            order: 1,
                            is_default_open: false,
                        };

                        if (this.editorId) {
                            this.editorId.root.innerHTML = '';
                        }
                        if (this.editorEn) {
                            this.editorEn.root.innerHTML = '';
                        }
                    }

                    // Reset to first tab (Indonesia)
                    const firstTab = document.querySelector('#upsertModal .nav-link[href="#accordion_tab_id"]');
                    if (firstTab && window.bootstrap && window.bootstrap.Tab) {
                        new bootstrap.Tab(firstTab).show();
                    }

                    this.modal.show();
                },
                hide() {
                    this.modal.hide();
                },
                handleSubmit() {
                    if (this.editorId) {
                        this.form.description_id = this.editorId.getText().trim() ? this.editorId.root.innerHTML : '';
                    }
                    if (this.editorEn) {
                        this.form.description_en = this.editorEn.getText().trim() ? this.editorEn.root.innerHTML : '';
                    }

                    if (!this.form.title_id || !this.form.description_id) {
                        Swal.fire({
                            icon: 'warning',
                            title: 'Peringatan',
                            text: 'Judul dan Deskripsi (Indonesia) wajib diisi!',
                        });
                        return;
                    }

                    let formData = new FormData();
                    if (this.form.id) {
                        formData.append('id', this.form.id);
                    }
                    formData.append('title_id', this.form.title_id);
                    formData.append('title_en', this.form.title_en || '');
                    formData.append('description_id', this.form.description_id);
                    formData.append('description_en', this.form.description_en || '');
                    formData.append('title', this.form.title_id);
                    formData.append('description', this.form.description_id);
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
