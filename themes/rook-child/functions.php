<?php
/**
 * Child-Theme functions and definitions
 */

/**
 * FIX: wp.i18n polyfill with debug logging for Tutor LMS
 * This creates wp.i18n early in wp_head before any other scripts run
 */
add_action('wp_head', function () {
    ?>
    <script>
        (function () {
            console.log('[WK Debug] wp.i18n polyfill starting...');
            console.log('[WK Debug] Current window.wp:', typeof window.wp, window.wp);
            console.log('[WK Debug] Current window.wp.i18n:', typeof window.wp?.i18n, window.wp?.i18n);

            // Ensure wp object exists
            window.wp = window.wp || {};

            // Check if i18n already exists and is valid
            if (window.wp.i18n && typeof window.wp.i18n.__ === 'function') {
                console.log('[WK Debug] wp.i18n already exists and is valid, skipping polyfill');
                return;
            }

            console.log('[WK Debug] Creating wp.i18n polyfill...');

            // Create polyfill
            window.wp.i18n = {
                __: function (text, domain) {
                    return text;
                },
                _x: function (text, context, domain) {
                    return text;
                },
                _n: function (single, plural, number, domain) {
                    return number === 1 ? single : plural;
                },
                _nx: function (single, plural, number, context, domain) {
                    return number === 1 ? single : plural;
                },
                isRTL: function () {
                    return false;
                },
                sprintf: function () {
                    var args = Array.prototype.slice.call(arguments);
                    var format = args.shift();
                    return format.replace(/%s/g, function () {
                        return args.shift() || '';
                    });
                },
                setLocaleData: function () { },
                getLocaleData: function () { return {}; },
                hasTranslation: function () { return false; }
            };

            console.log('[WK Debug] wp.i18n polyfill created successfully');
            console.log('[WK Debug] Verification - wp.i18n.__:', typeof window.wp.i18n.__);
        })();
    </script>
    <?php
}, 1); // Priority 1 = run very early in wp_head

// Also try to enqueue the real wp-i18n script
add_action('wp_enqueue_scripts', function () {
    wp_enqueue_script('wp-i18n');
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
