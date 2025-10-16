import { API_URL } from "@config/apiConfig";
import { fetcher } from "./fetcher";

export const findAllMyCollections = async ({
  token,
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

  return await fetcher({
    url: `/api/v1/collections/me`,
    method: "GET",
    token,
    params,
  });
};

export const removeCollection = async ({ token, collectionId }) => {
  if (!token) throw new Error("No access token provided");

  return await fetcher({
    url: `/api/v1/collections/${collectionId}`,
    method: "DELETE",
  });
};

export const findAllCollections = async ({
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
    url: `/api/v1/collections`,
    token,
    params,
  });
};

export const createCollection = async ({ token, body }) => {
  if (!token) throw new Error("No access token provided");

  return await fetcher({
    url: `/api/v1/collections`,
    method: "POST",
    token,
    body,
  });
};

export const getWordsetsByCollectionId = async (token, id) => {
  if (!token) throw new Error("No access token provided");

  const response = await fetch(`${API_URL}/api/v1/collections/${id}/wordsets`, {
    method: "POST",
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

export const findById = async (token, id) => {
  if (!token) throw new Error("No access token provided");

  const response = await fetch(`${API_URL}/api/v1/collections/${id}`, {
    method: "POST",
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

export const AddWordSetToCollection = async (
  token,
  collectionId,
  wordSetId
) => {
  if (!token) throw new Error("No access token provided");

  const response = await fetch(
    `${API_URL}/api/v1/collections/${collectionId}/wordsets/${wordSetId}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  const dataResponse = await response.json();

  if (response.ok) {
    return dataResponse;
  } else {
    throw dataResponse;
  }
};

export const removeCollectionAndWordSet = async (
  token,
  collectionId,
  wordSetId
) => {
  if (!token) throw new Error("No access token provided");

  const response = await fetch(
    `${API_URL}/api/v1/collections/${collectionId}/wordsets/${wordSetId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  const dataResponse = await response.json();

  if (response.ok) {
    return dataResponse;
  } else {
    throw dataResponse;
  }
};
