interface ObjectPaginationOutput {
  currentPage: number;
  limitItems: number;
  skip: number;
  totalPage: number;
};

interface ObjectPaginationInput {
  currentPage: number;
  limitItems: number;
}


const paginationHelper = (objectPagination: ObjectPaginationInput, query: Record<string, any>, countRecords: number): ObjectPaginationOutput => {

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

  const totalPage = Math.ceil(countRecords / objectPagination.limitItems); // hàm ceil để trả về số nguyên lớn hơn số thập phân trước đó

  return {
    ...objectPagination,
    skip,
    totalPage
  };
}

export default paginationHelper