<?php

namespace Modules\Eksternal\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Laravel\Passport\Passport;

class UserController extends Controller
{
    public function user(Request $request)
    {
        // selected Group
        $groupData = $request->user()->sys_user_groups->where('is_default', 'yes')->first();

        return responseJSON("success", [
            'id'                    => $request->user()->id,
            'name'                  => $request->user()->name,
            'email'                 => $request->user()->email,
            'force_update_password' => $request->user()->force_update_password,
            'picture'               => Storage::disk('public')->url($request->user()->picture),
            'last_login'            => $request->user()->last_login,
            'group'                 => [
                'id'   => $groupData->group_id,
                'name' => $groupData->sys_group->name,
            ],
        ]);
    }
}
