<?php
/**
 * Child-Theme functions and definitions
 */

/**
 * FIX: wp.i18n polyfill with watchdog protection
 * This creates wp.i18n AND prevents it from being overwritten
 */
add_action('wp_head', function () {
    ?>
    <script>
    (function() {
        // Create the polyfill functions
        var i18nPolyfill = {
            __: function(text) { return text; },
            _x: function(text) { return text; },
            _n: function(s, p, n) { return n === 1 ? s : p; },
            _nx: function(s, p, n) { return n === 1 ? s : p; },
            sprintf: function() {
                var args = [].slice.call(arguments);
                var fmt = args.shift() || '';
                return fmt.replace(/%[sd]/g, function() { return args.shift() || ''; });
            },
            setLocaleData: function() {},
            getLocaleData: function() { return {}; },
            hasTranslation: function() { return false; },
            isRTL: function() { return false; }
        };

        // Setup wp object with protected i18n
        window.wp = window.wp || {};
        
        // Use Object.defineProperty to make i18n non-writable
        Object.defineProperty(window.wp, 'i18n', {
            value: i18nPolyfill,
            writable: false,
            configurable: true // Allow reconfiguration if needed
        });
        
        console.log('[WK] wp.i18n polyfill installed with protection');
    })();
    </script>
    <?php
}, 0);

// CRITICAL: Dequeue the real wp-i18n script to prevent it from overwriting our polyfill
add_action('wp_enqueue_scripts', function () {
    wp_dequeue_script('wp-i18n');
    wp_deregister_script('wp-i18n');
}, 999); // Very late priority to catch all enqueues

add_action('wp_footer', function () {
    wp_dequeue_script('wp-i18n');
}, 1);

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
