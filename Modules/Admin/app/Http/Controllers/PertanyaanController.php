<?php

namespace Modules\Admin\Http\Controllers;

use App\Classes\Breadcrumbs;
use App\Enums\PelangganJenisPelanggan;
use App\Http\Controllers\Controller;
use App\Libraries\Mailer;
use App\Libraries\Notification;
use App\Libraries\WhatsappService;
use App\Models\Db1\Pelanggan;
use App\Models\Db1\PertanyaanPelanggan;
use App\Models\Db1\PertanyaanPelangganPesan;
use Exception;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Yajra\DataTables\Facades\DataTables;

class PertanyaanController extends Controller
{
    private string $module = __CLASS__;
    private string $url = 'admin/pertanyaan';
    private string $view = 'admin::pertanyaan';


    private function defaultParser(): array
    {
        return [
            'url'    => $this->url,
            'module' => $this->module,
            'view'   => $this->view,
        ];
    }

    public function index(Request $request)
    {
        $breadcrumbs = [
            new Breadcrumbs('Admin'),
            new Breadcrumbs('Pertanyaan Pelanggan', url($this->url)),
        ];

        $total_new = PertanyaanPelanggan::where('status', 'opened')->whereHas('pesans', function (Builder $query) {
            $query->where('is_replied', 'no');
        })->count();

        $parser = array_merge($this->defaultParser(), [
            'breadcrumbs'    => $breadcrumbs,
            'status_message' => $request->status_message != '' ? $request->status_message : 'opened',
            'total_new'      => $total_new,
        ]);


        return view("$this->view.index")->with($parser);
    }

    public function add(PertanyaanPelanggan $pertanyaan, Request $request)
    {
        $breadcrumbs = [
            new Breadcrumbs('Admin'),
            new Breadcrumbs('Pertanyaan Pelanggan', url($this->url)),
            new Breadcrumbs('Detail Pesan', url($this->url . "/" . $pertanyaan->id . "/" . "add")),
        ];

        $total_new = PertanyaanPelanggan::where('status', 'opened')->whereHas('pesans', function (Builder $query) {
            $query->where('is_replied', 'no');
        })->count();

        $parser = array_merge($this->defaultParser(), [
            'breadcrumbs'    => $breadcrumbs,
            'status_message' => $request->status_message != '' ? $request->status_message : 'opened',
            'total_new'      => $total_new,
            'data'           => $pertanyaan,
        ]);

        return view("$this->view.upsert")->with($parser);
    }

    public function store(PertanyaanPelanggan $pertanyaan, Request $request)
    {
        try {
            $array_validate = [
                'pesan' => 'required',
            ];

            $input = $request->validate($array_validate);

            DB::transaction(function () use ($input, $pertanyaan, $request) {
                $pertanyaan->status = 'opened';
                $pertanyaan->save();
                DB::table('pertanyaan_pelanggan_pesan')->where('pertanyaan_id', $pertanyaan->id)->update(array(
                    'is_replied' => 'yes',
                ));

                $data_pesan = [
                    'created_by'    => auth()->id(),
                    'pertanyaan_id' => $pertanyaan->id,
                    'pesan'         => $input['pesan'],
                    'is_replied'    => 'no',
                ];

                PertanyaanPelangganPesan::create($data_pesan);
            });

            $url = url('app/#/ask-questions?id=' . $pertanyaan->id);

            $pesanWA = sprintf("Balasan dari BBSJJIKKP (*%s*) \n", auth()->user()->name);
            $pesanWA .= sprintf("Nomor Tiket #%s \n", $pertanyaan->id);
            $pesanWA .= sprintf("Topik : %s \n", $pertanyaan->topik);
            if ($pertanyaan->layanan) {
                $pesanWA .= sprintf("ID Layanan : %s \n", $pertanyaan->layanan);
            }
            $pesanWA .= sprintf("Pesan : %s \n", $input['pesan']);
            $pesanWA .= sprintf("\n\nDetail: %s", $url);


            $notifParameter = [
                'pelanggan_id' => $pertanyaan->pelanggan_id,
                'judul'        => 'Balasan Pertanyaan dari BBSJJIKKP',
                'pesan_notif'  => sprintf("%s membalas pertanyaan anda, tiket #%s", auth()->user()->name, $pertanyaan->id),
                'url_notif'    => $url,
                'pesan_wa'     => $pesanWA,
                'pesan_email'  => sprintf("%s membalas pertanyaan anda, tiket #%s", auth()->user()->name, $pertanyaan->id),
            ];

            $this->notif_pelanggan($notifParameter);

            return redirect($this->url . "/" . $pertanyaan->id . "/add")->with('message', sprintf("Berhasil menambahkan pesan untuk tiket : %s", $pertanyaan->id));
        } catch (Exception $e) {
            return redirect($this->url . "/" . $pertanyaan->id . "/add")->with('message', $e->getMessage());
        }
    }

