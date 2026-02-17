import * as ftp from 'basic-ftp';
import path from 'path';

const config = {
    host: '45.84.204.95',
    user: 'u436888800.whiteknight.academy',
    password: 'Warszawa2026!',
    secure: false,
    port: 21,
};

async function emergencyRestore() {
    const client = new ftp.Client();
    client.ftp.verbose = true;
    try {
        await client.access(config);

        // 1. Upload index.html
        console.log("Uploading index.html...");
        await client.uploadFrom("dist/index.html", "/public_html/analytics/index.html");

        // 2. Delete junk
        const junk = ['app.html', 'index.php', 'repair.php', 'repair.html', 'cleanup.php', 'debug-files.php', 'verify.php'];
        for (const file of junk) {
            try {
                await client.remove("/public_html/analytics/" + file);
                console.log("Deleted junk: " + file);
            } catch (e) { }
        }

        console.log("RESTORE COMPLETE");
    } catch (e) {
        console.error(e);
    } finally {
        client.close();
    }
}
emergencyRestore();
