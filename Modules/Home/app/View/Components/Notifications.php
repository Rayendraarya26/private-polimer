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
        $notifs = SysUserNotif::where('user_id', auth()->id())
            ->latest()
            ->take(10)
            ->get();
        return view('home::components.notifications')->with([
            'navNotif' => $notifs,
            'navTotal' => $notifs->where('is_read', 'no')->count(),
        ]);
    }
}
