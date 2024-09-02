<div class="modal fade" id="modal-update-vue" tabindex="-1" aria-hidden="true" aria-labelledby="modal-update-vue">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header d-flex align-items-center">
                <h4 class="modal-title">
                    Edit Feedback
                </h4>
                <button type="button" class="btn-close" @click="hide"></button>
            </div>
            <div class="modal-body">
                <div class="mb-4">
                    <label for="order" class="form-label">Urutan</label>
                    <input type="number" class="form-control" id="order" v-model="form.order">
                </div>
                <div class="mb-4">
                    <label for="focused" class="form-label">Fokus</label>
                    <select class="form-select" id="focused" v-model="form.focused">
                        @foreach($FeedbackFocus as $key => $value)
                            <option value="{{ $value }}">{{ $key }}</option>
                        @endforeach
                    </select>
                </div>
                <div class="mb-4">
                    <label for="question" class="form-label">Pertanyaan</label>
                    <textarea class="form-control" id="question" rows="3" v-model="form.question"></textarea>
                </div>
                <div class="mb-4" v-if="!isHasChild()">
                    <label for="input_type" class="form-label">Tipe Input</label>
                    <select class="form-select" id="input_type" v-model="form.input_type">
                        @foreach($FeedbackInputType as $key => $value)
                            <option value="{{ $value }}">{{ $key }}</option>
                        @endforeach
                    </select>
                </div>
                <div class="mb-4" v-if="!isHasChild()">
                    <label for="required" class="form-label">Wajib Diisi</label>
                    <select class="form-select" id="required" v-model="form.required">
                        <option value="1">Ya</option>
                        <option value="0">Tidak</option>
                    </select>
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
</div>

@push('scripts')
        <script>
            window.modalUpdateVue = createApp({
                data() {
                    return {
                        modalUpdate: null,
                        loading: false,

                        form: {
                            id: null,
                            input_type: null,
                            order: null,
                            required: true,
                            question: null,
                            focused: null,
                            child: null,
                        }
                    }
                },
                mounted() {
                    this.modalUpdate = new bootstrap.Modal(
                        document.getElementById('modal-update-vue'),
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
                    show({ id, input_type, order, question, focused, child, required }) {
                        this.form.id = id;
                        this.form.input_type = input_type;
                        this.form.order = order;
                        this.form.question = question;
                        this.form.focused = focused;
                        this.form.child = child;
                        this.form.required = required ? '1' : '0';

                        this.modalUpdate.show()
                    },
                    save() {
                        this.form.order = parseInt(this.form.order);
                        this.form.required = this.form.required === '1';

                        // call method get feedback from appFeedback
                        let feedback = _.cloneDeep(appFeedback.listFeedback);

                        // update feedback by id, find recursively
                        const handleRecursiveUpdate = (listArray, targetId, data) => {
                            return listArray.map((item, index) => {
                                if (item.id === targetId) {
                                    return listArray.splice(index, 1, data);
                                }

                                if (item.child) {
                                    return handleRecursiveUpdate(item.child, targetId, data);
                                }
                            })
                        }

                        handleRecursiveUpdate(feedback, this.form.id, this.form);

                        // update appFeedback.listFeedback without pass by reference
                        appFeedback.listFeedback = _.cloneDeep(feedback);
                        // reorder feedback with order value
                        appFeedback.reorderFeedbackWithOrderValue();

                        // hide modal
                        this.hide();
                    },
                    hide() {
                        this.reset();
                        this.modalUpdate.hide()
                    },
                }
            }).mount('#modal-update-vue');
        </script>
@endpush
