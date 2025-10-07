import { API_URL } from "@config/apiConfig";

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

export const createWordSet = async (token, formData) => {
  console.log("formData", formData);
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
