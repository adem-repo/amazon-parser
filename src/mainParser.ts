import * as puppeteer from 'puppeteer';
import getCategoryData from './getCategoryData';
import { Constants } from './constants';
import { dbConnect, dbDisconnect } from './db_connection';

process.setMaxListeners(20000);

let startUrl: string = `${Constants.amazonAddress}/Best-Sellers-Kindle-Store-Nonfiction/zgbs/digital-text/157325011/ref=zg_bs_nav_kstore_2_154606011`;

async function main() {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    await dbConnect();

    await getCategoryData(startUrl);

    await dbDisconnect();

    await browser.close();
}

process.on('SIGINT', async function() {
    console.log("Caught interrupt signal");
    process.exit();
});

console.time('parse time');

(async () => main())();

