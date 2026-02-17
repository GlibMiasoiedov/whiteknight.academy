<?php
header('Content-Type: text/plain');

echo "Current Directory: " . __DIR__ . "\n";
echo "Files in Current Directory:\n";
$files = scandir(__DIR__);
foreach ($files as $file) {
    if ($file === '.' || $file === '..')
        continue;
    echo "- $file (" . (is_dir($file) ? 'DIR' : 'FILE') . ")\n";
}

echo "\nFiles in 'assets' Directory:\n";
if (is_dir(__DIR__ . '/assets')) {
    $assets = scandir(__DIR__ . '/assets');
    foreach ($assets as $asset) {
        if ($asset === '.' || $asset === '..')
            continue;
        echo "- $asset\n";
    }
} else {
    echo "ERROR: 'assets' directory not found!\n";
}
?>