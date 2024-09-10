<?php

namespace Modules\Eksternal\Http\Traits;

use App\Enums\Option;
use App\Enums\PelangganJenisPelanggan;
use App\Models\Db1\SysUser;

trait VerifiedWhatsappTrait
{
    public function isWhatsappVerified(SysUser $user): bool
    {
        $user->load('pelanggan.detail');
        $pelanggan = $user->pelanggan;

        return match (PelangganJenisPelanggan::tryFrom($pelanggan->jenis_pelanggan)) {
            PelangganJenisPelanggan::PERORANGAN => $pelanggan->detail->whatsapp_verified == Option::YES->value && !empty($pelanggan->detail->whatsapp),
            PelangganJenisPelanggan::BADAN_USAHA, PelangganJenisPelanggan::INSTANSI_PEMERINTAH => $pelanggan->detail->pj_whatsapp_verified == Option::YES->value && !empty($pelanggan->detail->pj_whatsapp),
            default => false,
        };
    }
}
