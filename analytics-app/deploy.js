import * as ftp from 'basic-ftp';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// FTP Configuration
const config = {
    host: '45.84.204.95',
    user: 'u436888800.whiteknight.academy',
    password: 'Warszawa2026!', // Using same credentials as wk-chess-ui
    secure: false, // Plain FTP
    port: 21,
};

// Remote target directory
// Subdomain analytics.whiteknight.academy usually points to /public_html/analytics
const REMOTE_ROOT = '/public_html/analytics';

async function deploy() {
    const client = new ftp.Client();
    client.ftp.verbose = true;

    try {
        console.log(`Connecting to ${config.host} as ${config.user}...`);
        await client.access(config);
        console.log('Connected!');

        console.log(`Clearing remote directory: ${REMOTE_ROOT}`);
        await client.ensureDir(REMOTE_ROOT);
        // await client.clearWorkingDir(); // DISABLED: Keep old files to prevent "White Screen" for cached users

        const localDist = path.join(__dirname, 'dist');
        const distIndex = path.join(localDist, 'index.html');
        const distApp = path.join(localDist, 'app.html');
        if (fs.existsSync(distIndex)) {
            console.log('Renaming index.html to app.html for cache busting...');
            fs.renameSync(distIndex, distApp);
        }

        // Explicitly remove old index.html from remote to force DirectoryIndex to pick up app.html
        try {
            console.log('Removing old remote index.html...');
            await client.remove(REMOTE_ROOT + '/index.html');
        } catch (e) {
            console.log('Old index.html not found or could not be deleted (non-fatal).');
        }

        console.log(`Uploading local '${localDist}' to '${REMOTE_ROOT}'...`);

        await client.uploadFromDir(localDist, REMOTE_ROOT);

        // CREATE CACHE BUSTER COPY
        // Copy app.html (which was index.html) to v170.html
        console.log("Creating v229.html alias for cache busting...");
        try {
            // Fix Windows path issue: explicit forward slashes for FTP
            const v229Path = REMOTE_ROOT + '/v229.html';
            console.log(`Uploading to: ${v229Path}`);
            await client.uploadFrom(distApp, v229Path);
        } catch (e) {
            console.error("Failed to create alias:", e);
        }

        console.log('Deployment Complete! 🚀');
        console.log('Visit: https://analytics.whiteknight.academy');

    } catch (err) {
        console.error('Deployment Failed:', err);
        process.exit(1);
    } finally {
        client.close();
    }
}

deploy();
