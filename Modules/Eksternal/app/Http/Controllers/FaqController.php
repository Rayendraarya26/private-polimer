<?php

namespace Modules\Eksternal\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Db1\MasterLayanan;

class FaqController extends Controller
{
    private string $module = __CLASS__;
    private string $url = '/faq';
    private string $view = 'eksternal::faq';

    public function index()
    {
        $parser = [
            'listLayanan' => MasterLayanan::query()->get(),
        ];
        return view("$this->view.index")->with($parser);
    }

    public function listTopic($slugLayanan)
    {
        $layanan = MasterLayanan::query()->where('slug', $slugLayanan)->firstOrFail();
        $parser = [
            'layanan' => $layanan,
            'listFaq' => $layanan->faqs()->get(),
        ];
        return view("$this->view.topic")->with($parser);
    }

    public function detailFaq($slugLayanan, $slugQuestion)
    {
        $layanan = MasterLayanan::query()->where('slug', $slugLayanan)->firstOrFail();
        $faq = $layanan->faqs()->where('slug', $slugQuestion)->firstOrFail();
        $parser = [
            'layanan' => $layanan,
            'faq'     => $faq,
        ];
        return view("$this->view.detail")->with($parser);
    }
}
