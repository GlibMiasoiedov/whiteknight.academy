<?php
/**
 * Plugin Name: WK i18n Polyfill
 * Description: Provides wp.i18n polyfill at the earliest possible point
 * Version: 1.0
 * 
 * This is a must-use plugin that runs before all other plugins
 */

// Output polyfill as absolute FIRST script on the page
add_action('wp_head', function () {
    // Output at priority -9999 to ensure it's before everything
    echo '<script id="wk-i18n-polyfill">
(function(){
    window.wp = window.wp || {};
    window.wp.i18n = window.wp.i18n || {};
    var p = {
        __: function(t){return t;},
        _x: function(t){return t;},
        _n: function(s,p,n){return n===1?s:p;},
        _nx: function(s,p,n){return n===1?s:p;},
        sprintf: function(){var a=[].slice.call(arguments);var f=a.shift()||"";return f.replace(/%[sd]/g,function(){return a.shift()||"";});},
        setLocaleData: function(){},
        getLocaleData: function(){return {};},
        hasTranslation: function(){return false;},
        isRTL: function(){return false;}
    };
    for(var k in p){if(!window.wp.i18n[k])window.wp.i18n[k]=p[k];}
    console.log("[WK-MU] wp.i18n polyfill initialized");
})();
</script>' . "\n";
}, -9999); // Negative priority = runs before everything else

// Also ensure it's available even earlier via send_headers
add_action('send_headers', function () {
    // Can't output scripts here, but can set up the output buffer
}, 0);
