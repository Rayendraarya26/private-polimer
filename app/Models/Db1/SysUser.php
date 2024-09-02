<?php

namespace App\Models\Db1;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Passport\HasApiTokens;
use Modules\Auth\Jobs\QueuedPasswordResetJob;
use Modules\Auth\Jobs\QueueEmailVerificationJob;
use Modules\Auth\Notifications\ResetPasswordNotification;

class SysUser extends Authenticatable implements MustVerifyEmail
{
    use HasFactory, Notifiable, HasUuids, HasApiTokens;

    protected $table = 'sys_user';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'nip',
        'email',
        'email_verified_at',
        'password',
        'is_banned',
        'force_update_password',
        'remember_token',
        'last_login',
        'password_updated_at',
        'banned_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'force_update_password' => 'boolean',
            'password_updated_at'   => 'datetime',
            'last_login'            => 'datetime',

            'banned_at'             => 'datetime',
        ];
    }

    public function sendPasswordResetNotification($token): void
    {
        $url = url('/auth/new-password?token=' . $token . '&email=' . $this->email);

        QueuedPasswordResetJob::dispatch($this, $url);
    }

    public function sendEmailVerificationNotification(): void
    {
        QueueEmailVerificationJob::dispatch($this);
    }

    public function pegawai(): HasOne
    {
        return $this->hasOne(Pegawai::class, 'user_id');
    }

    public function pelanggan(): HasOne
    {
        return $this->hasOne(Pelanggan::class, 'user_id');
    }

    public function pertanyaan_pesans(): HasOne
    {
        return $this->hasOne(PertanyaanPelangganPesan::class, 'created_by');
    }

    public function sys_user_groups(): HasMany
    {
        return $this->hasMany(SysUserGroup::class, 'user_id');
    }

    public function sys_user_notifs(): HasMany
    {
        return $this->hasMany(SysUserNotif::class, 'user_id');
    }

    public function sys_user_fbtokens(): HasMany
    {
        return $this->hasMany(SysUserFbtoken::class, 'user_id');
    }
}
