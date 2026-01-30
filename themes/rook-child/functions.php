<?php
/**
 * Child-Theme functions and definitions
 */

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
