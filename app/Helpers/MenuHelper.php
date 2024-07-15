<?php

use Illuminate\Support\Str;

if (!function_exists('isSubmenuOpen')) {
    function isSubmenuOpen($objMenu, $url): bool
    {
        if (count($objMenu->children) == 0 && $objMenu->controller != '#') {
            $menuUrl = action($objMenu->controller);
            if (($menuUrl == $url || Str::startsWith($url, $menuUrl))) {
                return true;
            }
        }

        foreach ($objMenu->children as $objChild) {
            if (isSubmenuOpen($objChild, $url)) {
                return true;
            }
        }

        return false;
    }
}
