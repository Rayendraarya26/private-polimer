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
                    <label for="modal-desc" class="form-label fw-semibold">Judul</label>
                    <input type="text" class="form-control" placeholder="Judul..." id="modal-desc"
                              v-model="payload.title">
                </div>
                <div class="mb-2">
                    <label for="modal-file-image" class="form-label fw-semibold">Image Services</label>
                    <input type="file" class="form-control" id="modal-file-image" accept="image/png, image/gif, image/jpeg">
					<div v-if="mode === 'update'">
						*silahkan kosong jika tidak ingin meng-update image
						<input type="hidden" value="" id="modal-image"
                           v-model="payload.image_path">
					</div>
				</div>
                <div class="mb-2">
                    <label for="modal-desc" class="form-label fw-semibold">Deskripsi</label>
					<div ref="editor" v-html="value" style="height: 250px;"></div>
                    <input type="hidden" class="form-control" id="modal-desc" v-model="payload.description">
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
