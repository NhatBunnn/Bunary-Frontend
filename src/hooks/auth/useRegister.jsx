import { useState } from "react";
import useAuthBase from "./useAuthBase";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../config/apiConfig";
import { useTranslation } from "react-i18next";

function useRegister() {
  const { t: te } = useTranslation("error");

  const authBase = useAuthBase();
  const [repeatPassword, setRepeatPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    authBase.setError([]);
    authBase.setFieldErrors({});

    if (firstName === "") {
      authBase.setFieldErrors({ firstName: "Không để trống tên" });
      return;
    }

    if (lastName === "") {
      authBase.setFieldErrors({ lastName: "Không để trống họ" });
      return;
    }

    if (authBase.email === "") {
      authBase.setFieldErrors({ email: "Không để trống email" });
      return;
    }

    if (authBase.password === "") {
      authBase.setFieldErrors({ password: "Không để trống mật khẩu" });
      return;
    }

    if (repeatPassword === "") {
      authBase.setFieldErrors({ repeatPassword: "Không để trống mật khẩu" });
      return;
    }

    if (repeatPassword !== authBase.password) {
      authBase.setFieldErrors({
        repeatPassword: "Mật khẩu không khớp",
        password: "Mật khẩu không khớp",
      });
      return;
    }

    const data = {
      firstName,
      lastName,
      email: authBase.email,
      password: authBase.password,
    };

    authBase.setLoading(true);

    fetch(`${API_URL}/api/v1/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include",
    })
      .then((response) => response.json())
      .then((dataReponse) => {
        authBase.setLoading(false);

        if (dataReponse.statusCode >= 200 && dataReponse.statusCode < 300) {
          authBase.setSuccess("Đăng kí thành công");
          navigate(`/verify-email?email=${encodeURIComponent(data.email)}`);
        } else {
          if (dataReponse.fieldError) {
            const response = dataReponse.fieldError;
            const newErrors = {};

            Object.entries(response).forEach(([field, message]) => {
              newErrors[field] = message;
            });

            authBase.setFieldErrors(newErrors);
          }
          if (dataReponse.errorCode) {
            authBase.setError(te(dataReponse.errorCode));
          }
        }
      })
      .catch((error) => {
        authBase.setLoading(false);
        authBase.setError(error.message);
      });
  };

  return {
    ...authBase,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    handleSubmit,
    repeatPassword,
    setRepeatPassword,
  };
}

export default useRegister;
