import * as $ from 'cheerio';
import getBookRank from './getBookRank';
import * as puppeteer from "puppeteer";
import to from 'await-to-js';
import { Constants } from './constants';

const getCategoryData = async (url, resultData) => {

	const browser = await puppeteer.launch(/*{headless: false}*/);

	const [error, page] = await to(browser.newPage());
	if (!page) {
		console.log('Page not opened', error);
		return;
	}

	page.on('error', () => {
		console.log('Something goes wrong');
		process.exit();
	});

	let pageToUrl = await to(page.goto(url));
	if (!pageToUrl) {
		console.log('Page isn\'t on url', error);
		return;
	}

	const pageContent = await page.content();

	// Elements selectors
	const currentCategorySelector = `.zg_selected`;
	const categoryBooksLinkSelector = `.zg-item > a.a-link-normal`;

	// Getting current category title
	const currentCategoryTitle = $(currentCategorySelector, pageContent)['0'].children[0].data;

	console.log(currentCategoryTitle);

	// Getting current category child categories
	let childCategories: any|never[] = [];
	let nextToParent = $(currentCategorySelector, pageContent)
		.parent()
		.next();

	if (nextToParent && nextToParent[0]) {
		if (nextToParent[0].name === 'ul' && nextToParent.children()) {
			nextToParent.children().each((i, item) => childCategories.push({
				categoryTitle: item.children[0].children[0].data,
				categoryURI: item.children[0].attribs.href
			}));
		}
	}

	// Getting current category books data
	const categoryBooks = $(categoryBooksLinkSelector, pageContent)
		.map((i, item) => ({
			bookTitle: ( () => {
				try {
					return item.children[2].children[0].data
				} catch (error) {
					console.log(item, item.children[2], item.children[2].children[0])
				}
			})(),
			bookURI: `${Constants.amazonAddress}${item.attribs.href}`,
		})).get();

	//Getting rank for each book
	let categoryBooksWithRankPromises = categoryBooks.map( async book => {
		book.bookRank = await getBookRank(book.bookURI, browser);
		return book;
	});

	let categoryBooksWithRank: any = [];
	await Promise.all(categoryBooksWithRankPromises)
		.then( data => categoryBooksWithRank = data )
		.catch(reason => {
			categoryBooksWithRank = [];
			console.log(reason);
		});

	console.log(categoryBooksWithRank);

	resultData.push({
		categoryTitle: currentCategoryTitle,
		booksRank: categoryBooks,
	});


	if (childCategories.length) {
		// Fast and unstable
		// childCategories.forEach(async category => {
		// 	resultData.push(await getCategoryData(category.categoryURI, resultData));
		// });

		// Slow and stable
		for (let i = 0; i < childCategories.length; i++) {
			resultData.push(await getCategoryData(childCategories[i].categoryURI, resultData));
		}
	}

	await page.close();
	await browser.close();

	return resultData
};

// getCategoryData('https://www.amazon.com/Best-Sellers-Kindle-Store-Architects-Z/zgbs/digital-text/157631011/ref=zg_bs_nav_kstore_4_157630011', []);
// getCategoryData('https://www.amazon.com/Best-Sellers-Kind
// le-Store-Architecture/zgbs/digital-text/157630011/ref=zg_bs_unv_kstore_4_157631011_1', []);

export default getCategoryData;

//TODO для каждой книги получить ранг: DONE
//TODO если есть подкатегории, повторить для каждой.