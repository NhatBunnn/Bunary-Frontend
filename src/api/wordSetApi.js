import { API_URL } from "@config/apiConfig";
import { fetcher } from "./fetcher";

/**
 * Lấy word set theo id
 * @param {string} token - access token
 * @param {number|string} id - id của word set
 * @param {{ includeUser?: boolean, includeCollection?: boolean }} options - tuỳ chọn include
 */
export const findWordSetById = async (token, id, options = {}) => {
  if (!token) throw new Error("No access token provided");

  const url = new URL(`${API_URL}/api/v1/wordsets/${id}`);

  const includes = [];
  if (options.includeUser) includes.push("user");
  if (options.includeCollection) includes.push("collection");
  if (options.includeWord) includes.push("word");

  if (includes.length) {
    url.searchParams.append("include", includes.join(","));
  }

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const dataResponse = await response.json();

  if (response.ok) {
    return dataResponse;
  } else {
    throw dataResponse;
  }
};

export const findAllWordSet = async ({
  token,
  include = [],
  page = 0,
  size = 20,
  sort = "id,asc",
}) => {
  if (!token) throw new Error("No access token provided");

  const params = {
    page,
    size,
    sort,
  };

  if (include.length) {
    params.include = include.join(",");
  }

  return await fetcher({
    url: `/api/v1/wordsets`,
    token,
    params,
  });
};

export const findAllByCurrentUser = async (
  token,
  { page = 0, size = 20, sort = "id,asc" } = {}
) => {
  if (!token) throw new Error("No access token provided");

  const url = new URL(`${API_URL}/api/v1/wordsets/me`);

  url.searchParams.append("page", page);
  url.searchParams.append("size", size);
  url.searchParams.append("sort", sort);

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const dataResponse = await response.json();

  if (response.ok) {
    return dataResponse;
  } else {
    throw dataResponse;
  }
};

export const createWordSet = async (token, formData) => {
  const response = await fetch(`${API_URL}/api/v1/wordsets`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const dataResponse = await response.json();

  if (response.ok) {
    return dataResponse;
  } else {
    throw dataResponse;
  }
};

export const updateWordSet = async (token, wordSetId, formData) => {
  const response = await fetch(`${API_URL}/api/v1/wordsets/${wordSetId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const dataResponse = await response.json();

  if (response.ok) {
    return dataResponse;
  } else {
    throw dataResponse;
  }
};

export const removeWordSet = async (token, wordSetId) => {
  if (!token) throw new Error("No access token provided");

  const response = await fetch(`${API_URL}/api/v1/wordsets/${wordSetId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const dataResponse = await response.json();

  if (response.ok) {
    return dataResponse;
  } else {
    throw dataResponse;
  }
};
