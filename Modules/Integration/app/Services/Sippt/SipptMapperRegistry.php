<?php

namespace Modules\Integration\Services\Sippt;

use App\Models\Db2\FormAset;
use App\Models\Db2\FormGrkValidasi;
use App\Models\Db2\FormGrkVerifikasi;
use App\Models\Db2\FormHalal;
use App\Models\Db2\FormInspeksi;
use App\Models\Db2\FormJasaLainnya;
use App\Models\Db2\FormKalibrasi;
use App\Models\Db2\FormLsp;
use App\Models\Db2\FormMiniplant;
use App\Models\Db2\FormPelatihan;
use App\Models\Db2\FormPengujian;
use App\Models\Db2\FormPup;
use App\Models\Db2\FormSertifikasi;
use App\Models\Db2\Permohonan;
use Exception;
use Modules\Integration\Services\Sippt\Mappers\HalalMapper;
use Modules\Integration\Services\Sippt\Mappers\InkubatorMapper;
use Modules\Integration\Services\Sippt\Mappers\InspeksiMapper;
use Modules\Integration\Services\Sippt\Mappers\JasaLainnyaMapper;
use Modules\Integration\Services\Sippt\Mappers\KalibrasiMapper;
use Modules\Integration\Services\Sippt\Mappers\PBAMapper;
use Modules\Integration\Services\Sippt\Mappers\PelatihanMapper;
use Modules\Integration\Services\Sippt\Mappers\PengujianMapper;
use Modules\Integration\Services\Sippt\Mappers\RBPIMapper;
use Modules\Integration\Services\Sippt\Mappers\SertifikasiMapper;
use Modules\Integration\Services\Sippt\Mappers\SipptFieldMapper;
use Modules\Integration\Services\Sippt\Mappers\TekProMapper;
use Modules\Integration\Services\Sippt\Mappers\TIMapper;
use Modules\Integration\Services\Sippt\Mappers\UjiProfisiensiMapper;
use Modules\Integration\Services\Sippt\Mappers\VerifikasiMapper;

class SipptMapperRegistry
{
    /**
     * Resolusi mapper SIPPT berdasarkan data entitas Permohonan.
     *
     * @throws Exception
     */
    public function resolve(Permohonan $permohonan): SipptFieldMapper
    {
        // 1. Cek dari polymorphic formable di detailPermohonan
        $detail = $permohonan->detailPermohonan()->first();
        if ($detail && !empty($detail->formable_type)) {
            $mapper = $this->resolveByFormableType($detail->formable_type);
            if ($mapper) {
                return $mapper;
            }
        }

        // 2. Cek eksistensi relasi form jika formable_type tidak terisi di detailPermohonan
        if ($permohonan->formPengujian()->exists()) {
            return new PengujianMapper();
        }
        if ($permohonan->formKalibrasi()->exists()) {
            return new KalibrasiMapper();
        }
        if ($permohonan->formSertifikasi()->exists() || $permohonan->formLsp()->exists()) {
            return new SertifikasiMapper();
        }
        if ($permohonan->formPelatihan()->exists()) {
            return new PelatihanMapper();
        }
        if ($permohonan->formInspeksi()->exists()) {
            return new InspeksiMapper();
        }
        if ($permohonan->formHalal()->exists()) {
            return new HalalMapper();
        }
        if ($permohonan->formPup()->exists()) {
            return new UjiProfisiensiMapper();
        }
        if ($permohonan->formGrkVerifikasi()->exists() || $permohonan->formGrkValidasi()->exists()) {
            return new VerifikasiMapper();
        }
        if ($permohonan->formMiniplant()->exists()) {
            return new TekProMapper();
        }
        if ($permohonan->formAset()->exists() || $permohonan->formJasaLainnya()->exists()) {
            return new JasaLainnyaMapper();
        }

        // Fallback default ke JasaLainnya agar transaksi tetap tersinkronisasi
        return new JasaLainnyaMapper();
    }

    /**
     * Resolusi mapper berdasarkan nama class formable.
     */
    public function resolveByFormableType(string $formableType): ?SipptFieldMapper
    {
        return match ($formableType) {
            FormPengujian::class     => new PengujianMapper(),
            FormKalibrasi::class     => new KalibrasiMapper(),
            FormSertifikasi::class   => new SertifikasiMapper(),
            FormLsp::class           => new SertifikasiMapper(),
            FormPelatihan::class     => new PelatihanMapper(),
            FormInspeksi::class      => new InspeksiMapper(),
            FormHalal::class         => new HalalMapper(),
            FormPup::class           => new UjiProfisiensiMapper(),
            FormGrkVerifikasi::class => new VerifikasiMapper(),
            FormGrkValidasi::class   => new VerifikasiMapper(),
            FormMiniplant::class     => new TekProMapper(),
            FormAset::class          => new JasaLainnyaMapper(),
            FormJasaLainnya::class   => new JasaLainnyaMapper(),
            default                  => null,
        };
    }

    /**
     * Resolusi mapper secara eksplisit menggunakan nama modul SIPPT.
     *
     * @throws Exception
     */
    public function resolveByModuleName(string $moduleName): SipptFieldMapper
    {
        return match (strtolower(trim($moduleName))) {
            'pengujian'             => new PengujianMapper(),
            'kalibrasi'             => new KalibrasiMapper(),
            'sertifikasi'           => new SertifikasiMapper(),
            'pelatihan'             => new PelatihanMapper(),
            'inspeksi'              => new InspeksiMapper(),
            'teknologiproses'       => new TekProMapper(),
            'konsultasi'            => new KonsultasiMapper(),
            'inkubator'             => new InkubatorMapper(),
            'ti'                    => new TIMapper(),
            'lainnya'               => new JasaLainnyaMapper(),
            'rbpi'                  => new RBPIMapper(),
            'uji_profisiensi'       => new UjiProfisiensiMapper(),
            'produsen_bahan_acuan'  => new PBAMapper(),
            'verifikasi'            => new VerifikasiMapper(),
            'halal'                 => new HalalMapper(),
            default                 => throw new Exception("Modul SIPPT [{$moduleName}] tidak dikenali."),
        };
    }
}
