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
 * Subscription Buy Now Button Workaround
 * Intercepts clicks on subscription buttons and redirects to checkout
 */
add_action('wp_footer', function () {
    // Only on single course pages
    if (!function_exists('tutor_utils') || !is_singular('courses')) {
        return;
    }
    ?>
    <script>
    (function() {
        document.addEventListener("DOMContentLoaded", function() {
            // Find subscription Buy Now buttons
            var checkAndFix = function() {
                var buyButtons = document.querySelectorAll(".tutor-subscription-buy-btn, .tutor-btn-subscription, a.tutor-btn[href='#'], button.tutor-btn-primary");
                
                buyButtons.forEach(function(btn) {
                    // Skip if already processed
                    if (btn.dataset.wkFixed) return;
                    btn.dataset.wkFixed = "1";
                    
                    btn.addEventListener("click", function(e) {
                        // Get selected plan
                        var selectedPlan = document.querySelector("input[name='tutor_subscription_plan']:checked, input[name='plan']:checked, .tutor-subscription-plan.active input, .tutor-plan-item.selected input");
                        var planId = selectedPlan ? selectedPlan.value : null;
                        
                        // Try to get plan from data attribute
                        if (!planId) {
                            var planItem = document.querySelector(".tutor-subscription-plan.tutor-is-active, .tutor-plan-item.active, .subscription-plan-item.selected");
                            if (planItem) {
                                planId = planItem.dataset.planId || planItem.dataset.id;
                            }
                        }
                        
                        // Get course ID from URL or page
                        var courseId = null;
                        var courseIdInput = document.querySelector("input[name='course_id'], input[name='tutor_course_id']");
                        if (courseIdInput) {
                            courseId = courseIdInput.value;
                        }
                        
                        // Try getting from data attribute on wrapper
                        if (!courseId) {
                            var courseWrapper = document.querySelector("[data-course-id], [data-course_id]");
                            if (courseWrapper) {
                                courseId = courseWrapper.dataset.courseId || courseWrapper.dataset.course_id;
                            }
                        }
                        
                        // Try getting from tutor_utils if available
                        if (!courseId && window._tutorobject && window._tutorobject.course_id) {
                            courseId = window._tutorobject.course_id;
                        }
                        
                        // Build checkout URL
                        if (planId && courseId) {
                            e.preventDefault();
                            e.stopPropagation();
                            var checkoutUrl = "/checkout/?plan=" + planId + "&course_id=" + courseId;
                            console.log("[WK] Subscription redirect:", checkoutUrl);
                            window.location.href = checkoutUrl;
                            return false;
                        }
                        
                        // Fallback: try Tutor checkout page with plan
                        if (planId) {
                            e.preventDefault();
                            e.stopPropagation();
                            var fallbackUrl = "/?post_type=page&p=4985&plan=" + planId;
                            console.log("[WK] Subscription fallback redirect:", fallbackUrl);
                            window.location.href = fallbackUrl;
                            return false;
                        }
                        
                        console.warn("[WK] Could not determine plan/course ID for subscription checkout");
                    });
                });
            };
            
            // Run immediately and after a delay (for dynamic content)
            checkAndFix();
            setTimeout(checkAndFix, 1000);
            setTimeout(checkAndFix, 2000);
            
            // Watch for dynamic changes
            var observer = new MutationObserver(function() {
                checkAndFix();
            });
            var subscriptionWrap = document.querySelector(".tutor-course-subscription-wrap, .tutor-subscription-plans, .subscription-box");
            if (subscriptionWrap) {
                observer.observe(subscriptionWrap, { childList: true, subtree: true });
            }
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
