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

