import * as ftp from 'basic-ftp';
import path from 'path';
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
        await client.clearWorkingDir(); // Careful! This deletes everything in the remote dir.

        const localDist = path.join(__dirname, 'dist');
        console.log(`Uploading local '${localDist}' to '${REMOTE_ROOT}'...`);

        await client.uploadFromDir(localDist, REMOTE_ROOT);

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
