<?php

if (!function_exists('moneyFormat')) {
    function moneyFormat($value): string
    {
        return number_format($value, 0, ",", ".");
    }
}

if (!function_exists('singkatanRupiah')) {
    function singkatanRupiah($nilai): string
    {
        // Mendefinisikan batasan nilai dan singkatannya dalam array
        $batasan = [
            1000000000000 => 'T',
            1000000000 => 'M',
            1000000 => 'Jt',
            1000 => 'Rb'
        ];

        foreach ($batasan as $batas => $singkatan) {
            if ($nilai >= $batas) {
                return str_replace('.', ',', round($nilai / $batas, 2)) . ' ' . $singkatan;
            }
        }

        // Jika nilai di bawah 1.000, tidak perlu disingkat
        return $nilai;
    }
}

if (!function_exists('monthIndonesia')) {
    function monthIndonesia($month): string
    {
        $bulan = [
            1 => 'Januari',
            2 => 'Februari',
            3 => 'Maret',
            4 => 'April',
            5 => 'Mei',
            6 => 'Juni',
            7 => 'Juli',
            8 => 'Agustus',
            9 => 'September',
            10 => 'Oktober',
            11 => 'November',
            12 => 'Desember',
        ];

        return $bulan[$month];
    }
}
