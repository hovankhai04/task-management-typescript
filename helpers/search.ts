interface ObjectSearch {
  keyword: string,
  regex?: RegExp
}

// tìm kiếm theo từ khoá
const searchHelper = (query: Record<string, any>): ObjectSearch => {
  let objectSearch: ObjectSearch = {
    keyword: ""
  };

  if (query.keyword) {
    objectSearch.keyword = query.keyword;
    const regex = new RegExp(objectSearch.keyword, "i"); // tạo regex để tìm kiếm theo từ khoá, "i" để tìm kiếm không phân biệt chữ hoa, chữ thường
    objectSearch.regex = regex;
  }

  return objectSearch;
}

export default searchHelper;