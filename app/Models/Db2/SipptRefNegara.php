<?php

namespace App\Models\Db2;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SipptRefNegara extends Model
{
    use HasFactory;

    protected $table = 'sippt_ref_negara';

    protected $guarded = [];

    protected $casts = [
        'synced_at' => 'datetime',
    ];
}
