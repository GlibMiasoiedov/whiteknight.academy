<?php
// Cleanup script to remove garbage files created by Windows deploy script
$garbageFile = __DIR__ . '/\\public_html\\analytics\\v162.html';
// Also try the literal filename if it was created with backslashes
$garbageFileLiteral = __DIR__ . '/\public_html\analytics\v162.html';

if (file_exists($garbageFile)) {
    unlink($garbageFile);
    echo "Deleted garbage file (escaped path).\n";
}
if (file_exists($garbageFileLiteral)) {
    unlink($garbageFileLiteral);
    echo "Deleted garbage file (literal path).\n";
}

// List all files to confirm cleanup
$files = scandir(__DIR__);
foreach ($files as $f) {
    if (strpos($f, 'public_html') !== false) {
        // Try to delete any file containing 'public_html' in name (likely garbage)
        unlink(__DIR__ . '/' . $f);
        echo "Deleted suspicious file: $f\n";
    }
}
echo "Cleanup complete.";
?>