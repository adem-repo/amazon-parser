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
Object.defineProperty(exports, "__esModule", { value: true });
var $ = require("cheerio");
var getBookRank_1 = require("./getBookRank");
var puppeteer = require("puppeteer");
var await_to_js_1 = require("await-to-js");
var constants_1 = require("./constants");
var db_connection_1 = require("./db_connection");
var getCategoryData = function (url) { return __awaiter(_this, void 0, void 0, function () {
    var browser, _a, error, page, pageToUrl, pageContent, currentCategorySelector, categoryBooksLinkSelector, currentCategoryTitle, childCategories, nextToParent, categoryBooks, categoryBooksWithRankPromises, categoryBooksWithRank, categoryData, i;
    var _this = this;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4, puppeteer.launch()];
            case 1:
                browser = _b.sent();
                return [4, await_to_js_1.default(browser.newPage())];
            case 2:
                _a = _b.sent(), error = _a[0], page = _a[1];
                if (!page) {
                    console.log('Page not opened', error);
                    return [2];
                }
                page.on('error', function () {
                    console.log('Something goes wrong');
                    process.exit();
                });
                return [4, await_to_js_1.default(page.goto(url))];
            case 3:
                pageToUrl = _b.sent();
                if (!pageToUrl) {
                    console.log('Page isn\'t on url', error);
                    return [2];
                }
                return [4, page.content()];
            case 4:
                pageContent = _b.sent();
                currentCategorySelector = ".zg_selected";
                categoryBooksLinkSelector = ".zg-item > a.a-link-normal";
                currentCategoryTitle = $(currentCategorySelector, pageContent)['0'].children[0].data;
                childCategories = [];
                nextToParent = $(currentCategorySelector, pageContent)
                    .parent()
                    .next();
                if (nextToParent && nextToParent[0]) {
                    if (nextToParent[0].name === 'ul' && nextToParent.children()) {
                        nextToParent.children().each(function (i, item) { return childCategories.push({
                            categoryTitle: item.children[0].children[0].data,
                            categoryURI: item.children[0].attribs.href
                        }); });
                    }
                }
                categoryBooks = $(categoryBooksLinkSelector, pageContent)
                    .map(function (i, item) { return ({
                    bookTitle: (function () {
                        try {
                            return item.children[2].children[0].data;
                        }
                        catch (error) {
                            console.log(item, item.children[2], item.children[2].children[0]);
                        }
                    })(),
                    bookURI: "" + constants_1.Constants.amazonAddress + item.attribs.href,
                }); }).get();
                categoryBooksWithRankPromises = categoryBooks.map(function (book) { return __awaiter(_this, void 0, void 0, function () {
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                _a = book;
                                return [4, getBookRank_1.default(book.bookURI, browser)];
                            case 1:
                                _a.bookRank = _b.sent();
                                return [2, book];
                        }
                    });
                }); });
                categoryBooksWithRank = [];
                return [4, Promise.all(categoryBooksWithRankPromises)
                        .then(function (data) { return categoryBooksWithRank = data; })
                        .catch(function (reason) {
                        categoryBooksWithRank = [];
                        console.log(reason);
                    })];
            case 5:
                _b.sent();
                categoryData = {
                    categoryTitle: currentCategoryTitle,
                    categoryURI: url,
                    booksRank: categoryBooks,
                };
                db_connection_1.addDocument(categoryData);
                if (!childCategories.length) return [3, 9];
                i = 0;
                _b.label = 6;
            case 6:
                if (!(i < childCategories.length)) return [3, 9];
                return [4, getCategoryData(childCategories[i].categoryURI)];
            case 7:
                _b.sent();
                _b.label = 8;
            case 8:
                i++;
                return [3, 6];
            case 9: return [4, page.close()];
            case 10:
                _b.sent();
                return [4, browser.close()];
            case 11:
                _b.sent();
                return [2];
        }
    });
}); };
exports.default = getCategoryData;
//# sourceMappingURL=getCategoryData.js.map