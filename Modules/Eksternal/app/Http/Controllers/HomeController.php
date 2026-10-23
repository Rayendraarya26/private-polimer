<?php

namespace Modules\Eksternal\Http\Controllers;

use App\Enums\HomepageKey;
use App\Enums\SysGroup;
use App\Http\Controllers\Controller;
use App\Libraries\MultiNotification;
use App\Models\Db1\SiteContactUs;
use App\Models\Db1\SiteManajemen;
use App\Models\Db1\SysUser;
use App\Traits\CaptchaTrait;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;

class HomeController extends Controller
{
    use CaptchaTrait;

    private string $view = 'eksternal::home';

    public function index()
    {
        $locale = app()->getLocale();

        $parser = Cache::remember("home_parser_{$locale}", now()->addMinutes(60), function () use ($locale) {
            $cacheDuration = now()->addMinutes(60);

            // 1 query instead of 6
            $siteData = SiteManajemen::whereIn('key', [
                HomepageKey::SLIDER->value,
                HomepageKey::SERVICES->value,
                HomepageKey::PARTNERS->value,
                HomepageKey::ABOUT->value,
                HomepageKey::SOCIAL_MEDIA->value,
                HomepageKey::ACCORDION->value,
            ])->get()->keyBy('key');

            return [
                'banners'         => $this->parseBanners($siteData->get(HomepageKey::SLIDER->value), $cacheDuration),
                'services'        => $this->parseServices($siteData->get(HomepageKey::SERVICES->value), $cacheDuration),
                'partners'        => $this->parsePartners($siteData->get(HomepageKey::PARTNERS->value), $cacheDuration),
                'testimonials'    => $this->getTestimonials(),
                'aboutUs'         => localized_content($siteData->get(HomepageKey::ABOUT->value)?->data['data'] ?? ''),
                'companyOverview' => $this->getCompanyOverview(),
                'social_medias'   => $siteData->get(HomepageKey::SOCIAL_MEDIA->value)?->data ?? [],
                'collapsible'     => $this->parseAccordion($siteData->get(HomepageKey::ACCORDION->value)),
            ];
        });

        return view("$this->view.index", $parser);
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
        ], [
            'telp.required'        => 'Nomor telepon wajib diisi.',
            'telp.numeric'         => 'Nomor telepon harus berupa angka.',
            'telp.digits_between'  => 'Nomor telepon harus antara 10-15 digit. Gunakan awalan 62, contoh: 628123456789',
            'telp.regex'           => 'Nomor telepon harus dimulai dengan 62. Contoh: 628123456789',
        ]);

        if (!$this->validateCaptcha($request->input('recaptcha'))) {
            return response()->json(['errors' => ['recaptcha' => ['Captcha tidak valid.']]], 422);
        }

        try {
            $contact_us           = new SiteContactUs();
            $contact_us->nama     = $request->nama;
            $contact_us->email    = $request->email;
            $contact_us->telp     = $request->telp;
            $contact_us->instansi = $request->instansi;
            $contact_us->pesan    = $request->pesan;
            $contact_us->save();

            // send to all root user (wrapped in try-catch to not break success response)
            try {
                $admin = SysUser::whereHas('sys_user_groups', function ($query) {
                    $query->where('group_id', SysGroup::ADMIN->value);
                })->get();

                if ($admin && count($admin) > 0) {
                    foreach ($admin as $user) {
                        try {
                            $notifBuilder = new MultiNotification($user, url('/admin/data-contact-us'));

                            if ($notifBuilder) {
                                $notifBuilder
                                    ->buildEmailNotification('Pesan Baru Contact Us', "Ada pesan baru dari $request->nama.")
                                    ->buildPushNotification('Pesan Baru Contact Us', "Ada pesan baru dari $request->nama.")
                                    ->buildWhatsapp("Ada pesan baru (Contact Us) dari $request->nama. \nPesan: $request->pesan")
                                    ->send();
                            }
                        } catch (Exception $notifException) {
                            // Log notification error but don't fail the response
                            \Log::warning('Notification error for contact us: ' . $notifException->getMessage());
                        }
                    }
                }
            } catch (Exception $adminException) {
                // Log admin fetch error but don't fail the response
                \Log::warning('Failed to fetch admin users: ' . $adminException->getMessage());
            }

            return response()->json(['success' => 'Pesan berhasil dikirim.'], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Terjadi kesalahan saat menyimpan pesan.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // ──────────────────────────────────────────────
    // Private Helper Methods
    // ──────────────────────────────────────────────

    private function getImageUrl($imagePath, $cacheDuration): ?string
    {
        if (empty($imagePath) || !is_string($imagePath)) {
            return null;
        }

        // Gunakan proxy /media/s3 agar browser tidak perlu mengakses MinIO langsung
        // (presigned URL S3 ditandatangani untuk host internal Docker sehingga ditolak browser)
        return url('/media/s3/' . ltrim($imagePath, '/'));
    }

    private function parseBanners(?SiteManajemen $bannersObj, $cacheDuration): array
    {
        $banners = [];
        if (!$bannersObj || !is_array($bannersObj->data)) {
            return $banners;
        }

        foreach ($bannersObj->data as $item) {
            $banners[] = [
                "image_url"   => $this->getImageUrl($item['image_path'] ?? null, $cacheDuration),
                "title"       => localized_content($item['title'] ?? null),
                "description" => localized_content($item['description'] ?? null),
                "cta_text"    => localized_content(Arr::get($item, 'cta_text', null)),
                "cta_url"     => Arr::get($item, 'cta_url', null),
                "cta_target"  => Arr::get($item, 'cta_target', null),
                'order'       => $item['order'] ?? 0,
            ];
        }

        usort($banners, fn($a, $b) => ($a['order'] ?? 0) <=> ($b['order'] ?? 0));
        return $banners;
    }

    private function parseServices(?SiteManajemen $servicesObj, $cacheDuration): array
    {
        $services = [];
        if (!$servicesObj || !is_array($servicesObj->data)) {
            return $services;
        }

        foreach ($servicesObj->data as $item) {
            $services[] = [
                "id"          => $item['id'] ?? null,
                "image_url"   => $this->getImageUrl($item['image_path'] ?? null, $cacheDuration),
                "name"        => localized_content(Arr::get($item, 'title', Arr::get($item, 'name'))),
                "description" => localized_content(Arr::get($item, 'description')),
                'order'       => Arr::get($item, 'order', 0),
            ];
        }

        usort($services, fn($a, $b) => ($a['order'] ?? 0) <=> ($b['order'] ?? 0));
        return $services;
    }

    private function parsePartners(?SiteManajemen $partnersObj, $cacheDuration): array
    {
        $partners = [];
        if (!$partnersObj || !is_array($partnersObj->data)) {
            return $partners;
        }

        foreach ($partnersObj->data as $item) {
            $partners[] = [
                "image_url" => $this->getImageUrl($item['image_path'] ?? null, $cacheDuration),
                'order'     => $item['order'] ?? 0,
            ];
        }

        usort($partners, fn($a, $b) => ($a['order'] ?? 0) <=> ($b['order'] ?? 0));
        return $partners;
    }

    private function getTestimonials(): array
    {
        return [
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
                "content"  => "I would like to appreciate this meeting actually today was really effective. I was so glad to see here, before the session I didn't have this feeling that we this happens here but it was really glad, great, and excellent and I would like to appreciate everything was perfect. Thank you very much,  everything was great."
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
            [
                "avatar"   => null,
                "title"    => "Sari Indah",
                "subtitle" => "CV Kulit Berkualitas, layanan Pengujian",
                "content"  => "Laboratorium testing mereka sangat lengkap dan akurat. Hasil analisis yang diberikan sangat membantu dalam pengembangan produk kami. Terima kasih atas pelayanan yang excellent."
            ],
        ];
    }

    private function getCompanyOverview(): array
    {
        return [
            "title"       => __('home.overview.title'),
            "description" => __('home.overview.description'),
            "statistics"  => [
                ["value" => "10+",    "label" => __('home.overview.stats.country_reach')],
                ["value" => "1000+",  "label" => __('home.overview.stats.industry_partners')],
                ["value" => "13",     "label" => __('home.overview.stats.service_types')],
                ["value" => "99,47%", "label" => __('home.overview.stats.punctuality')],
            ]
        ];
    }

    private function parseAccordion(?SiteManajemen $siteData): array
    {
        $items = $siteData?->data ?? [];
        if (!empty($items)) {
            usort($items, fn($a, $b) => ($a['order'] ?? 0) <=> ($b['order'] ?? 0));

            return array_map(function ($item) {
                return [
                    'title'           => is_array($item['title'] ?? null) ? localized_content($item['title']) : ($item['title'] ?? ''),
                    'description'     => is_array($item['description'] ?? null) ? localized_content($item['description']) : ($item['description'] ?? ''),
                    'is_default_open' => (bool) ($item['is_default_open'] ?? false),
                ];
            }, $items);
        }

        return $this->getCollapsible();
    }

    private function getCollapsible(): array
    {
        return [
            [
                "title"           => __('home.faq.why_jis_title'),
                "is_default_open" => true,
                "description"     => __('home.faq.why_jis_desc'),
            ],
            [
                "title"           => __('home.faq.services_title'),
                "is_default_open" => false,
                "description"     => __('home.faq.services_desc'),
            ],
            [
                "title"           => __('home.faq.quality_title'),
                "is_default_open" => false,
                "description"     => __('home.faq.quality_desc'),
            ],
        ];
    }
}
