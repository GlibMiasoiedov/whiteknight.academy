<?php
/**
 * Plugin Name: Defer selected scripts
 * Description: Adds defer attribute to selected JavaScript files for better page load performance
 * Version: 1.0.0
 * Author: White Knight Academy
 */

add_filter('script_loader_tag', function ($tag, $handle, $src) {

    // Додаємо defer тільки для конкретних хендлів
    // elementor-common вимкнено - ламає Elementor редактор
    $defer_handles = [
        'elementor-pro-frontend',
    ];

    if (in_array($handle, $defer_handles, true)) {
        // якщо вже є defer/async — не дублюємо
        if (strpos($tag, ' defer') === false && strpos($tag, ' async') === false) {
            $tag = str_replace(' src=', ' defer src=', $tag);
        }
    }

    return $tag;
}, 10, 3);

/**
 * Preconnect to third-party domains for faster resource loading
 */
add_action('wp_head', function () {
    echo "\n<link rel='preconnect' href='https://www.googletagmanager.com' crossorigin>";
    echo "\n<link rel='preconnect' href='https://www.google-analytics.com' crossorigin>";
    echo "\n<link rel='preconnect' href='https://www.gstatic.com' crossorigin>";
    echo "\n<link rel='preconnect' href='https://cdn-cookieyes.com' crossorigin>\n";
}, 1);
