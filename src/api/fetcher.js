import { useCallback, useRef } from "react";
import { API_URL } from "@config/apiConfig";
import axiosClient from "./axiosClient";
import { useToken } from "@context/AuthProvider/TokenContext";

/**
 * Hàm fetcher tiêu chuẩn hỗ trợ gọi trực tiếp ngoài React Component
 * Tự động gắn token từ sessionStorage và nhận diện FormData/JSON
 */
export const fetcher = async ({
  url,
  method = "GET",
  token,
  params,
  body,
  data,
  credentials,
}) => {
  const query = params ? `?${new URLSearchParams(params).toString()}` : "";
  const payload = body !== undefined ? body : data;
  const isFormData = typeof FormData !== "undefined" && payload instanceof FormData;

  const activeToken =
    token ||
    (typeof sessionStorage !== "undefined"
      ? sessionStorage.getItem("access_token")
      : null);

  const headers = {
    ...(activeToken ? { Authorization: `Bearer ${activeToken}` } : {}),
  };

  if (!isFormData && payload) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(`${API_URL}${url}${query}`, {
    method,
    headers,
    body: isFormData ? payload : payload ? JSON.stringify(payload) : undefined,
    credentials: credentials || "same-origin",
  });

  const dataResponse = await response.json();

  if (response.ok) {
    return dataResponse;
  } else {
    throw dataResponse;
  }
};

/**
 * Custom hook cung cấp instance `fetcher` tích hợp tự động Axios & TokenContext
 */
export const useFetcher = () => {
  const { getToken } = useToken();
  const getTokenRef = useRef(getToken);
  getTokenRef.current = getToken;

  const fetcher = useCallback(
    async ({
      url,
      method = "get",
      params,
      data,
      body,
      signal,
      timeout,
      credentials = false,
    }) => {
      try {
        const token = await getTokenRef.current();

        const response = await axiosClient({
          url,
          method,
          params,
          data: data !== undefined ? data : body,
          signal,
          timeout,
          withCredentials: credentials,
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        return response.data;
      } catch (error) {
        throw error.response?.data || error;
      }
    },
    []
  );

  return { fetcher };
};
