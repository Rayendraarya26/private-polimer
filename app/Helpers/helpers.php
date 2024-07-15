<?php

$files = glob(__DIR__.'/*.php');

foreach ($files as $file) {
    if (basename($file) !== 'helpers.php') {
        require_once $file;
    }
}
