import { API_URL } from "@config/apiConfig";
import axiosClient from "./axiosClient";
import { useToken } from "@context/AuthProvider/TokenContext";

export const fetcher = async ({ url, method = "GET", token, params, body }) => {
  const query = params ? `?${new URLSearchParams(params).toString()}` : "";

  const response = await fetch(`${API_URL}${url}${query}`, {
    method,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const dataResponse = await response.json();

  if (response.ok) {
    return dataResponse;
  } else {
    throw dataResponse;
  }
};

export const useFetcher = () => {
  const { getToken } = useToken();

  const fetcher = async ({ url, method = "get", params, data, signal }) => {
    try {
      const token = await getToken();
      const response = await axiosClient({
        url,
        method,
        params,
        data,
        signal,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("API error:", error);
      throw error;
    }
  };

  return { fetcher };
};
