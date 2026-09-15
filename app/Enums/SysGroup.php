<?php

namespace App\Enums;

enum SysGroup: string
{
    case ROOT = 'c38771bc-427b-11ef-9454-0242ac120002';
    case ADMIN = 'c3877414-427b-11ef-9454-0242ac120002';
    case PELANGGAN = 'c3877540-427b-11ef-9454-0242ac120002';
    case PEGAWAI = 'c3877662-427b-11ef-9454-0242ac120002';
    case BENDAHARA = 'c3877663-427b-11ef-9454-0242ac120002';
    case MARKETING = 'c3877664-427b-11ef-9454-0242ac120002';
}
