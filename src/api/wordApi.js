import { fetcher as defaultFetcher } from "./fetcher";

/**
 * Lấy danh sách từ vựng theo ID của word set
 * Hỗ trợ gọi: findWordsByWordSetId(fetcher, id) hoặc findWordsByWordSetId(id)
 */
export const findWordsByWordSetId = async (arg1, arg2) => {
  let f = defaultFetcher;
  let id = arg1;

  if (typeof arg1 === "function") {
    f = arg1;
    id = arg2;
  } else if (typeof arg1 === "string") {
    id = arg2;
  }

  return await f({
    url: `/api/v1/words/${id}`,
    method: "GET",
  });
};
