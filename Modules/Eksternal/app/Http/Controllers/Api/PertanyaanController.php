<?php

namespace Modules\Eksternal\Http\Controllers\Api;

use App\Enums\SysGroup;
use App\Http\Controllers\Controller;
use App\Libraries\Mailer;
use App\Libraries\Notification;
use App\Libraries\WhatsappService;
use App\Models\Db1\DataIntegrasiLayanan;
use App\Models\Db1\MasterTopikPertanyaan;
use App\Models\Db1\PertanyaanPelanggan;
use App\Models\Db1\PertanyaanPelangganPesan;
use App\Models\Db1\SysUserGroup;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Modules\Eksternal\Http\Traits\VerifiedWhatsappTrait;


class PertanyaanController extends Controller
{
    use VerifiedWhatsappTrait;

    public function listTopic()
    {
        return responseJSON("Success", MasterTopikPertanyaan::query()->get());
    }

    public function listPertanyaan(Request $request)
    {
        $rows   = min($request->get('rows', 10), 50);
        $search = trim($request->get('search'));

        $list_pertanyaan = PertanyaanPelanggan::where('pelanggan_id', $request->user()->pelanggan->id)
            ->with(['pesans']);

        if ($search) {
            $list_pertanyaan->whereHas('pesans', function ($q) use ($search) {
                $q->where('pesan', 'LIKE', '%' . $search . '%');
            });
        }
        $total = $list_pertanyaan->count();

        $list_pertanyaan = $list_pertanyaan
            ->orderByDesc('created_at')
            ->paginate($rows);

        return responseJSON("Success", [
            'data'  => $list_pertanyaan->map(function ($item) {
                return [
                    'id'          => $item->id,
                    'layanan'     => $item->layanan,
                    'topik'       => $item->topik,
                    'status'      => $item->status,
                    'closed_by'   => ($item->closed_by != null) ? $item->user_closed->name : '',
                    'is_review'   => $item->is_review,
                    'rating'      => $item->rating,
                    'testimoni'   => $item->testimoni,
                    'created_at'  => $item->created_at,
                    'total_pesan' => $item->pesans->count(),
                    'new_reply'   => $item->pesans->where('is_replied', 'no')
                        ->where('created_by', '!=', auth()->user()->id)
                        ->count(),
                ];
            }),
            'total' => $total
        ]);
    }

    public function detailPertanyaan($id, Request $request)
    {
        $detail = PertanyaanPelanggan::where('pelanggan_id', $request->user()->pelanggan->id)
            ->where('id', $id)->first();

        if ($detail) {
            $detail['closed_by_name'] = $detail->closed_by ? $detail->user_closed->name : null;
            return responseJSON("Success", $detail);
        }

        return responseJSON("Data tidak ditemukan", [], 404);
    }

    public function listPesan($pertanyaan, Request $request)
    {
        $list_pesan = PertanyaanPelangganPesan::where('pertanyaan_id', $pertanyaan)
            ->orderBy('created_at')
            ->get();

        return responseJSON("Success", $list_pesan->map(function ($item) {
            return [
                'id'         => $item->id,
                'pesan'      => $item->pesan,
                'is_replied' => $item->is_replied,
                'is_author'  => $item->user->id == auth()->user()->id,
                'created_by' => $item->user->name,
                'created_at' => $item->created_at
            ];
        }));
    }

