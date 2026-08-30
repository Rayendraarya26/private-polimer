<?php

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Db2\Permohonan;
use Illuminate\Support\Facades\DB;

echo "=== BREAKDOWN PERMOHONAN DI POLIMER ===\n\n";

$permohonanList = Permohonan::with('detailPermohonan')->get();
echo "Total Permohonan di Polimer: " . $permohonanList->count() . "\n\n";

$typeCounts = [];
foreach ($permohonanList as $p) {
    $types = $p->detailPermohonan->pluck('formable_type')->toArray();
    $typeStr = empty($types) ? 'None' : implode(', ', $types);
    $typeCounts[$typeStr] = ($typeCounts[$typeStr] ?? 0) + 1;
    echo "Permohonan #{$p->no_permohonan} (ID: {$p->id})\n";
    echo "  Status: {$p->status_workflow} / {$p->status_bayar}\n";
    echo "  Type  : {$typeStr}\n\n";
}

echo "=== SUMMARY BY TYPE ===\n";
foreach ($typeCounts as $t => $c) {
    echo "  $t : $c\n";
}
