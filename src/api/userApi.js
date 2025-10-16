import { API_URL } from "@config/apiConfig";
import { fetcher } from "./fetcher";

export const findMyAccount = async (token) => {
  if (!token) throw new Error("No access token provided");

  const response = await fetch(`${API_URL}/api/v1/users/me`, {
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

export const findAllUsers = async ({
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
    url: `/api/v1/users`,
    token,
    params,
  });
};
