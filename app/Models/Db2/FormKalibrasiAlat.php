<?php

namespace App\Models\Db2;


use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class FormKalibrasiAlat extends Model
{
    use HasUuids, SoftDeletes;

    protected $table = 'form_kalibrasi_alat';
    protected $guarded = ['id'];

    public function formKalibrasi()
    {
        return $this->belongsTo(FormKalibrasi::class, 'form_kalibrasi_id');
    }

    public function nomorSeriList()
    {
        return $this->hasMany(FormKalibrasiAlatSeri::class, 'form_kalibrasi_alat_id')->orderBy('nomor_unit', 'asc');
    }

    public function seriList()
    {
        return $this->nomorSeriList();
    }

    public function kalibrasiItems()
    {
        return $this->hasMany(FormKalibrasiAlatItem::class, 'form_kalibrasi_alat_id');
    }

    public function itemList()
    {
        return $this->kalibrasiItems();
    }
}