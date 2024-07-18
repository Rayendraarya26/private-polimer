<?php

namespace App\Models\Db1;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class OauthAuthCode extends Model
{
    use HasUuids;

    protected $table = 'oauth_auth_codes';

    protected $fillable = [
        'user_id',
        'client_id',
        'scopes',
        'revoked',
        'expires_at',
    ];

    protected $casts = [
        'revoked'    => 'boolean',
        'expires_at' => 'datetime',
    ];
}
