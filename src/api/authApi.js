import { API_URL } from "@config/apiConfig";

export const refreshAccessToken = async () => {
  const response = await fetch(`${API_URL}/api/v1/auth/refresh-Token`, {
    method: "GET",
    credentials: "include",
  });

  const dataResponse = await response.json();

  if (response.ok) {
    return dataResponse;
  } else {
    throw dataResponse;
  }
};
