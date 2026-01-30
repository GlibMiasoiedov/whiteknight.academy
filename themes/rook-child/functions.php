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
 * Subscription Buy Now Button Fix
 * Intercept ONLY the subscription Buy Now button and pass correct plan ID
 */
add_action('wp_footer', function () {
    // Only on course pages
    if (!function_exists('tutor_utils') || !is_singular('courses')) {
        return;
    }

    global $wpdb, $post;
    $course_id = $post->ID;

    // Get subscription plans for this course
    $plans = $wpdb->get_results($wpdb->prepare("
        SELECT sp.id, sp.plan_name, sp.regular_price, sp.recurring_interval
        FROM {$wpdb->prefix}tutor_subscription_plans sp
        INNER JOIN {$wpdb->prefix}tutor_subscription_plan_items spi ON sp.id = spi.plan_id
        WHERE spi.object_id = %d AND sp.is_enabled = 1
        ORDER BY sp.plan_order ASC
    ", $course_id));

    if (empty($plans)) {
        return; // No subscription plans for this course
    }

    $plans_json = json_encode(array_map(function ($p) {
        return [
            'id' => (int) $p->id,
            'name' => $p->plan_name,
            'price' => (float) $p->regular_price,
        ];
    }, $plans));
    ?>
    <script>
        (function () {
            var courseId = <?php echo (int) $course_id; ?>;
            var plans = <?php echo $plans_json; ?>;
            var checkoutUrl = '/course-checkout/';

            console.log('[WK Subscription Fix] Course:', courseId, 'Plans:', plans);

            function getSelectedPlanId() {
                // Method 1: Look for checked radio button with plan value
                var radios = document.querySelectorAll('input[type="radio"]:checked');
                for (var i = 0; i < radios.length; i++) {
                    var val = radios[i].value;
                    // Check if value matches any plan ID
                    for (var j = 0; j < plans.length; j++) {
                        if (parseInt(val) === plans[j].id) {
                            return plans[j].id;
                        }
                    }
                }

                // Method 2: Find subscription plan container with selection
                var planContainers = document.querySelectorAll('.tutor-subscription-plan-item, .tutor-radio-select');
                var selectedIndex = -1;
                planContainers.forEach(function (container, index) {
                    var radio = container.querySelector('input[type="radio"]');
                    if (radio && radio.checked) {
                        selectedIndex = index;
                    }
                });
                if (selectedIndex >= 0 && plans[selectedIndex]) {
                    return plans[selectedIndex].id;
                }

                // Method 3: Default to first plan
                if (plans.length > 0) {
                    console.log('[WK] Using default first plan');
                    return plans[0].id;
                }

                return null;
            }

            function fixBuyNowButton() {
                // Find subscription Buy Now button specifically
                var subscriptionBox = document.querySelector('.tutor-course-enrollment-box, .tutor-course-sidebar-card');
                if (!subscriptionBox) return;

                var buyButtons = subscriptionBox.querySelectorAll('a.tutor-btn, button.tutor-btn');

                buyButtons.forEach(function (btn) {
                    if (btn.dataset.wkSubscriptionFixed) return;

                    // Check if this is for subscription (look for subscription container)
                    var isSubscription = !!subscriptionBox.querySelector('.tutor-subscription-plan-item, [class*="subscription"]');
                    if (!isSubscription) return;

                    btn.dataset.wkSubscriptionFixed = '1';

                    btn.addEventListener('click', function (e) {
                        var planId = getSelectedPlanId();
                        if (!planId) {
                            console.warn('[WK] No plan ID found');
                            return; // Let default behavior happen
                        }

                        e.preventDefault();
                        e.stopPropagation();

                        var url = checkoutUrl + '?plan=' + planId + '&course_id=' + courseId;
                        console.log('[WK] Redirecting to:', url);
                        window.location.href = url;
                        return false;
                    }, true); // Use capture phase
                });
            }

            // Run when DOM ready and after delays (for dynamic content)
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', fixBuyNowButton);
            } else {
                fixBuyNowButton();
            }
            setTimeout(fixBuyNowButton, 500);
            setTimeout(fixBuyNowButton, 1500);
            setTimeout(fixBuyNowButton, 3000);
        })();
    </script>
    <?php
}, 999);
