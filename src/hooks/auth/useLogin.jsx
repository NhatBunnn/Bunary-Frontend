import { useNavigate } from "react-router-dom";
import useAuthBase from "./useAuthBase";
import { useUser } from "../../context/UserProvider";
import { API_URL } from "../../config/apiConfig";
import { useAccessToken } from "../../context/AccessTokenProvider";

function useLogin() {
  const authBase = useAuthBase();
  const navigate = useNavigate();

  const { setAccessToken } = useAccessToken();

  const handleSubmit = (e) => {
    e.preventDefault();

    authBase.setErrors([]);
    authBase.setFieldErrors({});

    if (authBase.email === "") {
      authBase.setFieldErrors({ email: "Không để trống email" });
      return;
    }

    if (authBase.password === "") {
      authBase.setFieldErrors({ password: "Không để trống mật khẩu" });
      return;
    }

    const data = {
      email: authBase.email,
      password: authBase.password,
    };

    authBase.setLoading(true);

    fetch(`${API_URL}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include",
    })
      .then((response) => response.json())
      .then((dataReponse) => {
        authBase.setLoading(false);

        if (dataReponse.statusCode >= 200 && dataReponse.statusCode < 300) {
          setAccessToken(dataReponse.data.accessToken);

          authBase.setSuccess("Đăng nhập thành công");
          navigate(`/`);
        } else {
          if (dataReponse.fieldError) {
            const response = dataReponse.fieldError;
            const newErrors = {};

            Object.entries(response).forEach(([field, message]) => {
              newErrors[field] = message;
            });

            authBase.setFieldErrors(newErrors);
          }
          if (dataReponse.error) {
            const response = dataReponse.error;
            authBase.setErrors(...response);
          }
        }
      })
      .catch((error) => {
        authBase.setErrors([error.message]);
      })
      .finally(() => {
        authBase.setLoading(false);
      });
  };

  return { ...authBase, handleSubmit };
}

export default useLogin;
