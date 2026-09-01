<?php

namespace App\Models\Db2;

use App\Models\Db1\SysUser;
use App\Models\Db1\Pelanggan;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Permohonan extends Model
{
    use HasUuids, SoftDeletes;

    protected $table = 'permohonan';

    protected $guarded = ['id'];

    protected $fillable = [
        'no_permohonan',
        'id_pt_ins',
        'is_split_bill',
        'status_workflow',
        'status_bayar',
        'catatan_admin',
        'tgl_order',
        'created_by',
        'updated_by',
        'ip_address',
        'pdf_tte',
        'va',
        'va_trx_id',
        'va_expired_at',
        'va_status',
        'invoice_number',
        'invoice_file',
        'invoice_generated_at',
        'tte_invoice_requested',
        'tte_invoice_requested_at',
        'kuitansi_number',
        'kuitansi_file',
        'kuitansi_generated_at',
        'tte_kuitansi_requested',
        'tte_kuitansi_requested_at',
        'kuitansi_pdf_tte',
        'is_given_feedback',
        'feedback_json',
        'feedback_at',
        'file_attachment',
    ];

    protected $casts = [
        'tgl_order'                 => 'datetime',
        'va_expired_at'             => 'datetime',
        'invoice_generated_at'      => 'datetime',
        'kuitansi_generated_at'     => 'datetime',
        'tte_invoice_requested'     => 'boolean',
        'tte_invoice_requested_at'  => 'datetime',
        'tte_kuitansi_requested'    => 'boolean',
        'tte_kuitansi_requested_at' => 'datetime',
        'total_harga'               => 'decimal:2',
        'feedback_json'             => 'array',
        'file_attachment'           => 'array',
    ];

    public function detailPembayaran()
    {
        return $this->hasMany(DetailPembayaran::class);
    }

    public function detailPermohonan()
    {
        return $this->hasMany(DetailPermohonan::class);
    }

    public function formLsp()
    {
        return $this->hasMany(FormLsp::class);
    }

    // public function formPendaftaranPelatihan()
    // {
    //     return $this->hasMany(FormPendaftaranPelatihan::class);
    // }

    public function formPelatihan()
    {
        return $this->hasMany(FormPelatihan::class);
    }

    public function formSertifikasi()
    {
        return $this->hasMany(FormSertifikasi::class);
    }

    public function sertifikasi()
    {
        return $this->hasMany(\App\Models\Db1\PelangganSertifikasi::class, 'permohonan_id');
    }

    public function audit()
    {
        return $this->hasMany(SertifikasiAudit::class, 'permohonan_id');
    }

    public function komite()
    {
        return $this->hasMany(SertifikasiKomite::class, 'permohonan_id');
    }

    // Asumsi model untuk sys_user adalah User
    public function creator()
    {
        return $this->belongsTo(SysUser::class, 'created_by');
    }

    public function updater()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public function detailPembayaranGrup()
    {
        return $this->hasMany(DetailPembayaran::class, 'id_pt_ins', 'id_pt_ins');
        // SELECT * FROM detail_pembayaran WHERE id_pt_ins = ?
    }

    public function pelanggan()
    {
        return $this->hasOneThrough(
            Pelanggan::class,   
            SysUser::class,     
            'id',              
            'user_id',         
            'created_by',     
            'id'               
        );
    }
}
