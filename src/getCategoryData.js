"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
exports.__esModule = true;
var $ = require("cheerio");
var ulCompiler_1 = require("./ulCompiler");
var getBookRank_1 = require("./getBookRank");
var constants_1 = require("./constants");
var getCategoryData = function (url, count, browser) { return __awaiter(_this, void 0, void 0, function () {
    var page, pageContent, categoriesSelector, currentCategorySelector, categoryBooksLinkSelector, currentCategoryTitle, childCategories, categoryBooks, i, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, browser.newPage()];
            case 1:
                page = _b.sent();
                return [4 /*yield*/, page.goto(url)];
            case 2:
                _b.sent();
                return [4 /*yield*/, page.content()];
            case 3:
                pageContent = _b.sent();
                console.log(1);
                categoriesSelector = "#zg-left-col " + ulCompiler_1["default"](count) + " li a";
                currentCategorySelector = ".zg_selected";
                categoryBooksLinkSelector = ".zg-item > a.a-link-normal";
                currentCategoryTitle = $(currentCategorySelector, pageContent)['0'].children[0].data;
                childCategories = $(categoriesSelector, pageContent)
                    .map(function (i, item) { return ({
                    categoryTitle: item.children[0].data,
                    categoryURI: item.attribs.href
                }); }).get();
                categoryBooks = $(categoryBooksLinkSelector, pageContent)
                    .map(function (i, item) { return ({
                    bookTitle: item.children[2].children[0].data,
                    bookURI: "" + constants_1.Constants.amazonAddress + item.attribs.href
                }); }).get();
                i = 0;
                _b.label = 4;
            case 4:
                if (!(i < categoryBooks.length)) return [3 /*break*/, 7];
                _a = categoryBooks[i];
                return [4 /*yield*/, getBookRank_1["default"](categoryBooks[i].bookURI, browser)];
            case 5:
                _a.bookRank = _b.sent();
                _b.label = 6;
            case 6:
                i++;
                return [3 /*break*/, 4];
            case 7:
                //let categoryBooksWithRank: any = [];
                // await Promise.all(categoryBooksWithRankPromises)
                // 	.then( data => categoryBooksWithRank = data )
                // 	.catch(reason => {
                // 		categoryBooksWithRank = [];
                // 		console.log(reason);
                // 	});
                //let childCategoriesData = [];
                // if (childCategories.length) {
                // 		let childCategoriesPromises = childCategories.map(async category => {
                // 			let categoryData = await getCategoryData(category.categoryURI, count++, browser);
                // 			return await categoryData;
                // 		});
                //
                // 		let categoryData: any = [];
                // 		await Promise.all(childCategoriesPromises)
                // 			.then( data => console.log(data))
                // 			.catch(reason => {
                // 				categoryData = [];
                // 				console.log(reason);
                // 			});
                // }
                // if (childCategories.length) {
                // 	let childCategoriesPromises = childCategories.map(async category => {
                // 		let categoryData = await getCategoryData(category.categoryURI, count++, browser);
                // 		return await categoryData;
                // 	});
                //
                // 	let categoryData: any = [];
                // 	await Promise.all(childCategoriesPromises)
                // 		.then( data => console.log(data))
                // 		.catch(reason => {
                // 			categoryData = [];
                // 			console.log(reason);
                // 		});
                // }
                // console.log(categoryBooksWithRank);
                console.log({
                    categoryTitle: currentCategoryTitle,
                    booksRank: categoryBooks
                });
                return [2 /*return*/, {
                        categoryTitle: currentCategoryTitle,
                        booksRank: categoryBooks
                    }];
        }
    });
}); };
exports["default"] = getCategoryData;
//TODO для каждой книги получить ранг: DONE
//TODO если есть подкатегории, повторить для каждой.
