<?php
/**
 * Temporary Tutor LMS Settings Fixer
 * DELETE THIS FILE AFTER USE!
 * 
 * Access: https://whiteknight.academy/wk-tutor-fix.php?key=wk2026fix
 */

// Security check
if (!isset($_GET['key']) || $_GET['key'] !== 'wk2026fix') {
    http_response_code(403);
    die('Access denied');
}

// Load WordPress
require_once dirname(__FILE__) . '/wp-load.php';

// Get Tutor options
$tutor_option = get_option('tutor_option', array());

// Handle form submission
if (isset($_POST['action']) && $_POST['action'] === 'set_tutor_native') {
    if (isset($tutor_option['monetize_by'])) {
        $tutor_option['monetize_by'] = 'tutor';
    }
    update_option('tutor_option', $tutor_option);
    echo '<div style="background: #4CAF50; color: white; padding: 15px; margin: 10px 0; border-radius: 5px;">✅ Settings updated to Tutor Native! Refresh your WP Admin.</div>';
    // Refresh the option
    $tutor_option = get_option('tutor_option', array());
}

if (isset($_POST['action']) && $_POST['action'] === 'set_woocommerce') {
    if (isset($tutor_option['monetize_by'])) {
        $tutor_option['monetize_by'] = 'wc';
    }
    update_option('tutor_option', $tutor_option);
    echo '<div style="background: #2196F3; color: white; padding: 15px; margin: 10px 0; border-radius: 5px;">✅ Settings updated to WooCommerce!</div>';
    $tutor_option = get_option('tutor_option', array());
}

// Extract relevant settings
$monetize_by = isset($tutor_option['monetize_by']) ? $tutor_option['monetize_by'] : 'not set';
$ecommerce_engine = isset($tutor_option['ecommerce_engine']) ? $tutor_option['ecommerce_engine'] : 'not set';

?>
<!DOCTYPE html>
<html>
<head>
    <title>Tutor LMS Settings Fixer</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; background: #f5f5f5; }
        .card { background: white; padding: 25px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); margin: 20px 0; }
        h1 { color: #333; }
        .setting { padding: 10px; margin: 5px 0; background: #f9f9f9; border-radius: 5px; }
        .setting strong { color: #666; }
        .value { color: #2196F3; font-weight: bold; }
        .value.tutor { color: #4CAF50; }
        .value.wc { color: #9C27B0; }
        button { padding: 12px 24px; font-size: 16px; border: none; border-radius: 5px; cursor: pointer; margin: 5px; }
        .btn-tutor { background: #4CAF50; color: white; }
        .btn-wc { background: #9C27B0; color: white; }
        .btn-tutor:hover { background: #45a049; }
        .btn-wc:hover { background: #7B1FA2; }
        .warning { background: #FFF3CD; border: 1px solid #FFE69C; padding: 15px; border-radius: 5px; color: #856404; }
        pre { background: #263238; color: #EEFFFF; padding: 15px; border-radius: 5px; overflow-x: auto; font-size: 12px; }
    </style>
</head>
<body>
    <h1>🔧 Tutor LMS Settings Fixer</h1>
    
    <div class="warning">
        ⚠️ <strong>Security Warning:</strong> Delete this file after use! <code>/wk-tutor-fix.php</code>
    </div>
    
    <div class="card">
        <h2>Current Settings</h2>
        <div class="setting">
            <strong>monetize_by:</strong> 
            <span class="value <?php echo $monetize_by === 'tutor' ? 'tutor' : ($monetize_by === 'wc' ? 'wc' : ''); ?>">
                <?php echo esc_html($monetize_by); ?>
            </span>
            <?php if ($monetize_by === 'tutor'): ?>
                (Tutor Native)
            <?php elseif ($monetize_by === 'wc'): ?>
                (WooCommerce)
            <?php endif; ?>
        </div>
        <div class="setting">
            <strong>ecommerce_engine:</strong> 
            <span class="value"><?php echo esc_html($ecommerce_engine); ?></span>
        </div>
    </div>
    
    <div class="card">
        <h2>Quick Actions</h2>
        <form method="post" style="display: inline;">
            <input type="hidden" name="action" value="set_tutor_native">
            <button type="submit" class="btn-tutor">✅ Set to Tutor Native</button>
        </form>
        <form method="post" style="display: inline;">
            <input type="hidden" name="action" value="set_woocommerce">
            <button type="submit" class="btn-wc">🛒 Set to WooCommerce</button>
        </form>
    </div>
    
    <div class="card">
        <h2>All Tutor Options (Debug)</h2>
        <details>
            <summary>Click to expand (large data)</summary>
            <pre><?php print_r($tutor_option); ?></pre>
        </details>
    </div>
    
    <div class="card">
        <h2>Related Options in Database</h2>
        <?php
        global $wpdb;
        $related = $wpdb->get_results("SELECT option_name, LEFT(option_value, 100) as option_value FROM {$wpdb->options} WHERE option_name LIKE '%tutor%' AND (option_name LIKE '%monetize%' OR option_name LIKE '%ecommerce%' OR option_name LIKE '%payment%') LIMIT 20");
        if ($related): ?>
            <table style="width:100%; border-collapse: collapse;">
                <tr style="background:#f0f0f0;"><th style="padding:8px; text-align:left; border:1px solid #ddd;">Option Name</th><th style="padding:8px; text-align:left; border:1px solid #ddd;">Value (truncated)</th></tr>
                <?php foreach ($related as $row): ?>
                <tr><td style="padding:8px; border:1px solid #ddd;"><?php echo esc_html($row->option_name); ?></td><td style="padding:8px; border:1px solid #ddd;"><?php echo esc_html($row->option_value); ?></td></tr>
                <?php endforeach; ?>
            </table>
        <?php else: ?>
            <p>No related options found.</p>
        <?php endif; ?>
    </div>
</body>
</html>
