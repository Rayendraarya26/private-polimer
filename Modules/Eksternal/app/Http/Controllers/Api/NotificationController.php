<?php

namespace Modules\Eksternal\Http\Controllers\Api;

use App\Enums\Option;
use App\Models\Db1\SysUserNotif;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $row = min($request->get('row', 10), 50);

        $notification = SysUserNotif::where('user_id', auth()->user()->id)
            ->orderByDesc('created_at')
            ->paginate($row);

        $total = SysUserNotif::where('user_id', auth()->user()->id)
            ->count();

        $unread = SysUserNotif::where('user_id', auth()->user()->id)
            ->where('is_read', '=', Option::NO)
            ->count();

        return responseJSON("Success", [
            'data'   => $notification->map(function ($item) {
                return [
                    'title'         => $item->title,
                    'content'       => $item->content,
                    'is_read'       => $item->is_read,
                    'created_at'    => $item->created_at,
                    'link'          => url("notifications/open/{$item->id}"),
                ];
            }),
            'unread' => $unread,
            'total'  => $total,
        ]);
    }

    public function markAllAsRead()
    {
        SysUserNotif::where('user_id', auth()->id())->update(['is_read' => 'yes']);

        return responseJSON("Success");
    }
}
