"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (function (ulNumber) {
    if (ulNumber === void 0) { ulNumber = 1; }
    if (ulNumber < 1)
        throw new Error('Wrong number of uls');
    var str = 'ul';
    for (var i = 1; i < ulNumber; i++)
        str += ' > ul';
    return str;
});
//# sourceMappingURL=ulCompiler.js.map