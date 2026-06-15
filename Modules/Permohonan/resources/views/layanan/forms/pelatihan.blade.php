<style>
.detail-row {
    display: grid;
    grid-template-columns: 180px 10px 1fr;
    margin-bottom: 8px;
}


.detail-label {
    color: #6c757d;
}


.detail-value {
    word-break: break-word;
}
</style>


<div class="row g-4">


    <!-- ================= KIRI ================= -->
    <div class="col-md-6">
        <h6 class="text-primary border-bottom pb-2 mb-3">Identitas Peserta</h6>


        <div class="detail-row">
            <div class="detail-label">Nama</div>
            <div>:</div>
            <div class="detail-value fw-semibold">{{ $form->nama_lengkap ?? '-' }}</div>
        </div>


        <div class="detail-row">
            <div class="detail-label">NIK</div>
            <div>:</div>
            <div class="detail-value fw-semibold">{{ $form->nik_peserta ?? '-' }}</div>
        </div>


        <div class="detail-row">
            <div class="detail-label">Tempat, Tgl Lahir</div>
            <div>:</div>
            <div class="detail-value fw-semibold">
                {{ $form->tempat_lahir ?? '-' }},
                {{ $form->tanggal_lahir ? \Carbon\Carbon::parse($form->tanggal_lahir)->format('d-m-Y') : '-' }}
            </div>
        </div>


        <div class="detail-row">
            <div class="detail-label">Jenis Kelamin</div>
            <div>:</div>
            <div class="detail-value fw-semibold">{{ $form->gender ?? '-' }}</div>
        </div>


        <div class="detail-row">
            <div class="detail-label">Agama</div>
            <div>:</div>
            <div class="detail-value fw-semibold">{{ $form->agama ?? '-' }}</div>
        </div>


        <div class="detail-row">
            <div class="detail-label">Email</div>
            <div>:</div>
            <div class="detail-value fw-semibold">{{ $form->email ?? '-' }}</div>
        </div>


        <div class="detail-row">
            <div class="detail-label">WhatsApp</div>
            <div>:</div>
            <div class="detail-value fw-semibold">{{ $form->whatsapp ?? '-' }}</div>
        </div>


        <div class="detail-row">
            <div class="detail-label">Alamat</div>
            <div>:</div>
            <div class="detail-value fw-semibold">{{ $form->alamat_peserta ?? '-' }}</div>
        </div>


        <div class="detail-row">
            <div class="detail-label">Pendidikan</div>
            <div>:</div>
            <div class="detail-value fw-semibold">{{ $form->pendidikan ?? '-' }}</div>
        </div>
    </div>


    <!-- ================= KANAN ================= -->
    <div class="col-md-6">
        <h6 class="text-primary border-bottom pb-2 mb-3">Data Usaha / Instansi</h6>


        <div class="detail-row">
            <div class="detail-label">Nama Usaha</div>
            <div>:</div>
            <div class="detail-value fw-semibold">{{ $form->nama_instansi ?? '-' }}</div>
        </div>


        <div class="detail-row">
            <div class="detail-label">Alamat Usaha</div>
            <div>:</div>
            <div class="detail-value fw-semibold">{{ $form->alamat_instansi ?? '-' }}</div>
        </div>


        <div class="detail-row">
            <div class="detail-label">Jenis Produk</div>
            <div>:</div>
            <div class="detail-value fw-semibold">{{ $form->jenis_produk ?? '-' }}</div>
        </div>


        <div class="detail-row">
            <div class="detail-label">Masalah Materi</div>
            <div>:</div>
            <div class="detail-value fw-semibold">{{ $form->masalah_materi ?? '-' }}</div>
        </div>


        <div class="detail-row">
            <div class="detail-label">Hal Dipelajari</div>
            <div>:</div>
            <div class="detail-value fw-semibold">{{ $form->hal_dipelajari ?? '-' }}</div>
        </div>


        <div class="detail-row">
            <div class="detail-label">Program</div>
            <div>:</div>
            <div class="detail-value fw-semibold">{{ $form->program ?? '-' }}</div>
        </div>


        <div class="detail-row">
            <div class="detail-label">Setuju Syarat</div>
            <div>:</div>
            <div class="detail-value fw-semibold">
                {{ isset($form->setuju_syarat) ? ($form->setuju_syarat ? 'Ya' : 'Tidak') : '-' }}
            </div>
        </div>
    </div>


</div>


<!-- ================= FILE ================= -->
<div class="mt-4">
    <h6 class="text-primary border-bottom pb-2 mb-3">File Pendukung</h6>


    @php
        $files = [
            'ktp_peserta' => 'KTP Peserta',
            'foto_peserta' => 'Foto 3x4',
        ];
    @endphp


    @foreach($files as $field => $label)
        <div class="detail-row">
            <div class="detail-label">{{ $label }}</div>
            <div>:</div>
            <div class="detail-value">
                @if(!empty($form->$field))
                    <button type="button"
                        class="btn btn-sm btn-primary preview-btn"
                        data-file="{{ Storage::url($form->$field) }}">
                        Lihat file <i class="fa fa-eye"></i>
                    </button>
                @else
                    <span class="text-muted">-</span>
                @endif
            </div>
        </div>
    @endforeach
</div>

