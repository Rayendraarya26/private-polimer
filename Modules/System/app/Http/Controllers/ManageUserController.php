<?php

namespace Modules\System\Http\Controllers;

use App\Classes\Breadcrumbs;
use App\Models\Db1\SysGroup;
use App\Models\Db1\SysUser;
use App\Models\Db1\SysUserGroup;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\ImageManager;
use Yajra\DataTables\Facades\DataTables;

class ManageUserController
{
    public string $module = __CLASS__;
    private string $url = 'system/user';
    private string $view = 'system::user';

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
            new Breadcrumbs('System'),
            new Breadcrumbs('Manage Users', url($this->url))
        ];

        $parse = ['url' => $this->url, 'module' => $this->module, 'breadcrumbs' => $breadcrumbs];
        return view("$this->view.index")->with($parse);
    }

    public function create()
    {
        $breadcrumbs = [
            new Breadcrumbs('System'),
            new Breadcrumbs('Manage Users', url($this->url)),
            new Breadcrumbs('Add')
        ];

        $groups = SysGroup::query()->where('id', '!=', \App\Enums\SysGroup::PELANGGAN->value)->orderBy('id')->get();
        $parse  = array_merge($this->defaultParser(), [
            'breadcrumbs'       => $breadcrumbs,
            'data'              => null,
            'groups'            => $groups,
            'default_group'     => null,
            'selected_group_id' => []

        ]);

        return view("$this->view.upsert")->with($parse);
    }

    public function edit($id)
    {
        $breadcrumbs     = [
            new Breadcrumbs('System'),
            new Breadcrumbs('Manage Users', url($this->url)),
            new Breadcrumbs('Update')
        ];
        $data            = SysUser::findOrFail($id);
        $groups          = SysGroup::query()->where('id', '!=', \App\Enums\SysGroup::PELANGGAN->value)->orderBy('id')->get();
        $defaultGroup    = $data->sys_user_groups()->where("is_default", "yes")->first()?->group_id;
        $selectedGroupId = $data->sys_user_groups()->pluck('group_id')->toArray();

        $parse = array_merge($this->defaultParser(), [
            'breadcrumbs'       => $breadcrumbs,
            'data'              => $data,
            'groups'            => $groups,
            'default_group'     => $defaultGroup,
            'selected_group_id' => $selectedGroupId,
        ]);

        return view("$this->view.upsert")->with($parse);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name'          => 'required|string',
            'email'         => 'required|email|unique:App\Models\Db1\SysUser,email',
            'password'      => 'required|min:4|confirmed',
            'foto'          => 'sometimes|max:500|mimes:jpeg,jpg,png',
            'group'         => 'required',
            'group_default' => 'required',
        ]);

        try {
            $user = $this->upsert($request, $request->all(), new SysUser());
            return redirect("$this->url")->with('message', sprintf("%s berhasil ditambahkan", $user->name));
        } catch (Exception $e) {
            return redirect()->back()->withInput($request->all())->withErrors($e->getMessage());
        }
    }

    public function update(Request $request, $id)
    {
        $input = $request->validate([
            'name'          => 'required|string|min:4',
            'email'         => 'required|email',
            'password'      => 'sometimes|confirmed',
            'foto'          => 'sometimes|max:2048|mimes:jpeg,jpg,png',
            'group'         => 'required',
            'group_default' => 'required',
        ]);

        try {
            $user = $this->upsert($request, $input, SysUser::findOrFail($id));
            return redirect("$this->url")->with('message', sprintf("%s berhasil diperbarui", $user->name));
        } catch (Exception $e) {
            return redirect()->back()->withInput($request->all())->withErrors($e->getMessage());
        }
    }

    /**
     * @throws Exception
     */
    private function upsert(Request $request, array $input, SysUser $user): SysUser
    {
        // check is email already used
        if ($user->email !== $input['email']) {
            $newEmail = SysUser::where("email", $input['email'])->where('email', '<>', $user->email)->first();
            if (!empty($newEmail)) {
                throw new Exception("Email telah digunakan");
            }
        }

        DB::transaction(function () use ($request, $input, $user) {
            $user->name  = $input['name'];
            $user->email = $input['email'];
            if (!empty($input['password'])) $user->password = bcrypt($input['password']);
            $user->save();

            $isPegawai = true;

            // Delete User Group
            SysUserGroup::where("user_id", $user->id)->delete();
            // Reinsert User Group
            foreach ($input['group'] as $group) {
                SysUserGroup::create([
                    'user_id'    => $user->id,
                    'group_id'   => $group,
                    'is_default' => $input['group_default'] == $group ? 'yes' : 'no'
                ]);

                if ($group == \App\Enums\SysGroup::PELANGGAN->value) {
                    $isPegawai = false;
                }
            }
            $user->save();

            // Upload Image
            if ($request->hasFile("foto")) {
                $image     = $request->file('foto');
                $imageName = sprintf("avatars/%s.%s", $user->id, $image->getClientOriginalExtension());
                $img       = ImageManager::imagick()->read($request->file('foto')->getRealPath());
                $img->scale(300)
                    ->save(Storage::disk('public')->path($imageName), 80);

                // move to aws s3 from public\
                Storage::disk('s3')->put($imageName, Storage::disk('public')->get($imageName));
                Storage::disk('public')->delete($imageName);

                $user->picture = $imageName;
                $user->save();
            }

            if ($isPegawai) {
                $user->pegawai()->updateOrCreate([
                    'user_id' => $user->id
                ]);
            }
        });


        return $user;
    }

    public function destroy($id)
    {
        $data = SysUser::findOrFail($id);
        $data->delete();

        return responseJSON("Data berhasil dihapus");
    }

    /**
     * @throws Exception
     */
    public function ajaxDatatable(Request $request): JsonResponse
    {
        $data = SysUser::with('sys_user_groups.sys_group');

        return Datatables::eloquent($data)
            ->editColumn('picture', function ($data) {
                return $data->picture_url;
            })
            ->addColumn('group_name', function ($item) {
                return $item->sys_user_groups->map(function ($group) {
                    return $group->sys_group->name;
                })->implode(", ");
            })
            ->addIndexColumn()
            ->filterColumn('name', function ($query, $keyword) {
                $query->orWhereRaw("LOWER(name) like ?", ["%{$keyword}%"])
                    ->orWhereRaw("LOWER(email) like ?", ["%{$keyword}%"]);
            })
            ->make();
    }

    public function ajaxBanned(Request $request)
    {
        $request->validate([
            'ids'    => 'required|array',
            'status' => 'required|in:yes,no'
        ]);
        foreach ($request->ids as $id) {
            $data            = SysUser::findOrFail($id);
            $data->is_banned = $request->status;
            $data->banned_at = $request->status == 'yes' ? date("Y-m-d H:i:s") : null;
            $data->save();
        }

        $message = $request->status == 'yes' ? 'Berhasil memblokir user.' : 'Berhasil membuka blokir user.';

        return responseJSON($message);
    }
}
