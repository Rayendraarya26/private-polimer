<?php

namespace App\Models\Db1;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OauthAccessToken extends Model
{
    use HasUuids;

    protected $table = 'oauth_access_tokens';

    protected $fillable = [
        'id',
        'user_id',
        'client_id',
        'name',
        'scopes',
        'revoked',
        'created_at',
        'updated_at',
        'expires_at',
    ];

    protected $casts = [
        'revoked'    => 'boolean',
        'expires_at' => 'datetime',
    ];

    public function client(): BelongsTo
    {
        return $this->belongsTo(OauthClient::class, 'client_id', 'id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(SysUser::class, 'user_id', 'id');
    }


}
