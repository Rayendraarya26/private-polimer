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
                <div class="mb-2" v-if="mode === 'create'">
                    <label for="modal-file-image" class="form-label fw-semibold">Image Banner</label>
                    <input type="file" class="form-control" id="modal-file-image" accept="image/png, image/gif, image/jpeg">
                </div>
                <div class="mb-2">
                    <label for="modal-url" class="form-label fw-semibold">URL</label>
                    <input type="text" class="form-control" placeholder="https://google.com..." id="modal-url"
                           v-model="payload.link">
                </div>
                <div class="mb-2">
                    <label for="modal-desc" class="form-label fw-semibold">Deskripsi</label>
                    <textarea class="form-control" placeholder="Deskripsi..." id="modal-desc"
                              v-model="payload.description"></textarea>
                </div>
                <div class="row mb-2">
                    <div class="col-md-6">
                        <label for="modal-order" class="form-label fw-semibold">Urutan</label>
                        <input type="number" class="form-control" placeholder="Urutan Ke 1..." id="modal-order"
                               v-model="payload.order">
                    </div>
                    <div class="col-md-6">
                        <label for="modal-is-active" class="form-label fw-semibold">Aktif?</label>
                        <select name="modal-is-active" id="modal-is-active" class="form-select"
                                v-model="payload.is_active">
                            <option value="1">Ya</option>
                            <option value="0">Tidak</option>
                        </select>
                    </div>
                </div>
                <div class="row mb-2">
                    <div class="col-md-6">
                        <label for="modal-start-at" class="form-label fw-semibold">Tgl Mulai</label>
                        <input type="text" class="form-control" placeholder="Tgl Mulai..." id="modal-start-at"
                               v-model="payload.start_at">
                        <button class="btn btn-sm" @click="clearDate('start_at')">Clear Date</button>
                        <br>
                        @{{ displayDate(payload.start_at) }}
                    </div>
                    <div class="col-md-6">
                        <label for="modal-end-at" class="form-label fw-semibold">Tgl Berakhir</label>
                        <input type="text" class="form-control" placeholder="Tgl Selesai..." id="modal-end-at"
                               v-model="payload.end_at">
                        <button class="btn btn-sm" @click="clearDate('end_at')">Clear Date</button>
                        <br>
                        @{{ displayDate(payload.end_at) }}
                    </div>
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
                        link: '',
                        description: '',
                        is_active: 1,
                        image_url: '',
                        start_at: null,
                        end_at: null,
                    }
                }
            },
            mounted() {
                this.modal = new bootstrap.Modal(document.getElementById('modalUpsert'), {
                    keyboard: false,
                    backdrop: 'static',
                })

                this.initDatePicker('#modal-start-at')
                this.initDatePicker('#modal-end-at')
            },
            methods: {
                initDatePicker(selector) {
                    flatpickr(`${selector}`, {
                        enableTime: true, // Enable time selection
                        enableSeconds: true,
                        //dateFormat: "Z",
                        dateFormat: "Y-m-d H:i:s",
                        time_24hr: true, // Use 24-hour time format
                    });
                },
                clearDate(selector) {
                    this.payload[selector] = null
                },
                displayDate(date) {
                    if (_.isNil(date)) {
                        return ''
                    }
                    return humanDateTime(date)
                },
                buildFormData() {
                    const formData = new FormData()

                    // add method
                    formData.append('_method', this.mode === 'create' ? 'POST' : 'PUT')
                    formData.append('order', this.payload.order)
                    formData.append('link', this.payload.link)
                    formData.append('description', this.payload.description)
                    formData.append('is_active', this.payload.is_active)
                    formData.append('start_at', this.payload.start_at)
                    formData.append('end_at', this.payload.end_at)
                    formData.append('_token', "{{ csrf_token() }}")

                    if (this.mode === 'create') {
                        // check should image not null
                        if (_.isNil(document.getElementById('modal-file-image').files[0])) {
                            throw new Error('Image tidak boleh kosong')
                        }
                        formData.append('image', document.getElementById('modal-file-image').files[0])
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
                            link: '',
                            description: '',
                            is_active: '1',
                            image_url: '',
                            start_at: null,
                            end_at: null,
                        }
                    } else {
                        this.title = 'Perbarui Banner'
                        this.mode = 'update'
                        this.payload = {
                            id: payload.id,
                            order: payload.order,
                            link: payload.link,
                            description: payload.description,
                            is_active: payload.is_active ? '1' : '0',
                            image_url: payload.image_url,
                            start_at: payload.start_at,
                            end_at: payload.end_at,
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
                            const formData = this.buildFormData()
                            let url = '';
                            let method = 'POST';
                            if (this.mode === 'create') {
                                url = '{{ url("$url") }}'
                            } else {
                                url = '{{ url("$url") }}' + '/' + this.payload.id
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
                                method: method,
                                data: formData,
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
