import { useState } from "react";
import { API_URL } from "../config/apiConfig";
import { useAccessToken } from "../context/AccessTokenProvider";

function useUserApi() {
  const { accessToken } = useAccessToken();
  const [loading, setLoading] = useState(true);

  const fetchUserById = async (id) => {
    try {
      setLoading(true);

      if (!accessToken) return;

      const response = await fetch(`${API_URL}/api/v1/users/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
      });

      const dataResponse = await response.json();

      if (dataResponse.statusCode >= 200 && dataResponse.statusCode < 300) {
        return dataResponse.data;
      } else {
        console.log(dataResponse.error);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  return { fetchUserById, loading };
}

export default useUserApi;
