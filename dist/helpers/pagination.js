"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
;
const paginationHelper = (objectPagination, query, countRecords) => {
    if (query.page) {
        const page = Number(query.page);
        if (!isNaN(page) && page > 0) {
            objectPagination.currentPage = page;
        }
    }
    if (query.limit) {
        const limit = Number(query.limit);
        if (!isNaN(limit) && limit > 0) {
            objectPagination.limitItems = limit;
        }
    }
    const skip = (objectPagination.currentPage - 1) * objectPagination.limitItems;
    const totalPage = Math.ceil(countRecords / objectPagination.limitItems);
    return Object.assign(Object.assign({}, objectPagination), { skip,
        totalPage });
};
exports.default = paginationHelper;
