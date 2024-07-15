<!--begin::sidebar menu-->
<div class="app-sidebar-menu overflow-hidden flex-column-fluid">
    <!--begin::Menu wrapper-->
    <div id="kt_app_sidebar_menu_wrapper" class="app-sidebar-wrapper">
        <!--begin::Scroll wrapper-->
        <div
            id="kt_app_sidebar_menu_scroll"
            class="scroll-y my-5 mx-3"
            data-kt-scroll="true"
            data-kt-scroll-activate="true"
            data-kt-scroll-height="auto"
            data-kt-scroll-dependencies="#kt_app_sidebar_logo, #kt_app_sidebar_footer"
            data-kt-scroll-wrappers="#kt_app_sidebar_menu"
            data-kt-scroll-offset="5px"
            data-kt-scroll-save-state="true"
        >
            <!--begin::Menu-->
            <div
                class="menu menu-column menu-rounded menu-sub-indention fw-semibold fs-6"
                id="#kt_app_sidebar_menu"
                data-kt-menu="true"
                data-kt-menu-expand="false"
            >


                <!--begin:Menu item-->
                <div class="menu-item">
                    <!--begin:Menu link-->
                    <a class="menu-link {{ url()->current() == route('home') ? 'active' : '' }}" href="{{ route('home') }}">
                        <span class="menu-icon">
                            <i class="fa-duotone fa-house-chimney fs-2"></i>
                        </span>
                        <span class="menu-title">Home</span>
                    </a>
                    <!--end:Menu link-->
                </div>
                <!--end:Menu item-->


                @foreach(session('menu') as $menu)
                    @if(count($menu->children) > 0)
                        <div data-kt-menu-trigger="click"
                             class="menu-item {{ isSubmenuOpen($menu, url()->current()) ? 'here show' : '' }} menu-accordion">
                            <!--begin:Menu link-->
                            <span class="menu-link">
                                <span class="menu-icon">
                                    <i class="{{ $menu->icon }} fs-2"></i>
                                </span>
                                <span class="menu-title">{{ $menu->name }}</span>
                                <span class="menu-arrow"></span>
                            </span>

                            <div class="menu-sub menu-sub-accordion">
                                @include('layouts.component.renderMenu', ['children' => $menu->children])
                            </div>
                        </div>
                    @else
                        <div class="menu-item">
                            <!--begin:Menu link-->
                            <a href="{{ action($menu->controller) }}"
                               class="menu-link {{ isSubmenuOpen($menu, url()->current()) ? 'active' : ''}}">
                                <span class="menu-icon">
                                    <i class="{{ $menu->icon }} fs-2"></i>
                                </span>
                                <span class="menu-title">{{ $menu->name }}</span>
                            </a>
                            <!--end:Menu link-->
                        </div>
                    @endif
                @endforeach
            </div>
        </div>
    </div>
    <!--end::Menu wrapper-->
</div>
<!--end::sidebar menu-->
