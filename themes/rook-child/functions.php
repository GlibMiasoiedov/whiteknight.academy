<?php
/**
 * Child-Theme functions and definitions
 */

/**
 * Redirect Tutor LMS plain URLs to pretty permalinks
 */
add_action('init', function () {
    if (!isset($_GET['post_type']) || $_GET['post_type'] !== 'page' || !isset($_GET['p'])) {
        return;
    }

    $page_id = (int) $_GET['p'];

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

    $permalink = get_permalink($page_id);
    if (!$permalink) {
        return;
    }

    $params = [];
    foreach ($_GET as $key => $value) {
        if (in_array($key, ['post_type', 'p', 'page_id'], true)) {
            continue;
        }
        $params[$key] = $value;
    }

    $redirect_url = $permalink;
    if (!empty($params)) {
        $redirect_url = add_query_arg($params, $permalink);
    }

    wp_safe_redirect($redirect_url, 302);
    exit;
}, 1);

/**
 * Login Button Fallback Fix
 */
add_action('wp_footer', function () {
    ?>
    <script>
        document.addEventListener('DOMContentLoaded', function () {
            document.body.addEventListener('click', function (e) {
                var target = e.target;
                while (target && target !== document.body) {
                    if (target.classList.contains('tutor-open-login-modal') ||
                        target.innerText.trim().toLowerCase() === 'login') {
                        var modal = document.querySelector('.tutor-login-modal, #tutor-login-modal');
                        if (!modal || modal.innerHTML.trim() === '') {
                            e.preventDefault();
                            e.stopImmediatePropagation();
                            var currentUrl = encodeURIComponent(window.location.href);
                            var loginUrl = '/dashboard/?redirect_to=' + currentUrl;
                            if (target.dataset.loginUrl && target.dataset.loginUrl.length > 1) {
                                loginUrl = target.dataset.loginUrl;
                            }
                            window.location.href = loginUrl;
                            return false;
                        }
                    }
                    target = target.parentElement;
                }
            }, true);
        });
    </script>
    <?php
});

/**
 * Redirect after Registration
 */
add_action('user_register', function ($user_id) {
    if (empty($_POST['tutor_action'])) {
        return;
    }
    $action = $_POST['tutor_action'];
    if ($action === 'tutor_register_student' || $action === 'tutor_register_instructor') {
        wp_safe_redirect(home_url('/check-your-email/'));
        exit;
    }
}, 999);

/**
 * Mastodon Verification
 */
add_action('wp_head', function () {
    echo '<link rel="me" href="https://mastodon.social/@whiteknightacademy" />';
});

/**
 * Font Loading Optimization
 */
add_action('wp_head', function () {
    $fonts = [
        '/wp-content/plugins/tutor/assets/fonts/tutor.woff',
        '/wp-content/plugins/tutor/assets/fonts/tutor-v2.woff',
    ];

    foreach ($fonts as $font) {
        echo '<link rel="preload" href="' . esc_url(home_url($font)) . '" as="font" type="font/woff" crossorigin>' . "\n";
    }
    ?>
    <style id="wk-font-display-fix">
        @font-face {
            font-family: tutor;
            src: url(/wp-content/plugins/tutor/assets/fonts/tutor.woff) format("woff");
            font-weight: 400;
            font-style: normal;
            font-display: swap;
        }
        @font-face {
            font-family: tutor;
            src: url(/wp-content/plugins/tutor/assets/fonts/tutor-v2.woff) format("woff");
            font-weight: 400;
            font-style: normal;
            font-display: swap;
        }
    </style>
    <?php
}, 1);
/**
 * Preload Hero Image for LCP optimization
 */
add_action('wp_head', function () {
    // Only on homepage
    if (!is_front_page()) {
        return;
    }
    ?>
    <link rel="preload" 
          href="<?php echo esc_url(home_url('/wp-content/uploads/2026/02/Ponomariov_Team_2.webp')); ?>" 
          as="image" 
          type="image/webp"
          fetchpriority="high">
    <?php
}, 1);