<?php

if (!function_exists('authorized')) {
    function authorized($controller): bool
    {
        $availController = session('permission');
        return in_array($controller, $availController);
    }
}
