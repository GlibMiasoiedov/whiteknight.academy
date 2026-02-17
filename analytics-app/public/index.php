<?php
// Prevent caching of the entry point
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");

// FORCE clear browser cache for this site (Nuclear Option)
// This tells the browser: "Delete all cached data for this origin"
header("Clear-Site-Data: \"cache\"");

// Serve the SPA application
// We look for app.html (renamed from index.html by deploy script)
$file = __DIR__ . '/app.html';

if (file_exists($file)) {
    readfile($file);
} else {
    // Fallback if app.html missing (shouldn't happen)
    http_response_code(404);
    echo "Error: Application entry point not found.";
}
?>