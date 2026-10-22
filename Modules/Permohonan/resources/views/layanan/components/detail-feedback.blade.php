@php
    $feedbackAt = null;
    if (!empty($permohonan->feedback_at)) {
        try {
            $feedbackAt = new \DateTime($permohonan->feedback_at);
        } catch (\Exception $e) {
            $feedbackAt = null;
        }
    }

    $rawFeedback = $permohonan->feedback_json;
    if (is_string($rawFeedback)) {
        $decoded = json_decode($rawFeedback, true);
        if (json_last_error() === JSON_ERROR_NONE) {
            $rawFeedback = $decoded;
        }
    }
    if (is_string($rawFeedback)) {
        $decoded = json_decode($rawFeedback, true);
        if (json_last_error() === JSON_ERROR_NONE) {
            $rawFeedback = $decoded;
        }
    }

    // Cek apakah format simple testimoni/rating (dummy seeder)
    $isSimpleFeedback = is_array($rawFeedback) && (isset($rawFeedback['rating']) || isset($rawFeedback['testimoni']));
@endphp

@push('styles')
    <style>
        .feedback-card-item {
            border: 1px solid #e2e8f0;
            border-radius: 10px;
            padding: 16px;
            margin-bottom: 12px;
            background: #ffffff;
            transition: all 0.2s ease;
        }

        .feedback-card-item:hover {
            border-color: #cbd5e1;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        }

        .feedback-child-list {
            margin-top: 12px;
            padding-left: 18px;
            border-left: 2px solid #e2e8f0;
        }
    </style>
@endpush

<div class="card border-0 shadow-sm rounded-4 mb-4" id="app-feedback">
    {{-- Card Header --}}
    <div
        class="card-header bg-white border-bottom py-4 px-4 d-flex align-items-center justify-content-between flex-wrap gap-2">
        <div class="d-flex align-items-center gap-3">
            <div class="d-flex align-items-center justify-content-center rounded-3"
                style="width:44px; height:44px; background:#eff6ff; color:#2563eb;">
                <i class="fas fa-comment-check fs-4"></i>
            </div>
            <div>
                <h5 class="fw-bold mb-0">Hasil Feedback & Survei Kepuasan Pelanggan</h5>
                <span class="text-muted" style="font-size:13px">Kuesioner dan penilaian pelayanan dari pemohon</span>
            </div>
        </div>
    </div>

    {{-- Card Body --}}
    <div class="card-body p-4">
        {{-- Metadata Bar --}}
        <div class="row g-3 mb-4">
            <div class="col-md-4">
                <div class="p-3 rounded-3" style="background:#f8fafc; border:1px solid #e2e8f0;">
                    <div class="text-uppercase text-muted fw-semibold" style="font-size:11px; letter-spacing:.05em;">
                        Waktu Pengisian</div>
                    <div class="fw-bold fs-6 text-dark mt-1">
                        {{ $feedbackAt ? $feedbackAt->format('d M Y, H:i:s') : '-' }}
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="p-3 rounded-3" style="background:#f8fafc; border:1px solid #e2e8f0;">
                    <div class="text-uppercase text-muted fw-semibold" style="font-size:11px; letter-spacing:.05em;">
                        Status Pengisian</div>
                    <div class="fw-bold fs-6 mt-1">
                        @if($permohonan->is_given_feedback)
                            <span class="text-success"><i class="fas fa-check me-1"></i> Selesai Diisi</span>
                        @else
                            <span class="text-warning"><i class="fas fa-hourglass-half me-1"></i> Menunggu Pemohon</span>
                        @endif
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="p-3 rounded-3" style="background:#f8fafc; border:1px solid #e2e8f0;">
                    <div class="text-uppercase text-muted fw-semibold" style="font-size:11px; letter-spacing:.05em;">No.
                        Permohonan</div>
                    <div class="fw-bold fs-6 text-dark mt-1">
                        {{ $permohonan->no_permohonan ?? '-' }}
                    </div>
                </div>
            </div>
        </div>

        {{-- Jika format simple testimoni & rating --}}
        @if($isSimpleFeedback)
            <div class="border rounded-3 p-4 bg-light mb-3">
                <h6 class="fw-bold mb-3">Penilaian & Ulasan</h6>
                @if(isset($rawFeedback['rating']))
                    <div class="d-flex align-items-center gap-2 mb-2">
                        <span class="fw-semibold">Rating:</span>
                        <span class="text-warning fs-5">
                            @for($i = 1; $i <= 5; $i++)
                                <i class="{{ $i <= (int) $rawFeedback['rating'] ? 'fas' : 'far' }} fa-star"></i>
                            @endfor
                        </span>
                        <span class="fw-bold text-dark ms-1">({{ $rawFeedback['rating'] }}/5)</span>
                    </div>
                @endif
                @if(!empty($rawFeedback['testimoni']))
                    <div class="mt-2">
                        <span class="fw-semibold text-muted d-block mb-1">Testimoni:</span>
                        <p class="fst-italic text-dark mb-0 bg-white p-3 rounded border">"{{ $rawFeedback['testimoni'] }}"</p>
                    </div>
                @endif
            </div>
        @else
            {{-- Kuesioner Interaktif dari Polimer Awal (Vue App) --}}
            <div v-if="listFeedback && listFeedback.length > 0">
                <div class="d-flex align-items-center justify-content-between mb-3">
                    <h6 class="fw-bold text-dark mb-0">Daftar Pertanyaan & Jawaban Feedback</h6>
                    <span class="text-muted" style="font-size:13px">Total @{{ listFeedback.length }} Pertanyaan Utama</span>
                </div>

                <div class="feedback-list">
                    <div v-for="(feedback, idx) in listFeedback" :key="feedback.id || idx" class="feedback-card-item">
                        <div class="d-flex align-items-start justify-content-between gap-3">
                            <div class="d-flex align-items-start gap-2 flex-grow-1">
                                <span class="badge bg-secondary rounded-pill mt-1" style="font-size:11px;">@{{ idx + 1
                                    }}</span>
                                <div class="flex-grow-1">
                                    <div class="fw-semibold text-dark fs-6 mb-1">
                                        @{{ feedback.question }}
                                        <template v-if="feedback.focused === 'INSTRUKTUR' && feedback.instructor">
                                            <span class="badge bg-light-info text-info ms-1">@{{ feedback.instructor.name
                                                }}</span>
                                        </template>
                                    </div>

                                    <div class="d-flex align-items-center gap-2 flex-wrap mt-2">
                                        <span v-if="feedback.focused" class="badge rounded-pill bg-light text-muted border"
                                            style="font-size:11px;">
                                            <i class="fas fa-tag me-1"></i> FOKUS: @{{ feedback.focused.toUpperCase() }}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {{-- Jawaban jika direct item (bukan parent yang hanya punya child) --}}
                            <div v-if="feedback.child === null && feedback.value !== undefined"
                                class="text-end flex-shrink-0">
                                <div class="text-muted" style="font-size:11px;">Jawaban</div>
                                <span class="badge bg-light-success text-success fw-bold px-3 py-2 mt-1"
                                    style="font-size:13px;">
                                    @{{ feedback.value }}
                                </span>
                            </div>
                        </div>

                        {{-- Rekursif untuk child questions --}}
                        <div v-if="feedback.child && feedback.child.length > 0" class="feedback-child-list">
                            <feedback-item :child-feedback="feedback.child"></feedback-item>
                        </div>
                    </div>
                </div>
            </div>

            <div v-else class="text-center py-5 border rounded-3 bg-light">
                <div class="text-muted mb-2"><i class="fas fa-inbox fs-1 text-secondary"></i></div>
                <h6 class="fw-bold text-secondary mb-1">Belum Ada Data Feedback</h6>
                <p class="text-muted mb-0" style="font-size:13px;">Pelanggan belum mengisi kuesioner feedback untuk
                    permohonan ini.</p>
            </div>
        @endif
    </div>
</div>

@push('scripts')
    <script>
        document.addEventListener('DOMContentLoaded', function () {
            if (typeof Vue === 'undefined') {
                console.warn('Vue 3 is not loaded');
                return;
            }

            const { createApp } = Vue;
            const rawData = @json($rawFeedback ?? []);

            window.appFeedback = createApp({
                data() {
                    return {
                        listFeedback: Array.isArray(rawData) ? rawData : [],
                    };
                },
                mounted() {
                    this.reorderFeedbackWithOrderValue();
                },
                methods: {
                    reorderFeedbackWithOrderValue() {
                        if (!Array.isArray(this.listFeedback) || this.listFeedback.length === 0) return;

                        let feedback = _.cloneDeep(this.listFeedback);

                        // All feedback data already have order value, reorder it when render to view
                        const reorderFeedback = (listArray) => {
                            if (!Array.isArray(listArray)) return [];
                            let temp = [];
                            listArray.forEach((item) => {
                                if (item.child) {
                                    item.child = reorderFeedback(item.child);
                                }

                                const index = temp.findIndex((tempItem) => tempItem.order > item.order);
                                if (index === -1) {
                                    temp.push(item);
                                } else {
                                    temp.splice(index, 0, item);
                                }
                            });
                            return temp;
                        };

                        this.listFeedback = reorderFeedback(feedback);
                    },
                },
            }).component('feedback-item', {
                props: ['childFeedback'],
                template: `
                        <div class="mt-2">
                            <div v-for="(cfb, cIdx) in childFeedback" :key="cfb.id || cIdx" class="p-3 mb-2 rounded-2 bg-light border">
                                <div class="d-flex align-items-start justify-content-between gap-3">
                                    <div>
                                        <div class="fw-medium text-dark" style="font-size:13.5px;">
                                            @{{ cfb.question }}
                                        </div>
                                        <span v-if="cfb.focused" class="badge bg-white text-muted border mt-1" style="font-size:10px;">
                                            @{{ cfb.focused.toUpperCase() }}
                                        </span>
                                    </div>
                                    <div v-if="cfb.child === null && cfb.value !== undefined" class="text-end flex-shrink-0">
                                        <span class="badge bg-light-success text-success fw-bold px-2 py-1" style="font-size:12px;">
                                            @{{ cfb.value }}
                                        </span>
                                    </div>
                                </div>
                                <div v-if="cfb.child && cfb.child.length > 0" class="ps-3 mt-2 border-start">
                                    <feedback-item :child-feedback="cfb.child"></feedback-item>
                                </div>
                            </div>
                        </div>
                    `,
            }).mount('#app-feedback');
        });
    </script>
@endpush