    public function closed($pertanyaan, Request $request)
    {
        return DB::transaction(function () use ($pertanyaan) {
            DB::table('pertanyaan_pelanggan')->where('id', $pertanyaan)->update(array(
                'status'    => 'closed',
                'closed_by' => auth()->id()
            ));

            DB::table('pertanyaan_pelanggan_pesan')->where('pertanyaan_id', $pertanyaan)->update(array(
                'is_replied' => 'yes',
            ));
        }, 5);
    }


    /**
     * @throws Exception
     */
    public function ajax(Request $request)
    {
        $request->validate(['action' => 'required']);
        return match ($request->input('action')) {
            'datatable-pesan' => $data = $this->ajax_datatable_pesan($request),
            default => abort(404),
        };
    }

    /**
     * @throws Exception
     */
    private function ajax_datatable_pesan(Request $request): JsonResponse
    {
        $data = PertanyaanPelanggan::where('status', $request->status_message)
            ->with('pelanggan', 'pelanggan.user')
            ->withCount([
                'pesans' => function ($query) {
                    $query->where('is_replied', 'no');
                }
            ]);

        return Datatables::eloquent($data)
            ->addIndexColumn()
            ->addColumn('fullname', function ($data) {
                return $data->pelanggan->user->name;
            })
            ->make();
    }

    private function notif_pelanggan(array $notifParameter)
    {
        $user_pelanggan = Pelanggan::where('id', '=', $notifParameter['pelanggan_id'])->with(['user'])->first();
        if ($user_pelanggan) {
            if ($user_pelanggan->jenis_pelanggan === PelangganJenisPelanggan::PERORANGAN->value) {
                $nomor_wa     = ($user_pelanggan->detail->whatsapp) ? $user_pelanggan->detail->whatsapp : '';
                $email        = ($user_pelanggan->detail->surel) ? $user_pelanggan->detail->surel : '';
                $isWAVerified = $user_pelanggan->detail->whatsapp_verified;
            } else {
                $nomor_wa     = ($user_pelanggan->detail->pj_whatsapp) ? $user_pelanggan->detail->pj_whatsapp : '';
                $email        = ($user_pelanggan->detail->pj_surel) ? $user_pelanggan->detail->pj_surel : '';
                $isWAVerified = $user_pelanggan->detail->pj_whatsapp_verified;
            }

            $libNotif = new Notification($user_pelanggan->user->id, $notifParameter['judul'], $notifParameter['pesan_notif'], $notifParameter['url_notif']);
            $libNotif->sendInBackground();

            if ($email != '') {
                $libMailer = new Mailer();
                $libMailer->subject($notifParameter['judul'])
                    ->to($email)
                    ->body($notifParameter['pesan_email'])
                    ->sendInBackground();
            }

            if ($isWAVerified && $nomor_wa != '') {
                WhatsappService::sendMessage($nomor_wa, $notifParameter['pesan_wa'])
                    ->sendInBackground();
            }
        }
    }
}
