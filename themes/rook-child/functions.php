<?php
/**
 * Child-Theme functions and definitions
 */

/**
 * FIX: Register a FAKE wp-i18n script that provides polyfill
 * This ensures wp.i18n is available BEFORE any scripts that depend on it
 */
add_action('init', function () {
    // First, deregister the real wp-i18n if it exists
    wp_deregister_script('wp-i18n');

    // Register our fake wp-i18n with inline polyfill
    wp_register_script('wp-i18n', false, array(), false, false);

    // Add inline script that creates the polyfill
    wp_add_inline_script('wp-i18n', '
        (function() {
            window.wp = window.wp || {};
            if (window.wp.i18n && typeof window.wp.i18n.__ === "function") return;
            window.wp.i18n = {
                __: function(t) { return t; },
                _x: function(t) { return t; },
                _n: function(s, p, n) { return n === 1 ? s : p; },
                _nx: function(s, p, n) { return n === 1 ? s : p; },
                sprintf: function() {
                    var a = [].slice.call(arguments);
                    var f = a.shift() || "";
                    return f.replace(/%[sd]/g, function() { return a.shift() || ""; });
                },
                setLocaleData: function() {},
                getLocaleData: function() { return {}; },
                hasTranslation: function() { return false; },
                isRTL: function() { return false; }
            };
            console.log("[WK] wp.i18n polyfill loaded via fake wp-i18n script");
        })();
    ', 'before');
}, 1); // Priority 1 = very early in init

/**
 * Redirect Tutor "plain" URLs (/?post_type=page&p=ID або ?page_id=ID)
 * на нормальні пермалінки Tutor-сторінок + зберегти query args (order_id, plan, course_id, ...)
 */
add_action('template_redirect', function () {
    if (is_admin())
        return;

    // Усі сервісні сторінки Tutor LMS з твого списку
    $tutor_page_ids = [7699, 4979, 4981, 4980, 4984, 4985, 4438, 6270];

    $pid = null;

    // Варіант 1: ?post_type=page&p=XXXX
    if (isset($_GET['post_type'], $_GET['p']) && $_GET['post_type'] === 'page') {
        $pid = (int) $_GET['p'];
    }

    // Варіант 2: ?page_id=XXXX
    if ($pid === null && isset($_GET['page_id'])) {
        $pid = (int) $_GET['page_id'];
    }

    if (!$pid || !in_array($pid, $tutor_page_ids, true)) {
        return;
    }

    // Куди редіректимо — на реальний permalink цієї сторінки
    $target = get_permalink($pid);
    if (!$target) {
        return; // якщо раптом сторінка не існує
    }

    // Переносимо ВСІ query params, крім службових, що визначали "plain url"
    $args = [];
    foreach ($_GET as $k => $v) {
        if (in_array($k, ['post_type', 'p', 'page_id'], true))
            continue;
        if ($v === '' || $v === null)
            continue;

        // якщо раптом прилетів масив — беремо перше значення
        if (is_array($v))
            $v = reset($v);

        $args[sanitize_key($k)] = sanitize_text_field(wp_unslash($v));
    }

    $redirect_url = !empty($args) ? add_query_arg($args, $target) : $target;

    wp_safe_redirect($redirect_url, 302);
    exit;
}, 1);
