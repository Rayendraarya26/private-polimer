<?php

namespace App\Models\Db1;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class ContactUs extends Model
{
    use HasUuids;

    protected $table = 'site_contact_us';

    protected $fillable = [
        'nama',
        'email',
        'telp',
        'instansi',
        'pesan',
    ];
}
