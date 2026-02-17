<?php
// Prevent caching of this verification script
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");

$file = __DIR__ . '/index.html';

echo "<h1>Server Content Verification</h1>";
echo "<p>Checking file: <strong>$file</strong></p>";

if (file_exists($file)) {
    echo "<h2>File Status: FOUND</h2>";
    echo "<p>Last Modified: " . date("F d Y H:i:s.", filemtime($file)) . "</p>";
    echo "<p>File Size: " . filesize($file) . " bytes</p>";

    $content = file_get_contents($file);

    echo "<h2>Script Tags in index.html:</h2>";
    echo "<pre style='background: #eee; padding: 10px; border: 1px solid #ccc;'>";
    // Extract script src
    preg_match_all('/<script[^>]+src="([^"]+)"/', $content, $matches);
    foreach ($matches[1] as $src) {
        echo htmlspecialchars($src) . "\n";
    }
    echo "</pre>";

    echo "<h2>Raw Content (First 500 chars):</h2>";
    echo "<pre style='background: #eee; padding: 10px; border: 1px solid #ccc;'>";
    echo htmlspecialchars(substr($content, 0, 500));
    echo "</pre>";
} else {
    echo "<h2>File Status: NOT FOUND</h2>";
}
?>