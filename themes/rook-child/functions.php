<?php
/**
 * Child-Theme functions and definitions
 */

/**
 * Simple wp.i18n polyfill - does NOT deregister wp-i18n to avoid WooCommerce crash
 */
add_action('wp_head', function () {
    echo '<script>
(function(){
    window.wp = window.wp || {};
    window.wp.i18n = window.wp.i18n || {};
    var p = {__:function(t){return t;},_x:function(t){return t;},_n:function(s,p,n){return n===1?s:p;},_nx:function(s,p,n){return n===1?s:p;},sprintf:function(){var a=[].slice.call(arguments);var f=a.shift()||"";return f.replace(/%[sd]/g,function(){return a.shift()||"";});},setLocaleData:function(){},getLocaleData:function(){return {};},hasTranslation:function(){return false;},isRTL:function(){return false;}};
    for(var k in p){if(!window.wp.i18n[k])window.wp.i18n[k]=p[k];}
})();
</script>';
}, 1);

/**
 * Redirect Tutor LMS plain URLs to pretty permalinks
 * Preserves ALL query parameters (plan, course_id, etc.)
 * Runs early to avoid 404 from security plugins/WAF
 */
add_action('init', function () {
    // Only handle plain URL format
    if (!isset($_GET['post_type']) || $_GET['post_type'] !== 'page' || !isset($_GET['p'])) {
        return;
    }

    $page_id = (int) $_GET['p'];

    // Only redirect Tutor LMS system pages
    $tutor_pages = [
        4985, // Checkout
        4984, // Cart
        4979, // Dashboard
        4980, // Student Registration
        4981, // Instructor Registration
        6270, // Certificate
        8222, // Membership Pricing
    ];

    if (!in_array($page_id, $tutor_pages, true)) {
        return;
    }

    // Get the permalink
    $permalink = get_permalink($page_id);
    if (!$permalink) {
        return;
    }

    // Collect ALL query params except the ones we're replacing
    $params = [];
    foreach ($_GET as $key => $value) {
        if (in_array($key, ['post_type', 'p', 'page_id'], true)) {
            continue;
        }
        // Preserve the exact value
        $params[$key] = $value;
    }

    // Build redirect URL with all params
    $redirect_url = $permalink;
    if (!empty($params)) {
        $redirect_url = add_query_arg($params, $permalink);
    }

    // Redirect with 302 to preserve params in browser
    wp_safe_redirect($redirect_url, 302);
    exit;
}, 1);

