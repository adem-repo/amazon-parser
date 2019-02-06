import * as $ from 'cheerio';
import * as puppeteer from 'puppeteer';

async function getBookRank(url: string, browser) {

	let result: string;

	const page = await browser.newPage();

	await page.goto(`${url}`, {waitUntil: 'domcontentloaded'});

	const pageContent: string = await page.content();
	const rankSelector: string = '#SalesRank';
	const targetElement = $(rankSelector, pageContent);
	const targetString = await targetElement.text();
	const matches: string[] | never = await targetString.match(/(#\d{1,3})(,\d{3})?(,\d{3})?/g);

	if (matches)
		result = matches[0].split('#')[1];
	else
		result = await getBookRank(url, browser)

	await page.close();

	return result;
}

async function testFunction() {
	const tempBrowser = await puppeteer.launch({
		headless: true
	});
	const tempUrl = 'https://www.amazon.com/Broken-Circle-Memoir-Escaping-Afghanistan-ebook/dp/B07DK7FBDS/ref=zg_bs_15732' +
		'5011_1/130-2905574-2217206?_encoding=UTF8&psc=1&refRID=5YNB4M7E8YTR2CWXCSW8'
	await getBookRank(tempUrl, tempBrowser).then(data => console.log(data))
	await tempBrowser.close();
}

// testFunction();

export default getBookRank;