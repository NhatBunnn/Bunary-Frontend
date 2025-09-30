import { API_URL } from "@config/apiConfig";

export const getAllCollections = async (token) => {
  if (!token) throw new Error("No access token provided");

  const response = await fetch(`${API_URL}/api/v1/collections`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (response.ok) {
    return data;
  } else {
    throw data;
  }
};
