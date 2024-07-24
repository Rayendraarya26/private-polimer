<?php

namespace Modules\Home\Http\Controllers;

use App\Classes\Breadcrumbs;
use App\Libraries\Mailer;
use App\Libraries\Notification;
use App\Models\Db1\SysUserFbtoken;
use App\Models\Db1\SysUserNotif;
use Illuminate\Http\Request;

class NotificationController
{
    private string $module = __CLASS__;
    private string $url = 'home/notification';
    private string $view = 'home::notification';

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
            new Breadcrumbs('Home', route('home')),
            new Breadcrumbs('Notification')
        ];

        $notif = SysUserNotif::where("user_id", auth()->id())->orderBy('is_read', 'desc')->orderBy('created_at', 'desc')->paginate(20);
        $total = SysUserNotif::where("user_id", auth()->id())->where("is_read", 'no')->selectRaw("count(*) total")->first();

        $parser = array_merge($this->defaultParser(), ['breadcrumbs' => $breadcrumbs, 'notif' => $notif, 'total' => $total->total ?? 0]);
        return view("$this->view.index")->with($parser);
    }

    public function open($id)
    {
        $dataNotif = SysUserNotif::where('user_id', auth()->id())->findOrFail($id);
        if ($dataNotif) {
            $dataNotif->is_read    = "yes";
            $dataNotif->updated_at = now();
            $dataNotif->save();

            return redirect(url($dataNotif->link));
        } else {
            abort(404);
        }
    }

    public function markAllAsRead()
    {
        SysUserNotif::where('user_id', auth()->id())->update(['is_read' => 'yes']);
        return redirect()->back();
    }

    public function ajaxSyncToken(Request $request)
    {
        SysUserFbtoken::firstOrCreate(
            ['token' => $request['token'], 'user_id' => auth()->id()],
            ['agent' => $request->header('User-agent'), 'ip' => $request->getClientIp()]
        );

        return responseJSON("sinkronisasi berhasil");
    }

    public function tes()
    {
        $libNotif = new Notification(auth()->id(), "Ini judul", 'ini pesan', url('/'));
        $libNotif->send();

        $libMailer = new Mailer();
        $libMailer->subject('Test Mailer')
            ->to(auth()->user()->email)
            ->body('Test Mailer')
            ->sendInBackground();
    }
}
