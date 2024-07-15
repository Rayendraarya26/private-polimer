@if(count(session('group_available')) > 1)
    <div class="menu-item px-5 my-1">
        <a href="#" class="menu-link px-5" data-bs-target="#modalSwitchRole" data-bs-toggle="modal">
            Switch Role
        </a>
    </div>

    @push('modals')
        <div class="modal fade"
             id="modalSwitchRole"
             tabindex="-1"
             aria-labelledby="modalSwitchRole"
             aria-hidden="true">
            <div class="modal-dialog modal-sm modal-dialog-centered">
                <div class="modal-content">
                    <form action="{{route('switch_role')}}" method="post">
                        @csrf
                        <div class="modal-header d-flex align-items-center">
                            <h4 class="modal-title" id="myLargeModalLabel">
                                Switch Role
                            </h4>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="d-flex flex-column gap-4">
                                @foreach(session('group_available') as $group)
                                    <div class="form-check">
                                        <input class="form-check-input success check-outline outline-success"
                                               type="radio" name="group_id" id="selectRole{{$group['group_id']}}"
                                               aria-label="selectRole{{$group['group_id']}}"
                                               value="{{$group['group_id']}}"
                                            {{$group['group_id'] == session('group_selected') ? 'checked' : ''}}>
                                        <label class="form-check-label" for="selectRole{{$group['group_id']}}">
                                            {{ucwords($group['group_name'])}}
                                        </label>
                                    </div>
                                @endforeach
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="submit"
                                    class="btn btn-light-primary font-medium waves-effect text-start">
                                Switch
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    @endpush
@endif
