import { useState } from "react";
import useAuthBase from "./useAuthBase";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useFetcher } from "@api/fetcher";

function useRegister() {
  const { t: te } = useTranslation("error");
  const { fetcher } = useFetcher();

  const authBase = useAuthBase();
  const [repeatPassword, setRepeatPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
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

    try {
      await fetcher({
        url: "/api/v1/auth/register",
        method: "POST",
        credentials: true,
        data,
      });

      authBase.setSuccess("Đăng kí thành công");
      navigate(`/verify-email?email=${encodeURIComponent(data.email)}`);
    } catch (error) {
      if (error?.fieldError) {
        const response = error.fieldError;
        const newErrors = {};

        Object.entries(response).forEach(([field, message]) => {
          newErrors[field] = message;
        });

        authBase.setFieldErrors(newErrors);
      }
      if (error?.errorCode) {
        authBase.setError(te(error.errorCode));
      } else if (error?.message) {
        authBase.setError(error.message);
      }
    } finally {
      authBase.setLoading(false);
    }
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
