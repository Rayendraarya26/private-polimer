<div class="modal fade" id="modal-create-vue" tabindex="-1" aria-hidden="true" aria-labelledby="modal-create-vue">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header d-flex align-items-center">
                <h4 class="modal-title">
                    Add Feedback
                </h4>
                <button type="button" class="btn-close" @click="hide"></button>
            </div>
            <div class="modal-body">
                <div class="mb-4">
                    <label for="order_create" class="form-label">Urutan</label>
                    <input type="number" class="form-control" id="order_create" v-model="form.order">
                </div>
                <div class="mb-4">
                    <label for="focused_create" class="form-label">Fokus</label>
                    <select class="form-select" id="focused_create" v-model="form.focused">
                        @foreach($FeedbackFocus as $key => $value)
                            <option value="{{ $value }}">{{ $key }}</option>
                        @endforeach
                    </select>
                </div>
                <div class="mb-4">
                    <label for="question_create" class="form-label">Pertanyaan</label>
                    <textarea class="form-control" id="question_create" rows="3" v-model="form.question"></textarea>
                </div>
                <div class="mb-4">
                    <label for="input_type_create" class="form-label">Tipe Input</label>
                    <select class="form-select" id="input_type_create" v-model="form.input_type">
                        @foreach($FeedbackInputType as $key => $value)
                            <option value="{{ $value }}">{{ $key }}</option>
                        @endforeach
                    </select>
                </div>
                <div class="mb-4" v-if="!isHasChild()">
                    <label for="required_create" class="form-label">Wajib Diisi</label>
                    <select class="form-select" id="required_create" v-model="form.required">
                        <option value="1">Ya</option>
                        <option value="0">Tidak</option>
                    </select>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" @click="save"
                        class="btn bg-danger-subtle text-danger font-medium waves-effect text-start">
                    Save
                </button>
            </div>
        </div>
    </div>
</div>

@push('scripts')
    <script>
        window.modalCreateVue = createApp({
            data() {
                return {
                    modalCreate: null,
                    loading: false,

                    parentId: null,

                    form: {
                        id: null,
                        input_type: null,
                        order: null,
                        question: null,
                        focused: null,
                        required: '1',
                        child: null,
                    }
                }
            },
            mounted() {
                this.modalCreate = new bootstrap.Modal(
                    document.getElementById('modal-create-vue'),
                    {
                        // keyboard: false, // make it not close on esc
                        // backdrop: 'static', // make it not close on click outside
                    }
                )
            },
            methods: {
                isHasChild() {
                    return !_.isNil(this.form.child);
                },
                reset() {
                    this.form.id = null;
                    this.form.input_type = null;
                    this.form.order = null;
                    this.form.question = null;
                    this.form.focused = null;
                    this.form.child = null;
                    this.form.required = '1';
                },
                show({ parentId = null, focused = null }) {
                    this.parentId = parentId;

                    this.form.id = uuidV4();
                    this.form.input_type = 'number';
                    this.form.order = 1;
                    this.form.focused = focused || 'UMUM';
                    this.form.required = '1';

                    this.modalCreate.show()
                },
                save() {
                    this.form.order = parseInt(this.form.order);
                    this.form.required = this.form.required === '1';

                    // call method get feedback from appFeedback
                    let feedback = _.cloneDeep(appFeedback.listFeedback);

                    const updateFeedback = (listArray, targetId) => {
                        return listArray.map((item, index) => {
                            if (item.id === targetId) {
                                if (item.child) {
                                    item.child.push(this.form);
                                } else {
                                    item.child = [this.form];
                                }
                            }

                            if (item.child) {
                                return updateFeedback(item.child, targetId);
                            }
                        })
                    }

                    if (this.parentId === null) {
                        feedback.push(this.form);
                    } else {
                        updateFeedback(feedback, this.parentId)
                    }

                    // set feedback to appFeedback
                    appFeedback.listFeedback = _.cloneDeep(feedback);
                    // reorder feedback
                    appFeedback.reorderFeedbackWithOrderValue();

                    // hide modal
                    this.hide();
                },
                hide() {
                    this.reset();
                    this.modalCreate.hide()
                },
            }
        }).mount('#modal-create-vue');
    </script>
@endpush
