<?php

namespace Modules\Admin\Http\Controllers;

use App\Classes\Breadcrumbs;
use App\Http\Controllers\Controller;
use App\Libraries\TteService;
use App\Models\Db1\DataIntegrasiLayanan;
use App\Models\Db1\MasterLayanan;
use BBSPJIKKP\Sdk\Esign\ApiException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Yajra\DataTables\Facades\DataTables;

class ManageOrderController extends Controller
{


    private string $module = __CLASS__;
    private string $url    = 'admin/permintaan-layanan';
    private string $view   = 'admin::permintaan_layanan';

    private function defaultParser(): array
    {
        return [
            'url'    => $this->url,
            'module' => $this->module,
            'view'   => $this->view,
        ];
    }

    public function index()
    {
        $breadcrumbs = [
            new Breadcrumbs('Admin'),
            new Breadcrumbs('Data Permitaan Layanan', url($this->url)),
        ];

        $parser = array_merge($this->defaultParser(), ['breadcrumbs' => $breadcrumbs]);

        return view("$this->view.index")->with($parser);
    }

    public function detail(Request $request, DataIntegrasiLayanan $order)
    {
        $breadcrumbs = [
            new Breadcrumbs('Admin'),
            new Breadcrumbs('Data Permitaan Layanan', url($this->url)),
            new Breadcrumbs('Detail'),
        ];
        $data_detail = [];

        if ($request->d == 'file') {
            $json_decode = json_decode(json_encode([$order->file_attachment]), TRUE);
            $data_detail = isset($json_decode[0]) ? $json_decode[0] : [];
        } else {
            $json_decode = json_decode(json_encode([$order->metadata]), TRUE);
            $data_detail = isset($json_decode[0]) ? $json_decode[0] : [];
        }

        $parse = array_merge($this->defaultParser(), [
            'breadcrumbs' => $breadcrumbs,
            'data'        => $order,
            'detail'      => $request->d,
            'data_detail' => $data_detail,

        ]);
        return view("$this->view.detail")->with($parse);
    }

    public function ajax(Request $request)
    {
        return match ($request->action) {
            'datatable-order' => $this->ajax_datatable_order($request),
            default           => abort(404),
        };
    }

    private function ajax_datatable_order(Request $request): JsonResponse
    {
        $startDate = $request->input('start_date');
        $endDate   = $request->input('end_date');

        $data = DataIntegrasiLayanan::query()->select([
            'id',
            'layanan_id',
            'user_id',
            'kode_order',
            'tanggal_order',
            'status_order',
            'file_attachment',
            'is_given_feedback',
            'feedback_json',
            'created_at',
            'updated_at',
        ])->with(['user', 'layanan'])
            ->when($startDate, function ($query) use ($startDate) {
                return $query->where('tanggal_order', '>=', $startDate);
            })
            ->when($endDate, function ($query) use ($endDate) {
                return $query->where('tanggal_order', '<=', $endDate);
            })
            ->when($request->has('feedback'), function ($query) use ($request) {
                $feedback  = $request->input('feedback');
                $feedback  = ($feedback == '1') ? true : false; 
                return $query->where('is_given_feedback', '=', $feedback);
            });

        return Datatables::eloquent($data)
            ->addIndexColumn()
            ->addColumn('user', function (DataIntegrasiLayanan $data) {
                return $data->user->name;
            })
            ->addColumn('layanan', function (DataIntegrasiLayanan $data) {
                return $data->layanan->name;
            })
            ->make();
    }

    /**
     * @throws ApiException
     */
    public function download(Request $request, $integrasiId)
    {
        $input = $request->validate(['kode' => 'required|string']);

        $integrasi = DataIntegrasiLayanan::query()->with('layanan')->where('id', $integrasiId)->first();

        if (!$integrasi) {
            return responseJSON("Silahkan pilih data permohonan dengan benar.", [], 400);
        }

        $attachmentJSON = $integrasi->file_attachment;
        // find in attachment where kode = $input['kode'], take the first one
        $attachment = collect($attachmentJSON)->firstWhere('kode', $input['kode']);
        if (!$attachment) return responseJSON("File tidak ditemukan", [], 404);

        // check ref_code is null or not
        $refCode = Arr::get($attachment, 'ref_code');
        if ($refCode) {
            return $this->downloadFromTTE($refCode);
        } else {
            return $this->downloadFromLayanan($integrasi->layanan, $integrasi->id_order, $input['kode']);
        }
    }

    /**
     * @throws ApiException
     */
    private function downloadFromTTE($refCode)
    {
        $tteService = new TteService();
        // Detail TTE
        $response = $tteService->verifyById($refCode);

        // Download file from file_link
        $fileContent = file_get_contents($response->getFileLink());

        return response($fileContent)
            ->header('Content-Type', 'application/pdf')
            ->header('Content-Disposition', 'attachment; filename="' . $response->getFileName() . '"');
    }

    private function downloadFromLayanan(MasterLayanan $layanan, $idOrder, $kode)
    {
        $url      = $layanan->certificate_url;
        $response = Http::withHeaders([
            'X-API-KEY' => config('integration.api-key'),
            'accept'    => 'application/json',
        ])
            ->get($url, [
                'id_permohonan'   => $idOrder,
                'kode_sertifikat' => $kode,
            ]);

        if ($response->failed()) {
            Log::error('Failed to download certificate', [
                'url'     => $url,
                'id'      => $idOrder,
                'kode'    => $kode,
                'message' => $response->json(),
            ]);
            return responseJSON("File tidak ditemukan !", [], 404);
        }

        return response($response->body())
            ->header('Content-Type', 'application/pdf')
            ->header('Content-Disposition', $response->header('Content-Disposition'));
    }
}
