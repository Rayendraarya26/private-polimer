<ul class="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0 ">
    @foreach($breadcrumbs as $b)
        @if($loop->last)
            <li class="breadcrumb-item text-muted">{{$b->title}}</li>
        @else
            <li class="breadcrumb-item"><a href="{{$b->link}}" class="text-muted text-hover-primary">{{$b->title}}</a></li>
            <li class="breadcrumb-item">
                <span class="bullet bg-gray-500 w-5px h-2px"></span>
            </li>
        @endif
    @endforeach
</ul>
