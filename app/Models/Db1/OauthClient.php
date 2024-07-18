<?php

namespace App\Models\Db1;

use App\Enums\OauthClientAccesibility;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class OauthClient extends Model
{
    use HasUuids;

    protected $table = 'oauth_clients';

    protected $fillable = [
        'user_id',
        'name',
        'secret',
        'provider',
        'redirect',
        'personal_access_client',
        'accessibility',
        'display',
        'password_client',
        'revoked',
    ];

    protected $casts = [
        'personal_access_client' => 'boolean',
        'password_client'        => 'boolean',
        'revoked'                => 'boolean',
        'display'                => 'boolean',
        'accessibility'          => OauthClientAccesibility::class,
    ];
}
