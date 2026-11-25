import { fetcher as defaultFetcher } from "./fetcher";

export const removeCollection = async (arg1, arg2) => {
  let f = defaultFetcher;
  let collectionId = null;

  if (typeof arg1 === "function") {
    f = arg1;
    collectionId = arg2;
  } else if (typeof arg1 === "object" && arg1 !== null) {
    collectionId = arg1.collectionId || arg1.id;
  } else {
    collectionId = arg1;
  }

  return await f({
    url: `/api/v1/collections/${collectionId}`,
    method: "DELETE",
  });
};

export const findAllCollections = async (arg1, arg2) => {
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
    url: `/api/v1/collections`,
    method: "GET",
    params,
  });
};

export const createCollection = async (arg1, arg2) => {
  let f = defaultFetcher;
  let body = null;

  if (typeof arg1 === "function") {
    f = arg1;
    body = arg2;
  } else if (typeof arg1 === "object" && arg1 !== null) {
    body = arg1.body || arg1.data || arg1;
  } else {
    body = arg1;
  }

  return await f({
    url: `/api/v1/collections`,
    method: "POST",
    data: body,
    body,
  });
};

export const getWordsetsByCollectionId = async (arg1, arg2) => {
  let f = defaultFetcher;
  let id = arg1;
  if (typeof arg1 === "function") {
    f = arg1;
    id = arg2;
  } else if (typeof arg1 === "string") {
    id = arg2;
  }

  return await f({
    url: `/api/v1/collections/${id}/wordsets`,
    method: "POST",
  });
};

export const findById = async (arg1, arg2) => {
  let f = defaultFetcher;
  let id = arg1;
  if (typeof arg1 === "function") {
    f = arg1;
    id = arg2;
  } else if (typeof arg1 === "string") {
    id = arg2;
  }

  return await f({
    url: `/api/v1/collections/${id}`,
    method: "GET",
  });
};

export const AddWordSetToCollection = async (arg1, arg2, arg3) => {
  let f = defaultFetcher;
  let collectionId = arg1;
  let wordSetId = arg2;

  if (typeof arg1 === "function") {
    f = arg1;
    collectionId = arg2;
    wordSetId = arg3;
  } else if (typeof arg1 === "string") {
    collectionId = arg2;
    wordSetId = arg3;
  }

  return await f({
    url: `/api/v1/collections/${collectionId}/wordsets/${wordSetId}`,
    method: "POST",
  });
};

export const removeCollectionAndWordSet = async (arg1, arg2, arg3) => {
  let f = defaultFetcher;
  let collectionId = arg1;
  let wordSetId = arg2;

  if (typeof arg1 === "function") {
    f = arg1;
    collectionId = arg2;
    wordSetId = arg3;
  } else if (typeof arg1 === "string") {
    collectionId = arg2;
    wordSetId = arg3;
  }

  return await f({
    url: `/api/v1/collections/${collectionId}/wordsets/${wordSetId}`,
    method: "DELETE",
  });
};
