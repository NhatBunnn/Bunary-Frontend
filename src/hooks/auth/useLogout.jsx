import { API_URL } from "../../config/apiConfig";
import { getAccessToken } from "../../service/apiService";
import useAuthBase from "./useAuthBase";

function useLogout() {
  const authBase = useAuthBase();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      authBase.setErrors([]);
      authBase.setSuccess("");
      authBase.setLoading(true);

      const token = await getAccessToken();

      const response = await fetch(`${API_URL}/api/v1/auth/logout`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      const dataResponse = await response.json();

      if (dataResponse.statusCode >= 200 && dataResponse.statusCode < 300) {
        sessionStorage.removeItem("access_token");
        authBase.setSuccess("Đăng xuất thành công");
        window.location.reload();
      } else {
        console.log(dataResponse.error);
      }
    } catch (error) {
      console.error(error);
    } finally {
      authBase.setLoading(false);
    }
  };

  return { handleSubmit };
}

export default useLogout;
