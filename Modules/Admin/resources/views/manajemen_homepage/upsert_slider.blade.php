<div class="modal fade" id="modalUpsert" tabindex="-1"
     aria-labelledby="modalUpsert" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header d-flex align-items-center">
                <h4 class="modal-title">
                    @{{ title }}
                </h4>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="mb-3">
                    <label for="modal-order" class="form-label fw-semibold">Urutan</label>
                    <input type="number" class="form-control" placeholder="Urutan Ke 1..." id="modal-order"
                           v-model="payload.order">
                </div>
                <div class="mb-3">
                    <label for="modal-file-image" class="form-label fw-semibold">Image Banner</label>
                    <input type="file" class="form-control" id="modal-file-image" accept="image/png, image/gif, image/jpeg">
					<div v-if="mode === 'update'" class="mt-2">
						<span class="text-muted fs-8 d-block mb-1">* Silakan kosongkan jika tidak ingin meng-update image</span>
						<input type="hidden" value="" id="modal-image" v-model="payload.image_path">
						<div v-if="payload.image_url" class="p-2 border rounded bg-light d-inline-block mt-1">
							<span class="d-block text-muted fs-9 mb-1 fw-semibold">Gambar Saat Ini:</span>
							<img :src="payload.image_url" alt="Preview Slider" style="max-height: 90px; max-width: 100%; border-radius: 6px; object-fit: contain;">
						</div>
					</div>
				</div>

                <!-- Nav Tabs Localization -->
                <ul class="nav nav-tabs nav-line-tabs mb-3 fs-6" role="tablist">
                    <li class="nav-item">
                        <a class="nav-link active fw-bold" data-bs-toggle="tab" href="#slider_tab_id">🇮🇩 Indonesia</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link fw-bold" data-bs-toggle="tab" href="#slider_tab_en">🇬🇧 English</a>
                    </li>
                </ul>

                <div class="tab-content mb-3">
                    <!-- Tab Indonesia -->
                    <div class="tab-pane fade show active" id="slider_tab_id" role="tabpanel">
                        <div class="mb-2">
                            <label for="modal-title-id" class="form-label fw-semibold">Title (Indonesia)</label>
                            <textarea class="form-control" placeholder="Judul banner..." id="modal-title-id"
                                      v-model="payload.title_id"></textarea>
                        </div>
                        <div class="mb-2">
                            <label for="modal-desc-id" class="form-label fw-semibold">Deskripsi (Indonesia)</label>
                            <textarea class="form-control" placeholder="Deskripsi..." id="modal-desc-id"
                                      v-model="payload.description_id"></textarea>
                        </div>
                        <div class="mb-2">
                            <label for="modal-cta-text-id" class="form-label fw-semibold">CTA Text (Indonesia)</label>
                            <input type="text" class="form-control" id="modal-cta-text-id" placeholder="Contoh: Pelajari Selengkapnya"
                                   v-model="payload.cta_text_id">
                        </div>
                    </div>

                    <!-- Tab English -->
                    <div class="tab-pane fade" id="slider_tab_en" role="tabpanel">
                        <div class="mb-2">
                            <label for="modal-title-en" class="form-label fw-semibold">Title (English)</label>
                            <textarea class="form-control" placeholder="Banner title in English..." id="modal-title-en"
                                      v-model="payload.title_en"></textarea>
                        </div>
                        <div class="mb-2">
                            <label for="modal-desc-en" class="form-label fw-semibold">Deskripsi (English)</label>
                            <textarea class="form-control" placeholder="Description in English..." id="modal-desc-en"
                                      v-model="payload.description_en"></textarea>
                        </div>
                        <div class="mb-2">
                            <label for="modal-cta-text-en" class="form-label fw-semibold">CTA Text (English)</label>
                            <input type="text" class="form-control" id="modal-cta-text-en" placeholder="Example: Learn More"
                                   v-model="payload.cta_text_en">
                        </div>
                    </div>
                </div>

                <div class="mb-2">
                    <label for="modal-cta-url" class="form-label fw-semibold">CTA URL (Tujuan Link)</label>
                    <input type="url" class="form-control" id="modal-cta-url" placeholder="https://..."
                           v-model="payload.cta_url">
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" @click="handleSubmit()"
                        class="btn btn-primary font-medium waves-effect text-start">
                    Save
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
                    title: '',
                    modal: null,
                    mode: 'create',

                    payload: {
                        id: '',
                        order: 1,
                        title_id: '',
                        title_en: '',
                        description_id: '',
                        description_en: '',
                        image_url: '',
                        image_path: '',
                        cta_text_id: '',
                        cta_text_en: '',
                        cta_url: '',
                    }
                }
            },
            mounted() {
                this.modal = new bootstrap.Modal(document.getElementById('modalUpsert'), {
                    keyboard: false,
                    backdrop: 'static',
                })

            },
            methods: {
                buildFormData() {
                    const formData = new FormData()

                    // add method
                    formData.append('_method', 'PUT')
                    formData.append('_token', "{{ csrf_token() }}")
                    formData.append('order', this.payload.order)
                    formData.append('title_id', this.payload.title_id || '')
                    formData.append('title_en', this.payload.title_en || '')
                    formData.append('description_id', this.payload.description_id || '')
                    formData.append('description_en', this.payload.description_en || '')
                    formData.append('cta_text_id', this.payload.cta_text_id || '')
                    formData.append('cta_text_en', this.payload.cta_text_en || '')
                    formData.append('cta_url', this.payload.cta_url || '')
                    formData.append('id', this.payload.id)

                    if (this.mode === 'create') {
                        // check should image not null
                        if (_.isNil(document.getElementById('modal-file-image').files[0])) {
                            throw new Error('Image tidak boleh kosong')
                        }
                        formData.append('image', document.getElementById('modal-file-image').files[0])
                    }
					else{
						formData.append('image', document.getElementById('modal-file-image').files[0])
						formData.append('image_old', this.payload.image_path)
					}

                    return formData
                },
                show(payload) {
                    if (_.isNil(payload)) {
                        this.title = 'Tambah Banner'
                        this.mode = 'create'
                        this.payload = {
                            id: '',
                            order: 1,
                            title_id: '',
                            title_en: '',
                            description_id: '',
                            description_en: '',
                            image_url: '',
                            image_path: '',
                            cta_text_id: '',
                            cta_text_en: '',
                            cta_url: '',
                        }
                    } else {
                        this.title = 'Perbarui Banner'
                        this.mode = 'update'
                        const title = payload.title
                        const desc = payload.description
                        const cta = payload.cta_text
                        this.payload = {
                            id: payload.id,
                            order: payload.order,
                            title_id: typeof title === 'object' && title !== null ? (title.id || '') : (title || ''),
                            title_en: typeof title === 'object' && title !== null ? (title.en || '') : '',
                            description_id: typeof desc === 'object' && desc !== null ? (desc.id || '') : (desc || ''),
                            description_en: typeof desc === 'object' && desc !== null ? (desc.en || '') : '',
                            cta_text_id: typeof cta === 'object' && cta !== null ? (cta.id || '') : (cta || ''),
                            cta_text_en: typeof cta === 'object' && cta !== null ? (cta.en || '') : '',
                            image_url: payload.image_url,
                            image_path: payload.image_path,
                            cta_url: payload.cta_url || '',
                        }
                    }
                    this.modal.show()
                },
                hide() {
                    this.modal.hide()
                },
                handleSubmit() {
                    // Swal confirmation
                    Swal.fire({
                        title: 'Apakah anda yakin?',
                        text: "Data akan disimpan",
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                    }).then((result) => {
                        if (result.isConfirmed) {
                            var formData = this.buildFormData();
                            let url = '';
                            if (this.mode === 'create') {
                                url = '{{ url("$url") }}/store_slider/update'
                            } else {
                                url = '{{ url("$url") }}/update_slider/update'
                            }

                            // show loading
                            Swal.fire({
                                title: 'Loading...',
                                allowOutsideClick: false,
                                didOpen: () => {
                                    Swal.showLoading()
                                },
                            })

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
                                    this.hide()
                                    window.sliderVue.refreshListSlider()

                                    // show success
                                    Swal.fire({
                                        title: 'Berhasil',
                                        text: res.message,
                                        icon: 'success',
                                        showCancelButton: false,
                                        confirmButtonColor: '#3085d6',
                                        confirmButtonText: 'OK',
                                    })
                                },
                                error: (err) => {
                                    this.hide()

                                    // show error
                                    Swal.fire({
                                        title: 'Gagal',
                                        text: err.responseJSON.message,
                                        icon: 'error',
                                        showCancelButton: false,
                                        confirmButtonColor: '#3085d6',
                                        confirmButtonText: 'OK',
                                    })
                                }
                            })
                        }
                    })
                },
            }
        }).mount('#modalUpsert')
    </script>
@endpush
