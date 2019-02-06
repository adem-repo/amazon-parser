import * as puppeteer from 'puppeteer';
import * as fs from 'fs';
import getCategoryData from './getCategoryData';
import { Constants } from './constants';

process.setMaxListeners(20000);

let startUrl: string = `${Constants.amazonAddress}/Best-Sellers-Kindle-Store-Nonfiction/zgbs/digital-text/157325011/ref=zg_bs_nav_kstore_2_154606011`;

async function main() {
    const browser = await puppeteer.launch({
      headless: true
    });
    const data = await getCategoryData(startUrl, []);
    await browser.close();
    return data;
}

process.on('SIGINT', async function() {
    console.log("Caught interrupt signal");
    process.exit();
});

console.time('parse time');

main()
    .then(data => {
        console.timeEnd('parse time');
        fs.writeFileSync('result.json', data)
    });