    public function newPertanyaan(Request $request)
    {
        if (!$this->isWhatsappVerified($request->user())) {
            return responseJSON("Anda belum memverifikasi nomor WA anda, silahkan update telebih dahulu di pengaturan 'Profile'.", [], 404);
        }
        $request->validate([
            'topik'      => 'required',
            'pertanyaan' => 'required',
            'layanan'    => 'required_unless:topik,Umum',
        ]);

        $openen_pertanyaan = PertanyaanPelanggan::where('pelanggan_id', $request->user()->pelanggan->id)
            ->where('status', 'opened')
            ->count();

        if ($openen_pertanyaan > 0) return responseJSON("Anda sudah memasukan pertanyaan sebelumnya, silahkan tutup dan berikan rating pelayanan.", [], 404);


        if ($request->topik !== 'Umum') {
            // validate layanan should be required and exist
            if ($request->layanan === '') return responseJSON("ID Layanan harus diisi.", [], 404);

            $integration = DataIntegrasiLayanan::query()->where('kode_order', $request->layanan)->first();
            if (!$integration) return responseJSON(sprintf("Layanan dengan ID %s tidak ditemukan, cek ID pada dashboard", $request->layanan), [], 404);
        }

        try {
            DB::beginTransaction();
            $pertanyaan               = new PertanyaanPelanggan();
            $pertanyaan->pelanggan_id = $request->user()->pelanggan->id;
            $pertanyaan->layanan      = $request->layanan != '' ? $request->layanan : null;
            $pertanyaan->topik        = $request->topik;
            $pertanyaan->save();

            $pesan                = new PertanyaanPelangganPesan();
            $pesan->created_by    = auth()->user()->id;
            $pesan->pertanyaan_id = $pertanyaan->id;
            $pesan->pesan         = $request->pertanyaan;
            $pesan->is_replied    = 'no';
            $pesan->save();

            $pesanWA = sprintf("Pertanyaan baru dari *%s* ( @%s ) \n", auth()->user()->name, $this->getWhatsappNumber($request->user()));
            $pesanWA .= sprintf("Nomor Tiket #%s \n", $pertanyaan->id);
            $pesanWA .= sprintf("Topik : %s \n", $pertanyaan->topik);
            if ($pertanyaan->layanan) {
                $pesanWA .= sprintf("ID Layanan : %s \n", $pertanyaan->layanan);
            }
            $pesanWA .= sprintf("Pertanyaan : %s \n", $request->pertanyaan);

            $notifParameter = [
                'judul'       => 'Pertanyaan Baru',
                'url_notif'   => url('admin/pertanyaan/' . $pertanyaan->id . '/add'),
                'pesan_notif' => 'Pesan pertanyaan dari' . auth()->user()->name . ', tiket #' . $pertanyaan->id . ' "' . $request->pertanyaan . '"',
                'pesan_wa'    => $pesanWA,
                'pesan_email' => 'Pesan pertanyaan dari ' . auth()->user()->name . ', tiket #' . $pertanyaan->id . ' "' . $request->pertanyaan . '"'
            ];

            $this->notif_admin($notifParameter);
            DB::commit();

            return responseJSON('Data pertanyaan berhasil disimpan.', [
                'id'          => $pertanyaan->id,
                'id_pesan'    => $pesan->id,
                'topik'       => $pertanyaan->topik,
                'layanan'     => $pertanyaan->layanan,
                'pertanyaan'  => $pesan->pesan,
                'status'      => $pertanyaan->status,
                'created_at'  => $pertanyaan->created_at,
                'total_pesan' => 0,
                'new_reply'   => 0,
            ], 201);
        } catch (Exception $e) {
            DB::rollBack();
            return responseJSON($e->getMessage(), [], 500);
        }
    }

    public function newPesan($pertanyaanId, Request $request)
    {
        if (!$this->isWhatsappVerified($request->user())) {
            return responseJSON("Anda belum memverifikasi nomor WA anda, silahkan update telebih dahulu di pengaturan 'Profile'.", [], 404);
        }
        $request->validate([
            'pesan' => 'required',
        ]);

        $pertanyaan = PertanyaanPelanggan::where('pelanggan_id', '!=', auth()->user()->id)->where('id', $pertanyaanId)->first();
        if (!$pertanyaan) {
            return responseJSON('Pertanyaan tidak ditemukan.', [], 404);
        }

        $pesanPertanyaan                = new PertanyaanPelangganPesan();
        $pesanPertanyaan->created_by    = auth()->user()->id;
        $pesanPertanyaan->pesan         = $request->pesan;
        $pesanPertanyaan->pertanyaan_id = $pertanyaan->id;
        $pesanPertanyaan->is_replied    = 'no';
        $pesanPertanyaan->save();

        PertanyaanPelangganPesan::where('created_by', '!=', auth()->user()->id)
            ->where('pertanyaan_id', $pertanyaan->id)
            ->update(['is_replied' => 'yes']);

        $pesanWA = sprintf("Pesan baru dari *%s* ( @%s ) \n", auth()->user()->name, $this->getWhatsappNumber($request->user()));
        $pesanWA .= sprintf("Nomor Tiket #%s \n", $pertanyaan->id);
        $pesanWA .= sprintf("Topik : %s \n", $pertanyaan->topik);
        if ($pertanyaan->layanan) {
            $pesanWA .= sprintf("ID Layanan : %s \n", $pertanyaan->layanan);
        }
        $pesanWA .= sprintf("Pesan : %s \n", $request->pesan);
        $pesanWA .= sprintf("\n\nDetail: %s", url('admin/pertanyaan/' . $pertanyaan->id . '/add'));

        $notifParameter = [
            'judul'       => 'Pesan Baru #' . $pertanyaan->id,
            'url_notif'   => url('admin/pertanyaan/' . $pertanyaan->id . '/add'),
            'pesan_notif' => sprintf('Pesan baru dari <b>%s<b>, dengan nomor tiket #%d "%s"', auth()->user()->name, $pertanyaan->id, $request->pesan),
            'pesan_wa'    => $pesanWA,
            'pesan_email' => sprintf('Pesan baru dari %s, dengan nomor tiket #%d "%s"', auth()->user()->name, $pertanyaan->id, $request->pesan),
        ];

        $this->notif_admin($notifParameter);

        return responseJSON('Data pesan berhasil disimpan.', [
            'id'         => $pesanPertanyaan->id,
            'pesan'      => $pesanPertanyaan->pesan,
            'is_replied' => $pesanPertanyaan->is_replied,
            'is_author'  => $pesanPertanyaan->user->id == auth()->user()->id,
            'created_by' => $pesanPertanyaan->user->name,
            'created_at' => $pesanPertanyaan->created_at
        ], 201);
    }

