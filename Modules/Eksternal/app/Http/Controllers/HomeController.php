<?php

namespace Modules\Eksternal\Http\Controllers;

use App\Enums\HomepageKey;
use App\Http\Controllers\Controller;
use App\Models\Db1\SiteContactUs;
use App\Models\Db1\SiteManajemen;
use App\Traits\CaptchaTrait;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class HomeController extends Controller
{
    use CaptchaTrait;

    private string $view = 'eksternal::home';

    public function index()
    {
        $bannersObj = SiteManajemen::query()->where('key', HomepageKey::SLIDER)->first();
        $banners    = [];
        foreach ($bannersObj->data as $item) {
            $banners[] = [
                "image_url"   => Storage::disk('s3')->temporaryUrl($item['image_path'], now()->addMinutes(1)),
                "title"       => $item['title'],
                "description" => $item['description'],
                'order'       => $item['order']
            ];
        }
        usort($banners, function ($a, $b) {
            return $a['order'] <=> $b['order'];
        });


        $servicesObj = SiteManajemen::query()->where('key', HomepageKey::SERVICES)->first();
        $services    = [];
        foreach ($servicesObj->data as $item) {
            $services[] = [
                "image_url" => Storage::disk('s3')->temporaryUrl($item['image_path'], now()->addMinutes(1)),
                "name"      => $item['title'],
                'order'     => $item['order']
            ];
        }
        usort($services, function ($a, $b) {
            return $a['order'] <=> $b['order'];
        });

        $partnersObj = SiteManajemen::query()->where('key', HomepageKey::PARTNERS)->first();
        $partners    = [];
        foreach ($partnersObj->data as $item) {
            $partners[] = [
                "image_url" => Storage::disk('s3')->temporaryUrl($item['image_path'], now()->addMinutes(1)),
                'order'     => $item['order']
            ];
        }
        usort($partners, function ($a, $b) {
            return $a['order'] <=> $b['order'];
        });

        $testimonials = [
            [
                "avatar"   => null,
                "title"    => "Sutrisno Aji",
                "subtitle" => "MKJ Home Jogja",
                "content"  => "Terima kasih kepada LPH BBSPJIKKP untuk diskon 50% dalam rangka HUT RI. Semoga sukses dan bagi yang ingin mendapatkan produk halal semoga bermanfaat bagi kita semua."
            ],
            [
                "avatar"   => null,
                "title"    => "Sofyan",
                "subtitle" => "UMKM Kulit",
                "content"  => "Semoga pelayanan tambah maju dan sukses terus."
            ],
            [
                "avatar"   => null,
                "title"    => "Retno",
                "subtitle" => "PT. Adi Satria Abadi",
                "content"  => "Terima kasih untuk BBSPJIKKP dan semua kru. Krunya ramah, cepat, teliti, pokoknya semuanya deh. The best untuk balai."
            ],
            [
                "avatar"   => null,
                "title"    => "Mojtaba Ashjaei",
                "subtitle" => "Qom Industrial Parks Co. (Islamic Republic of Iran)",
                "content"  => "I would like to appreciate this meeting actually today was really effective. I was so glad to see here, before the session I didn’t have this feeling that we this happens here but it was really glad, great, and excellent and I would like to appreciate everything was perfect. Thank you very much,  everything was great."
            ],
            [
                "avatar"   => null,
                "title"    => "Mr. Puzhen",
                "subtitle" => "PT. Kayahan Berseri, layanan sertifikasi",
                "content"  => "Atas nama seluruh pegawai PT Kahayan Berseri, saya mengucapkan terima kasih kepada tim audit BBKKP. Saya sangat beruntung. Tim audit sabar, teliti, detail dan akurat dalam mengaudit SMK3L & SNI. Sebagai saksi penataran SMK3L & SNI. sistem manajemen kami, sepanjang jalan, tim saya telah memperoleh banyak hal, terima kasih banyak atas bimbingan Anda dan semoga pekerjaan Anda lancar dan keluarga bahagia."
            ],
            [
                "avatar"   => null,
                "title"    => "Naomika Manurung",
                "subtitle" => "PT Hok Tong Jambi, layanan Sertifikasi",
                "content"  => "Dalam proses sertifikasi industri hijau semua berjalan dengan baik dan lancar dan sangat membantu perusahaan kami untuk lebih baik kedepannya."
            ],
        ];

        $aboutUsObj = SiteManajemen::query()->where('key', HomepageKey::ABOUT)->first();
        $aboutUs    = $aboutUsObj->data['data'];

        return view("$this->view.index", [
            "banners"      => $banners,
            "services"     => $services,
            "partners"     => $partners,
            "testimonials" => $testimonials,
            'aboutUs'      => $aboutUs
        ]);
    }

    public function contactUs(Request $request)
    {
        $request->validate([
            'recaptcha' => 'required',
            'nama'      => 'required',
            'email'     => 'required|email:rfc,dns',
            'telp'      => 'required|numeric|digits_between:10,15|regex:/^62[0-9]*$/',
            'instansi'  => 'required',
            'pesan'     => 'required',
        ]);

        if (!$this->validateCaptcha($request->input('recaptcha'))) {
            return back()->withInput()->withErrors(['recaptcha' => 'Captcha tidak valid.']);
        }

        try {
            $contact_us           = new SiteContactUs();
            $contact_us->nama     = $request->nama;
            $contact_us->email    = $request->email;
            $contact_us->telp     = $request->telp;
            $contact_us->instansi = $request->instansi;
            $contact_us->pesan    = $request->pesan;
            $contact_us->save();

            return back()->with('success', 'Pesan berhasil dikirim.');
        } catch (Exception $e) {
            return back()->withInput()->withErrors(['error' => $e->getMessage()]);
        }
    }
}
