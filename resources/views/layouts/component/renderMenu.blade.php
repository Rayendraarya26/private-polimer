@foreach($children as $menu)
    @if(count($menu->children) > 0)
        <div class="menu-item {{ isSubmenuOpen($menu, url()->current()) ? 'here show' : '' }} menu-accordion"
            data-kt-menu-trigger="click">
            <!--begin:Menu link-->
            <span class="menu-link">
                <span class="menu-icon">
                    <i class="{{ $menu->icon }} fs-4"></i>
                </span>
                <span class="menu-title">{{ $menu->name }}</span>
                <span class="menu-arrow"></span>
            </span>


            <div class="menu-sub menu-sub-accordion">
                @include('layouts.component.renderMenu',['children' => $menu->children])
            </div>
        </div>
    @else
        <div class="menu-item">
            <!--begin:Menu link-->
            <a href="{{ action($menu->controller) }}"
               class="menu-link {{ isSubmenuOpen($menu, url()->current()) ? 'active' : ''}}">
                <span class="menu-icon">
                    <i class="{{ $menu->icon }} fs-4"></i>
                </span>
                <span class="menu-title">{{ $menu->name }}</span>
            </a>
            <!--end:Menu link-->
        </div>
    @endif
@endforeach
