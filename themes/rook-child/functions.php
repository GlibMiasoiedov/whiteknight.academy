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

/**
 * Login Button Fallback Fix
 * If the Tutor LMS login modal is missing, redirect to dashboard login
 */
add_action('wp_footer', function () {
    // Run on all pages where Tutor login might be needed, not just checkout
    ?>
    <script>
        document.addEventListener('DOMContentLoaded', function () {
            document.body.addEventListener('click', function (e) {
                var target = e.target;
                // Walk up to find button
                while (target && target !== document.body) {
                    if (target.classList.contains('tutor-open-login-modal') ||
                        target.innerText.trim().toLowerCase() === 'login') {

                        // Check if modal exists
                        var modal = document.querySelector('.tutor-login-modal, #tutor-login-modal');

                        // If modal is missing or hidden/broken
                        if (!modal || modal.innerHTML.trim() === '') {
                            console.log('[WK-LOGIN-FIX] Modal missing. Redirecting to login page.');
                            e.preventDefault();
                            e.stopImmediatePropagation();

                            // Construct redirect URL
                            var currentUrl = encodeURIComponent(window.location.href);
                            var loginUrl = '/dashboard/?redirect_to=' + currentUrl;

                            // Check if button has a specific URL
                            if (target.dataset.loginUrl && target.dataset.loginUrl.length > 1) {
                                loginUrl = target.dataset.loginUrl;
                            }

                            window.location.href = loginUrl;
                            return false;
                        }
                    }
                    target = target.parentElement;
                }
            }, true); // Capture phase to run before Tutor events
        });
    </script>
    <?php
});

/**
 * Redirect after Registration (Student & Instructor)
 * Redirects to /check-your-email/ instead of staying on the form
 */
add_action('user_register', function ($user_id) {
    // Ensure we only redirect during frontend registration submissions
    if (empty($_POST['tutor_action'])) {
        return;
    }

    $action = $_POST['tutor_action'];

    // Check for Student or Instructor registration actions
    if ($action === 'tutor_register_student' || $action === 'tutor_register_instructor') {
        wp_safe_redirect(home_url('/check-your-email/'));
        exit;
    }
}, 999);


