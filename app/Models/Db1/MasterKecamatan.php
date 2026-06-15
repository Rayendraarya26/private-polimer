<?php

namespace App\Models\Db1;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

class MasterKecamatan extends Model
{
    	protected $table = 'master_kecamatan';
	protected $primaryKey = 'kec_id';

	protected $casts = [
		'kab_id' => 'int'
	];

	protected $fillable = [
		'kab_id',
		'kec_nama'
	];

	public function master_kabupaten()
	{
		return $this->belongsTo(MasterKabupaten::class, 'kab_id');
	}
}
