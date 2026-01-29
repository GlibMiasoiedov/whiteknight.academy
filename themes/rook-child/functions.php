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
 * Subscription Buy Now Button Workaround v2
 * Gets plan IDs from database and injects into page
 */
add_action('wp_footer', function () {
    // Only on single course pages
    if (!function_exists('tutor_utils') || !is_singular('courses')) {
        return;
    }
    
    global $wpdb, $post;
    $course_id = $post->ID;
    
    // Get subscription plans for this course from database
    $plans = $wpdb->get_results($wpdb->prepare("
        SELECT sp.id, sp.plan_name, sp.regular_price, sp.recurring_interval
        FROM {$wpdb->prefix}tutor_subscription_plans sp
        LEFT JOIN {$wpdb->prefix}tutor_subscription_plan_items spi ON sp.id = spi.plan_id
        WHERE (spi.object_id = %d AND spi.object_name = 'course')
           OR (sp.plan_type = 'course' AND sp.id IN (
               SELECT plan_id FROM {$wpdb->prefix}tutor_subscription_plan_items WHERE object_id = %d
           ))
        ORDER BY sp.plan_order ASC, sp.id ASC
    ", $course_id, $course_id));
    
    // If no direct course plans, try to get category-based plans
    if (empty($plans)) {
        $plans = $wpdb->get_results("
            SELECT sp.id, sp.plan_name, sp.regular_price, sp.recurring_interval
            FROM {$wpdb->prefix}tutor_subscription_plans sp
            WHERE sp.is_enabled = 1
            ORDER BY sp.plan_order ASC, sp.id ASC
        ");
    }
    
    $plans_json = json_encode(array_map(function($p) {
        return [
            'id' => (int)$p->id,
            'name' => $p->plan_name,
            'price' => $p->regular_price,
            'interval' => $p->recurring_interval
        ];
    }, $plans));
    ?>
    <script>
    (function() {
        var WK_COURSE_ID = <?php echo (int)$course_id; ?>;
        var WK_PLANS = <?php echo $plans_json; ?>;
        var WK_CHECKOUT_PAGE = 4985; // Tutor Checkout page ID
        
        console.log("[WK] Subscription workaround v2 loaded", {courseId: WK_COURSE_ID, plans: WK_PLANS});
        
        document.addEventListener("DOMContentLoaded", function() {
            var checkAndFix = function() {
                // Find ALL buttons that might be Buy Now
                var buyButtons = document.querySelectorAll(
                    ".tutor-subscription-buy-btn, " +
                    ".tutor-btn-subscription, " + 
                    "a.tutor-btn[href='#'], " +
                    "a.tutor-btn-primary[href='#'], " +
                    ".tutor-course-purchase-box a.tutor-btn, " +
                    ".subscription-box button, " +
                    ".subscription-box a.tutor-btn"
                );
                
                buyButtons.forEach(function(btn) {
                    if (btn.dataset.wkFixed) return;
                    btn.dataset.wkFixed = "1";
                    
                    btn.addEventListener("click", function(e) {
                        // Method 1: Find checked radio button
                        var selectedRadio = document.querySelector(
                            "input[type='radio'][name*='plan']:checked, " +
                            "input[type='radio'][name*='subscription']:checked, " +
                            ".tutor-form-check-input:checked"
                        );
                        
                        var planId = null;
                        var planIndex = -1;
                        
                        if (selectedRadio) {
                            planId = selectedRadio.value;
                            // If value is not a number, try to find index
                            if (isNaN(parseInt(planId))) {
                                planId = null;
                                // Find which radio is selected (by index)
                                var allRadios = document.querySelectorAll(
                                    "input[type='radio'][name*='plan'], " +
                                    "input[type='radio'][name*='subscription'], " +
                                    ".tutor-form-check-input"
                                );
                                allRadios.forEach(function(r, i) {
                                    if (r.checked) planIndex = i;
                                });
                            }
                        }
                        
                        // Method 2: Find selected plan item by class
                        if (!planId && planIndex < 0) {
                            var planItems = document.querySelectorAll(
                                ".tutor-subscription-plan, " +
                                ".subscription-plan-item, " +
                                ".tutor-plan-selection-item"
                            );
                            planItems.forEach(function(item, i) {
                                if (item.classList.contains("tutor-is-active") || 
                                    item.classList.contains("active") ||
                                    item.classList.contains("selected") ||
                                    item.querySelector(":checked")) {
                                    planIndex = i;
                                    planId = item.dataset.planId || item.dataset.id;
                                }
                            });
                        }
                        
                        // Method 3: Use plan index to get real ID from our mapping
                        if (!planId && planIndex >= 0 && WK_PLANS[planIndex]) {
                            planId = WK_PLANS[planIndex].id;
                            console.log("[WK] Got plan ID from index mapping:", planIndex, "->", planId);
                        }
                        
                        // Method 4: Default to first plan if only one exists
                        if (!planId && WK_PLANS.length === 1) {
                            planId = WK_PLANS[0].id;
                            console.log("[WK] Only one plan, using:", planId);
                        }
                        
                        // Method 5: If still no plan but we have plans, use first one
                        if (!planId && WK_PLANS.length > 0) {
                            planId = WK_PLANS[0].id;
                            console.log("[WK] Fallback to first plan:", planId);
                        }
                        
                        if (planId) {
                            e.preventDefault();
                            e.stopPropagation();
                            // Use Tutor's checkout page
                            var checkoutUrl = "/?post_type=page&p=" + WK_CHECKOUT_PAGE + 
                                              "&plan=" + planId + 
                                              "&course_id=" + WK_COURSE_ID;
                            console.log("[WK] Redirecting to checkout:", checkoutUrl);
                            window.location.href = checkoutUrl;
                            return false;
                        }
                        
                        console.warn("[WK] Could not determine plan ID. Plans:", WK_PLANS);
                    });
                });
            };
            
            checkAndFix();
            setTimeout(checkAndFix, 500);
            setTimeout(checkAndFix, 1500);
            setTimeout(checkAndFix, 3000);
        });
    })();
    </script>
    <?php
}, 999);

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
