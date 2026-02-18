import { readdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const projectRoot = join(__dirname, '..');
const assetsDir = join(projectRoot, 'dist', 'assets');
const htmlPath = join(projectRoot, 'dist', 'index.html');

console.log('Injecting preloads...');

try {
    // Check if dist exists
    try {
        readdirSync(assetsDir);
    } catch (e) {
        console.log('No dist/assets directory found. Skipping preload injection.');
        process.exit(0);
    }

    const files = readdirSync(assetsDir);

    // Find the critical font files
    // We prioritize latin subset for English site
    const criticalFonts = [
        files.find(f => f.includes('unbounded') && f.includes('latin') && f.includes('700') && f.endsWith('.woff2')),
        files.find(f => f.includes('manrope') && f.includes('latin') && f.includes('400') && f.endsWith('.woff2')),
    ].filter(Boolean);

    if (criticalFonts.length === 0) {
        console.log('No critical fonts found to preload.');
    } else {
        // Build preload tags
        // Important: crossorigin attribute is required for fonts!
        const preloadTags = criticalFonts
            .map(f => `  <link rel="preload" href="/assets/${f}" as="font" type="font/woff2" crossorigin>`)
            .join('\n');

        // Inject into HTML
        let html = readFileSync(htmlPath, 'utf-8');

        // Insert before </head>
        if (html.includes('</head>')) {
            html = html.replace('</head>', `${preloadTags}\n</head>`);
            writeFileSync(htmlPath, html);
            console.log(`Injected preload tags for: ${criticalFonts.join(', ')}`);
        } else {
            console.warn('Could not find </head> tag in index.html');
        }
    }
} catch (error) {
    console.error('Error injecting preloads:', error);
    process.exit(1);
}
