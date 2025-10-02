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
