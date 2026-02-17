import * as ftp from 'basic-ftp';

const config = {
    host: '45.84.204.95',
    user: 'u436888800.whiteknight.academy',
    password: 'Warszawa2026!',
    secure: false,
    port: 21,
};

async function deployFix() {
    const client = new ftp.Client();
    client.ftp.verbose = true;

    try {
        console.log("Connecting...");
        await client.access(config);

        // Upload frontend assets
        console.log("Uploading dist/assets...");
        await client.ensureDir("/public_html/analytics/assets");
        await client.uploadFromDir("dist/assets", "/public_html/analytics/assets");

        // Upload index.html
        console.log("Uploading index.html...");
        await client.uploadFrom("dist/index.html", "/public_html/analytics/index.html");

        console.log("DEPLOY COMPLETE");

    } catch (err) {
        console.error("Deploy Failed:", err);
    } finally {
        client.close();
    }
}
deployFix();
