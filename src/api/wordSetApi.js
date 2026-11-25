import { fetcher as defaultFetcher } from "./fetcher";

const resolveCall = (arg1, arg2, arg3) => {
  let f = defaultFetcher;
  let id = null;
  let extra = null;

  if (typeof arg1 === "function") {
    f = arg1;
    id = arg2;
    extra = arg3;
  } else if (typeof arg1 === "string") {
    id = arg2;
    extra = arg3;
  } else if (typeof arg1 === "object" && arg1 !== null) {
    id = arg1.id || arg1.wordSetId || arg2;
    extra = arg1;
  } else {
    id = arg1;
    extra = arg2;
  }
  return { f, id, extra };
};

/**
 * Lấy word set theo id
 * Hỗ trợ các kiểu gọi:
 * - findWordSetById(fetcher, id, options)
 * - findWordSetById(token, id, options)
 * - findWordSetById(id, options)
 */
export const findWordSetById = async (arg1, arg2, arg3 = {}) => {
  const { f, id, extra } = resolveCall(arg1, arg2, arg3);
  const options = extra || {};
  const includes = [];
  if (options.includeUser) includes.push("user");
  if (options.includeCollection) includes.push("collection");
  if (options.includeWord) includes.push("word");

  const params = {};
  if (includes.length) {
    params.include = includes.join(",");
  }

  return await f({
    url: `/api/v1/wordsets/${id}`,
    method: "GET",
    params,
  });
};

export const findAllWordSet = async (arg1, arg2) => {
  let f = defaultFetcher;
  let options = {};
  if (typeof arg1 === "function") {
    f = arg1;
    options = arg2 || {};
  } else {
    options = arg1 || {};
  }

  const { include = [], page = 0, size = 20, sort = "id,asc" } = options;
  const params = { page, size, sort };
  if (include.length) params.include = include.join(",");

  return await f({
    url: `/api/v1/wordsets`,
    method: "GET",
    params,
  });
};

export const findAllByCurrentUser = async (arg1, arg2) => {
  let f = defaultFetcher;
  let options = {};
  if (typeof arg1 === "function") {
    f = arg1;
    options = arg2 || {};
  } else if (typeof arg1 === "string") {
    options = arg2 || {};
  } else {
    options = arg1 || {};
  }

  const { page = 0, size = 20, sort = "id,asc" } = options;

  return await f({
    url: `/api/v1/wordsets/me`,
    method: "GET",
    params: { page, size, sort },
  });
};

export const createWordSet = async (arg1, arg2) => {
  let f = defaultFetcher;
  let formData = arg1;
  if (typeof arg1 === "function") {
    f = arg1;
    formData = arg2;
  } else if (typeof arg1 === "string") {
    formData = arg2;
  }

  return await f({
    url: `/api/v1/wordsets`,
    method: "POST",
    data: formData,
    body: formData,
  });
};

export const updateWordSet = async (arg1, arg2, arg3) => {
  let f = defaultFetcher;
  let wordSetId = arg1;
  let formData = arg2;

  if (typeof arg1 === "function") {
    f = arg1;
    wordSetId = arg2;
    formData = arg3;
  } else if (typeof arg1 === "string") {
    wordSetId = arg2;
    formData = arg3;
  }

  return await f({
    url: `/api/v1/wordsets/${wordSetId}`,
    method: "PUT",
    data: formData,
    body: formData,
  });
};

export const removeWordSet = async (arg1, arg2) => {
  let f = defaultFetcher;
  let wordSetId = arg1;
  if (typeof arg1 === "function") {
    f = arg1;
    wordSetId = arg2;
  } else if (typeof arg1 === "string") {
    wordSetId = arg2;
  }

  return await f({
    url: `/api/v1/wordsets/${wordSetId}`,
    method: "DELETE",
  });
};
