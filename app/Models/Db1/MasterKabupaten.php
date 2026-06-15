<?php

namespace App\Models\Db1;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

class MasterKabupaten extends Model
{
    protected $table = 'master_kabupaten';
	protected $primaryKey = 'kab_id';
	public $incrementing = false;

	protected $casts = [
		'kab_id' => 'int',
		'prov_id' => 'int'
	];

	protected $fillable = [
		'prov_id',
		'kab_nama'
	];

	public function master_provinsi()
	{
		return $this->belongsTo(MasterProvinsi::class, 'prov_id');
	}

	public function master_kecamatans()
	{
		return $this->hasMany(MasterKecamatan::class, 'kab_id');
	}

}
