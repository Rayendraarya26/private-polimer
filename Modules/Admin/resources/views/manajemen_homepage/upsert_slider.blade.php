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
                <div class="mb-2">
                    <label for="modal-order" class="form-label fw-semibold">Urutan</label>
                        <input type="number" class="form-control" placeholder="Urutan Ke 1..." id="modal-order"
                               v-model="payload.order">
                </div>
                <div class="mb-2">
                    <label for="modal-file-image" class="form-label fw-semibold">Image Banner</label>
                    <input type="file" class="form-control" id="modal-file-image" accept="image/png, image/gif, image/jpeg">
					<div v-if="mode === 'update'">
						*silahkan kosong jika tidak ingin meng-update image
						<input type="hidden" value="" id="modal-image"
                           v-model="payload.image_path">
					</div>
				</div>
                <div class="mb-2">
                    <label for="modal-title" class="form-label fw-semibold">Title</label>
                    <textarea class="form-control" placeholder="title..." id="modal-title"
                              v-model="payload.title"></textarea>
                </div>
                <div class="mb-2">
                    <label for="modal-desc" class="form-label fw-semibold">Deskripsi</label>
                    <textarea class="form-control" placeholder="Deskripsi..." id="modal-desc"
                              v-model="payload.description"></textarea>
                </div>
                <div class="mb-2">
                    <label for="modal-cta-text" class="form-label fw-semibold">CTA Text</label>
                    <input type="text" class="form-control" id="modal-cta-text" placeholder="Teks tombol CTA..."
                           v-model="payload.cta_text">
                </div>
                <div class="mb-2">
                    <label for="modal-cta-url" class="form-label fw-semibold">CTA URL</label>
                    <input type="url" class="form-control" id="modal-cta-url" placeholder="https://..."
                           v-model="payload.cta_url">
                </div>
                <div class="mb-2">
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
                        title: '',
                        description: '',
                        image_url: '',
                        image_path: '',
                        cta_text: '',
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
                    formData.append('description', this.payload.description)
                    formData.append('title', this.payload.title)
                    formData.append('cta_text', this.payload.cta_text || '')
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
                            title: '',
                            description: '',
                            image_url: '',
                            image_path: '',
                            cta_text: '',
                            cta_url: '',
                        }
                    } else {
                        this.title = 'Perbarui Banner'
                        this.mode = 'update'
                        this.payload = {
                            id: payload.id,
                            title: payload.title,
                            order: payload.order,
                            description: payload.description,
                            image_url: payload.image_url,
                            image_path: payload.image_path,
                            cta_text: payload.cta_text || '',
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
