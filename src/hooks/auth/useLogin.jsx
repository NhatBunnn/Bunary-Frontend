import { useNavigate } from "react-router-dom";
import useAuthBase from "./useAuthBase";
import { API_URL } from "../../config/apiConfig";
import { useTranslation } from "react-i18next";

function useLogin() {
  const { t: ts } = useTranslation("success");
  const { t: te } = useTranslation("error");

  const authBase = useAuthBase();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    authBase.setError("");
    authBase.setFieldErrors({});

    if (authBase.email === "") {
      authBase.setFieldErrors({ email: te("AUTH_EMAIL_NOT_EMPTY") });
      return;
    }

    if (authBase.password === "") {
      authBase.setFieldErrors({ password: te("AUTH_PASSWORD_NOT_EMPTY") });
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
          authBase.setSuccess(ts("AUTH_LOGIN_SUCCESS"));
          navigate(`/`);
        } else {
          const response = dataReponse;
          authBase.setError(te(response.errorCode));
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
