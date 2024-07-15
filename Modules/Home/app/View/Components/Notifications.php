<?php

namespace Modules\Home\View\Components;

use App\Models\Db1\SysUserNotif;
use Illuminate\View\Component;
use Illuminate\View\View;

class Notifications extends Component
{
    /**
     * Create a new component instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Get the view/contents that represent the component.
     */
    public function render(): View|string
    {
        $notif = SysUserNotif::where("user_id", auth()->id())->orderBy('is_read', 'desc')->orderBy('created_at', 'desc')->take(10)->get();
        $total = SysUserNotif::where("user_id", auth()->id())->where("is_read", 'no')->selectRaw("count(*) total")->first();

        $data = [
            'notif' => $notif,
            'total' => $total->total ?? 0
        ];
        return view('home::components.notifications')->with($data);
    }
}