    public function closedPertanyaan(PertanyaanPelanggan $pertanyaan, Request $request)
    {
        if (!$this->isWhatsappVerified($request->user())) {
            return responseJSON("Anda belum memverifikasi nomor WA anda, silahkan update telebih dahulu di pengaturan 'Profile'.", [], 404);
        }

        $request->validate([
            'rating'    => 'in:1,2,3,4,5|nullable',
            'testimoni' => 'string|nullable',
        ]);

        if ($pertanyaan->is_review === 'yes' && $pertanyaan->status === 'closed') {
            return responseJSON("Anda sudah memberikan review dan rating layanan untuk pertanyaan ini.", [], 404);
        }

        $pertanyaan->rating    = $request->rating != '' ? $request->rating : null;
        $pertanyaan->status    = 'closed';
        $pertanyaan->closed_by = auth()->user()->id;
        $pertanyaan->is_review = $request->rating ? 'yes' : 'no';
        $pertanyaan->testimoni = $request->testimoni != '' ? $request->testimoni : null;
        $pertanyaan->save();

        PertanyaanPelangganPesan::where('pertanyaan_id', $pertanyaan->id)
            ->update(['is_replied' => 'yes']);

        return responseJSON('Data pesan berhasil disimpan.', [
            'id'        => $pertanyaan->id,
            'rating'    => $pertanyaan->rating,
            'testimoni' => $pertanyaan->testimoni,
            'is_review' => $pertanyaan->is_review,
            'status'    => $pertanyaan->status,
            'closed_by' => $pertanyaan->user_closed->name,
        ], 201);
    }

    public function giveReviewPertanyaan(PertanyaanPelanggan $pertanyaan, Request $request)
    {
        if (!$this->isWhatsappVerified($request->user())) {
            return responseJSON("Anda belum memverifikasi nomor WA anda, silahkan update telebih dahulu di pengaturan 'Profile'.", [], 404);
        }

        $input = $request->validate([
            'rating'    => 'in:1,2,3,4,5|required',
            'testimoni' => 'string|nullable',
        ]);

        if ($pertanyaan->is_review === 'yes' && $pertanyaan->status === 'closed') {
            return responseJSON("Anda sudah memberikan review dan rating layanan untuk pertanyaan ini.", [], 404);
        }

        if ($input['rating'] < 5 && str_word_count(trim($input['testimoni'])) < 5) {
            return responseJSON("Testimoni harus diisi minimal 5 kata", [], 404);
        }

        $pertanyaan->rating    = $request->rating != '' ? $request->rating : null;
        $pertanyaan->is_review = 'yes';
        $pertanyaan->testimoni = $request->testimoni != '' ? $request->testimoni : null;
        $pertanyaan->save();

        return responseJSON('Data pesan berhasil disimpan.', [
            'id'        => $pertanyaan->id,
            'rating'    => $pertanyaan->rating,
            'testimoni' => $pertanyaan->testimoni,
            'is_review' => $pertanyaan->is_review,
        ], 201);
    }

    private function notif_admin(array $notifParameter)
    {
        $user_admin = SysUserGroup::query()->with(['sys_user'])->where('group_id', '=', SysGroup::ROOT)->get();
        foreach ($user_admin as $usr) {
            $libNotif = new Notification($usr->sys_user->id, $notifParameter['judul'], $notifParameter['pesan_notif'], $notifParameter['url_notif']);
            $libNotif->sendInBackground();

            $libMailer = new Mailer();
            $libMailer->subject($notifParameter['judul'])
                ->to($usr->sys_user->email)
                ->body($notifParameter['pesan_email'])
                ->sendInBackground();

            if (!empty($usr->sys_user->pegawai->whatsapp)) {
                WhatsappService::sendMessage($usr->sys_user->pegawai->whatsapp, $notifParameter['pesan_wa'])->sendInBackground();
            }
        }
    }
}
