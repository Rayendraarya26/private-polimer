@extends('layouts.app')

@section('title', 'Feedback ' . $data->name)

@push('css')
    <style>
        /* Custom styles */
        .fixed-bottom-right {
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 20px;
            z-index: 1000; /* Adjust the z-index as needed */
        }
    </style>
@endpush

@section('content')
    <div class="row">
        <div class="col-md-12">
            <div class="card" id="kt_card">
                <div id="appFeedback">
                    <div class="card-body">
                        <div class="app-engage ">
							<button class="app-engage-btn hover-primary" @click="handleCreateFeedback">
							<i class="fa-thin fa-square-pen fs-1 pt-1 mb-2"></i>
							<span class="path1"></span>
							<span class="path2"></span></i>
							Tambah
							</button>
                        </div>
                        <div v-if="listFeedback.length > 0">
                            <ul v-for="feedback in listFeedback" class="list-group" style="margin-top:5px;">
                                <li class="list-group-item">
                                    @{{ feedback.question }}
                                    <br>
                                    <b>Fokus: @{{ feedback.focused.toUpperCase() }}</b>
                                    <template v-if="feedback.child === null">
                                        | <b>Tipe: @{{ feedback.input_type.toUpperCase() }}</b>
                                    </template>

                                    <!-- add button add child, edit and delete -->
                                    <div class="btn-group btn-group-sm float-end" role="group" aria-label="button action">
                                        <button type="button" class="btn btn-outline-primary"
                                                @click="handleCreateFeedback(feedback)"><i class="fas fa-plus"></i>
                                        </button>
                                        <button type="button" class="btn btn-outline-primary"
                                                @click="handleEditFeedback(feedback)"><i class="fas fa-edit"></i>
                                        </button>
                                        <button type="button" class="btn btn-outline-danger"
                                                @click="handleDeleteFeedback(feedback.id)">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </div>
                                    <template v-if="feedback.child">
                                        <feedback-item :child-feedback="feedback.child"
                                                       @delete="handleEmitDelete"></feedback-item>
                                    </template>
                                </li>
                            </ul>
                        </div>

                        <div class="fixed-bottom-right" style="margin-top:10px;">
                            <button class="btn btn-success" :disabled="loading" @click="handleSaveFeedback()">
                                <i class="fas fa-save"></i> Save
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    @include("$view._modal_update")
    @include("$view._modal_create")
@endsection
@push('scripts_top')
    <script>
        const { createApp } = Vue;
    </script>
@endpush
@push('scripts')
    <script>
        const handleRecursiveDelete = (listArray, targetId) => {
            return listArray.map((item, index) => {
                if (item.id === targetId) {
                    return listArray.splice(index, 1);
                }

                if (item.child) {
                    return handleRecursiveDelete(item.child, targetId);
                }
            })
        }

        window.appFeedback = createApp({
            data() {
                return {
                    loading: false,
                    listFeedback: [],
                }
            },
            mounted() {
                this.apiGetFeedback();
            },
            methods: {
                apiGetFeedback() {
                    $.get(`{{ url("$url/ajax?action=feedback") }}&id={{$data->id}}`)
                        .then(res => {
                            if(res.results !== null){
                                this.listFeedback = res.results;
                                this.reorderFeedbackWithOrderValue();
                            }
                        })
                        .catch(err => {
                            console.log(err);
                        });
                },
                reorderFeedbackWithOrderValue() {
                    let feedback = _.cloneDeep(this.listFeedback);

                    // all feedback data already have order value, we need to reorder it when render to view by changing position of array
                    const reorderFeedback = (listArray) => {
                        let temp = [];
                        listArray.map((item) => {
                            if (item.child) {
                                item.child = reorderFeedback(item.child);
                            }

                            const index = temp.findIndex((tempItem) => tempItem.order > item.order);

                            if (index === -1) {
                                temp.push(item);
                            } else {
                                temp.splice(index, 0, item);
                            }
                        })

                        return temp;
                    }

                    this.listFeedback = reorderFeedback(feedback);
                },
                handleCreateFeedback(feedback) {
                    modalCreateVue.show({ parentId: feedback?.id, focused: feedback?.focused });
                },
                handleDeleteFeedback(id) {
                    return handleRecursiveDelete(this.listFeedback, id)
                },
                handleEditFeedback(cfb) {
                    modalUpdateVue.show(cfb);
                },
                handleSaveFeedback() {
                    this.loading = true;
                    $.ajax({
                        url: `{{ url("$url") }}/{{$data->id}}/feedback`,
                        method: 'POST',
                        contentType: 'application/json',
                        data: JSON.stringify({
                            feedback: this.listFeedback,
                            _token: "{{ csrf_token() }}"
                        }),
                        success: (res) => {
                            this.loading = false;
                            toastr.success(res.message);
                        },
                        error: (err) => {
                            this.loading = false;
                            Swal.fire({
                                icon: 'error',
                                title: 'Error',
                                text: err.responseJSON.message,
                            })
                        }
                    })
                },
            },
        }).component('feedback-item', {
            props: ['childFeedback'],
            methods: {
                handleDeleteFeedback(id) {
                    return handleRecursiveDelete(this.childFeedback, id)
                },
                handleCreateFeedback(cfb) {
                    modalCreateVue.show({ parentId: cfb.id, focused: cfb.focused });
                },
                handleEditFeedback(cfb) {
                    modalUpdateVue.show(cfb);
                }
            },
            template: `
                <ul v-for="cfb in childFeedback" class="list-group" style="margin-top:20px;">
                    <li class="list-group-item" style="margin-top:5px;">
                        @{{ cfb.question }}
                        <template v-if="cfb.child === null">
                            <br>
                            <b>Tipe: @{{ cfb.input_type.toUpperCase() }}</b>
                        </template>
                        <template v-else>
                            <br>
                            <b>Fokus: @{{ cfb.focused.toUpperCase() }}</b>
                        </template>

                        <!-- add button edit and delete -->
                        <div class="btn-group btn-group-sm float-end" role="group" aria-label="button action">
                            <button type="button" class="btn btn-outline-primary"
                                @click="handleCreateFeedback(cfb)"><i class="fas fa-plus"></i></button>
                            <button type="button" class="btn btn-outline-primary"
                                @click="handleEditFeedback(cfb)"
                                    ><i class="fas fa-edit"></i></button>
                            <button type="button" class="btn btn-outline-danger"
                                @click="handleDeleteFeedback(cfb.id)"><i class="fas fa-trash"></i></button>
                        </div>


                        <template v-if="cfb.child">
                            <feedback-item :child-feedback="cfb.child"></feedback-item>
                        </template>
                    </li>
                </ul>
`
        }).mount('#appFeedback');
    </script>
@endpush
