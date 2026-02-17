import * as ftp from 'basic-ftp';

const config = {
    host: '45.84.204.95',
    user: 'u436888800.whiteknight.academy',
    password: 'Warszawa2026!',
    secure: false,
    port: 21,
};

async function diagnose() {
    const client = new ftp.Client();
    client.ftp.verbose = true;

    try {
        await client.access(config);
        console.log("Connected. Listing files in /public_html/analytics...");

        const list = await client.list('/public_html/analytics');

        console.log("\n--- FILE LISTING ---");
        list.forEach(f => {
            console.log(`${f.name}\tSize: ${f.size}\tMode: ${f.rawModifiedAt ? '?' : '?'}`);
            // basic-ftp list object doesn't always show raw mode easily, relying on verbose log
        });

        // specific check
        const index = list.find(f => f.name === 'index.html');
        if (index) {
            console.log("\n✅ index.html FOUND");
        } else {
            console.log("\n❌ index.html MISSING");
        }

        console.log("\n--- DOWNLOADING .htaccess ---");
        await client.downloadTo("dist/downloaded_htaccess", "/public_html/analytics/.htaccess");
        console.log("Downloaded .htaccess for inspection.");

    } catch (err) {
        console.error("Diagnosis Failed:", err);
    } finally {
        client.close();
    }
}
diagnose();
