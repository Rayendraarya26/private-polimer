<!-- Modal -->
<div class="modal fade" id="upsertModal" tabindex="-1" aria-labelledby="upsertModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content" id="upsertVue">
            <div class="modal-header">
                <h5 class="modal-title" id="upsertModalLabel">@{{ mode === 'create' ? 'Tambah' : 'Edit' }} Social Media</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form @submit.prevent="handleSubmit">
                    <div class="mb-3">
                        <label for="title" class="form-label">Nama Social Media</label>
                        <input type="text" class="form-control" id="title" v-model="form.title" required>
                    </div>
                    <div class="mb-3">
                        <label for="icon_class" class="form-label">Icon Class</label>
                        <div class="input-group">
                            <span class="input-group-text"><i :class="form.icon_class || 'fas fa-share-nodes'"></i></span>
                            <input type="text" class="form-control" id="icon_class" v-model="form.icon_class" required placeholder="e.g. fa-brands fa-facebook-f">
                        </div>
                        <small class="text-muted">Use Font Awesome class names. Visit <a href="https://fontawesome.com/search?o=r&m=free" target="_blank">Font Awesome</a> for icons.</small>
                    </div>
                    <div class="mb-3">
                        <label for="url" class="form-label">URL</label>
                        <input type="url" class="form-control" id="url" v-model="form.url" required placeholder="https://example.com">
                    </div>
                    <div class="mb-3">
                        <label for="order" class="form-label">Urutan</label>
                        <input type="number" class="form-control" id="order" v-model="form.order" required min="1">
                    </div>
                    <input type="hidden" v-model="form.id">
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" @click="handleSubmit">@{{ mode === 'create' ? 'Tambah' : 'Update' }}</button>
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
                    form: {
                        id: null,
                        title: '',
                        icon_class: '',
                        url: '',
                        order: 1,
                    },
                    modal: null,
                };
            },
            mounted() {
                this.modal = new bootstrap.Modal(document.getElementById('upsertModal'));
            },
            methods: {
                show(data = null) {
                    if (data) {
                        this.mode = 'edit';
                        this.form = { ...data };
                    } else {
                        this.mode = 'create';
                        this.form = {
                            id: null,
                            title: '',
                            icon_class: '',
                            url: '',
                            order: 1,
                        };
                    }
                    this.modal.show();
                },
                hide() {
                    this.modal.hide();
                },
                handleSubmit() {
                    let formData = new FormData();
                    formData.append('id', this.form.id);
                    formData.append('title', this.form.title);
                    formData.append('icon_class', this.form.icon_class);
                    formData.append('url', this.form.url);
                    formData.append('order', this.form.order);

                    let url;
                    if (this.mode === 'create') {
                        url = '{{ url("$url") }}/store_social_media/update'
                    } else {
                        url = '{{ url("$url") }}/update_social_media/update'
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
                            window.socialMediaVue.refreshListSocialMedia()
                            Swal.fire({
                                icon: 'success',
                                title: 'Success',
                                text: res.message,
                            })
                        },
                        error: (xhr) => {
                            Swal.fire({
                                icon: 'error',
                                title: 'Error',
                                text: xhr.responseJSON?.message || 'Something went wrong',
                            })
                        }
                    })
                },
            },
        }).mount('#upsertVue');
    </script>
@endpush
