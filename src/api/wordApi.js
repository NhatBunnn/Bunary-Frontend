import { API_URL } from "@config/apiConfig";

export const findWordsByWordSetId = async (token, id) => {
  if (!token) throw new Error("No access token provided");

  const response = await fetch(`${API_URL}/api/v1/words/${id}`, {
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
