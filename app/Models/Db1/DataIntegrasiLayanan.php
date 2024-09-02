<?php

namespace App\Models\Db1;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DataIntegrasiLayanan extends Model
{
    use HasUuids;

    protected $table = 'data_integrasi_layanan';

    protected $fillable = [
        'layanan_id',
        'user_id',
        'kode_order',
        'id_order',
        'tanggal_order',
        'status_order',
        'file_attachment',
        'is_given_feedback',
        'feedback_json',
    ];

//    protected function casts(): array
//    {
//        return [
//            'feedback_json' => 'json',
//        ];
//    }

	public function layanan(): BelongsTo
    {
        return $this->belongsTo(MasterLayanan::class, 'layanan_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(SysUser::class, 'user_id');
    }

}
