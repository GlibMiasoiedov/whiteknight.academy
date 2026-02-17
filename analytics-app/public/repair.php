<?php
// THE NUCLEAR OPTION
// This header tells the browser to clear EVERYTHING for this origin.
header('Clear-Site-Data: "cache", "cookies", "storage", "executionContexts"');
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Pragma: no-cache");
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>White Knight System Repair</title>
    <style>
        body {
            font-family: sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            background: #000;
            color: #0f0;
        }

        .status {
            margin-top: 20px;
            color: #888;
            font-family: monospace;
        }
    </style>
</head>

<body>
    <h1>SYSTEM REPAIR COMPLETE</h1>
    <div id="status" class="status">
        [✓] HTTP Cache Cleared (via Header)<br>
        [✓] Service Workers Terminated<br>
        [✓] Storage Wiped<br>
        <br>
        Redirecting to fresh app in 3 seconds...
    </div>

    <script>
        // Double-tap: Clear SW/Storage via JS too
        async function cleanup() {
            if ('serviceWorker' in navigator) {
                const registrations = await navigator.serviceWorker.getRegistrations();
                for (let registration of registrations) registration.unregister();
            }
            if ('caches' in window) {
                const keys = await caches.keys();
                for (let key of keys) await caches.delete(key);
            }
            localStorage.clear();
            sessionStorage.clear();

            setTimeout(() => {
                // Redirect to homepage with a timestamp to ensure fresh load
                window.location.replace('/?t=' + Date.now());
            }, 3000);
        }
        cleanup();
    </script>
</body>

</html>