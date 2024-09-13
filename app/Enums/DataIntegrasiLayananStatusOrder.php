<?php

namespace App\Enums;

use EmreYarligan\EnumConcern\EnumConcern;

enum DataIntegrasiLayananStatusOrder: string
{
    use EnumConcern;

    case PERMOHONAN = 'permohonan';
    case PEMBAYARAN = 'pembayaran';
    case PROSES = 'proses';
    case REVIEW = 'review';
    case SELESAI = 'selesai';
    case DITOLAK = 'ditolak';
	
	public function getPersentaseOrder(): string
    {
		return match ($this) {
            self::PERMOHONAN => 20,
            self::PEMBAYARAN => 40,
            self::PROSES => 60,
            self::REVIEW => 80,
            self::SELESAI => 100,
            self::DITOLAK => 0
        };
    }
}
