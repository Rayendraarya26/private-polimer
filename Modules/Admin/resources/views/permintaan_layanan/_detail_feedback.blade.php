
@push('styles')
    <style>
        .list-group-item {
            margin-bottom: 5px;;
        }
    </style>
@endpush
<div class="card" id="app-vue">
	<!--begin::Card header-->
	<div class="card-header">
		<!--begin::Card header-->
		<div class="card-title fs-3 fw-bold">Feedback</div>
		<!--end::Card header-->
	</div>
	<!--end::Card header-->
	<!--begin::Card body-->
	<div class="card-body">
		<!--begin::Row-->
		<div class="row mb-8">
			<!--begin::Col-->
			<div class="col-xl-3">
				<div class="fs-6 fw-semibold mt-2 mb-3">Date Input</div>
			</div>
			<!--end::Col-->
			<!--begin::Col-->
			<div class="col-xl-9">
				<?php
				$feedback_at = null;
				if(!is_null($data->feedback_at))
					$feedback_at = new \DateTime($data->feedback_at);
				?>
				{{ $feedback_at ? $feedback_at?->format('d M Y H:i:s') : '-' }}
			</div>
			<!--end::Col-->
		</div>
		<!--end::Row-->
		<!--begin::Row-->
		<div class="row mb-8">
			<div class="col-xl-12">
				<div class="fs-6 fw-semibold mt-2 mb-3">Jawaban Feedback</div>
			</div>
			<div v-if="listFeedback.length > 0">
				<ul v-for="feedback in listFeedback" class="list-group">
					<li class="list-group-item">
						@{{ feedback.question }}
						<template v-if="feedback.focused === 'INSTRUKTUR'">
							<b>(@{{ feedback.instructor.name }})</b>
						</template>
						<br>
						<b>
							Fokus: @{{ feedback.focused.toUpperCase() }}
						</b>
						<template v-if="feedback.child === null">
							<br>
							<b class="text-success">Answer: @{{ feedback.value }}</b>
						</template>

						<template v-if="feedback.child">
							<feedback-item :child-feedback="feedback.child"></feedback-item>
						</template>
					</li>
				</ul>
			</div>
		</div>
		<!--end::Row-->
	</div>
	<!--end::Card body-->
</div>
@push('scripts')
    <script>
		const { createApp } = Vue;
	
        window.appFeedback = createApp({
            data() {
                return {
                    loading: false,
                    listFeedback: @json($data->feedback_json),
                }
            },
            mounted() {
                this.reorderFeedbackWithOrderValue();
            },
            methods: {
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
            },
        }).component('feedback-item', {
            props: ['childFeedback'],
            template: `
                <ul v-for="cfb in childFeedback" class="list-group">
                    <li class="list-group-item">
                        @{{ cfb.question }}
                        <template v-if="cfb.child === null">
                            <br>
                            <b class="text-success">Answer: @{{ cfb.value }}</b>
                        </template>
                        <template v-else>
                            <br>
                            <b>Fokus: @{{ cfb.focused.toUpperCase() }}</b>
                        </template>


                        <template v-if="cfb.child">
                            <feedback-item :child-feedback="cfb.child"></feedback-item>
                        </template>
                    </li>
                </ul>
`
        }).mount('#app-vue');
    </script>
@endpush
