<div class="modal fade" id="modalUpsert" tabindex="-1"
     aria-labelledby="modalUpsert" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-lg">
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
                    <label for="modal-file-image" class="form-label fw-semibold">Image Services</label>
                    <input type="file" class="form-control" id="modal-file-image" accept="image/png, image/gif, image/jpeg">
					<div v-if="mode === 'update'" class="mt-2">
						<span class="text-muted fs-8 d-block mb-1">* Silakan kosongkan jika tidak ingin meng-update image</span>
						<input type="hidden" value="" id="modal-image" v-model="payload.image_path">
						<div v-if="payload.image_url" class="p-2 border rounded bg-light d-inline-block mt-1">
							<span class="d-block text-muted fs-9 mb-1 fw-semibold">Gambar Saat Ini:</span>
							<img :src="payload.image_url" alt="Preview Image" style="max-height: 90px; max-width: 100%; border-radius: 6px; object-fit: contain;">
						</div>
					</div>
				</div>

                <!-- Nav Tabs Localization -->
                <ul class="nav nav-tabs nav-line-tabs mb-3 fs-6" role="tablist">
                    <li class="nav-item">
                        <a class="nav-link active fw-bold" data-bs-toggle="tab" href="#service_tab_id">🇮🇩 Indonesia</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link fw-bold" data-bs-toggle="tab" href="#service_tab_en">🇬🇧 English</a>
                    </li>
                </ul>

                <div class="tab-content mb-3">
                    <!-- Tab Indonesia -->
                    <div class="tab-pane fade show active" id="service_tab_id" role="tabpanel">
                        <div class="mb-3">
                            <label for="modal-title-id" class="form-label fw-semibold">Judul Layanan (Indonesia)</label>
                            <input type="text" class="form-control" placeholder="Judul Layanan..." id="modal-title-id"
                                   v-model="payload.title_id">
                        </div>
                        <div class="mb-3">
                            <label class="form-label fw-semibold">Deskripsi Layanan (Indonesia)</label>
                            <div ref="editorId" style="height: 180px;"></div>
                        </div>
                    </div>

                    <!-- Tab English -->
                    <div class="tab-pane fade" id="service_tab_en" role="tabpanel">
                        <div class="mb-3">
                            <label for="modal-title-en" class="form-label fw-semibold">Judul Layanan (English)</label>
                            <input type="text" class="form-control" placeholder="Service Name in English..." id="modal-title-en"
                                   v-model="payload.title_en">
                        </div>
                        <div class="mb-3">
                            <label class="form-label fw-semibold">Deskripsi Layanan (English)</label>
                            <div ref="editorEn" style="height: 180px;"></div>
                        </div>
                    </div>
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
