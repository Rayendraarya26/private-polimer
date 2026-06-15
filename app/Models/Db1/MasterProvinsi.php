<?php

namespace App\Models\Db1;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

class MasterProvinsi extends Model
{
    protected $table = 'master_provinsi';
	protected $primaryKey = 'prov_id';

	protected $fillable = [
		'prov_nama'
	];
    public function master_kabupatens()
	{
		return $this->hasMany(MasterKabupaten::class, 'prov_id');
	}

}
