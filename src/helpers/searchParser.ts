import { queryObject } from "../types/queryType.js";

export const shouldSearch = (queryFilter: queryObject) => {
  let search_ToAppend = "";
  if (queryFilter.title !== "") {
    if (search_ToAppend !== "") search_ToAppend += " and ";
    search_ToAppend += `title == "${queryFilter.title}"`;
  }
  if (queryFilter.category_id !== "") {
    if (search_ToAppend !== "") search_ToAppend += " and ";
    search_ToAppend += `category_id == "${queryFilter.category_id}"`;
  }
  if (queryFilter.start_date !== "") {
    if (search_ToAppend !== "") search_ToAppend += " and ";
    search_ToAppend += `date >= "${queryFilter.start_date}"`;
  }
  if (queryFilter.end_date !== "") {
    if (search_ToAppend !== "") search_ToAppend += " and ";
    search_ToAppend += `date <= "${queryFilter.end_date}"`;
  }
  if (queryFilter.page !== "") {
    if (search_ToAppend !== "") search_ToAppend += " and ";
    search_ToAppend += `page == "${queryFilter.page}"`;
  }
  if (search_ToAppend !== "") {
    return `where ${search_ToAppend}`;
  } else return null;
};
