import useAuthBase from "./useAuthBase";
import useAppBase from "@hooks/useAppBase";
import { useFetcher } from "@api/fetcher";
import { useState } from "react";

function useLogin() {
  const authBase = useAuthBase();
  const { te, ts, showNotification } = useAppBase();
  const { fetcher } = useFetcher();

  const [storeAccount, setStoreAccount] = useState(true);

  console.log("storeAccount", storeAccount);

  const handleSubmit = async (e) => {
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
    try {
      const response = await fetcher({
        url: "/api/v1/auth/login",
        method: "POST",
        data,
        credentials: storeAccount,
      });

      // Nào rảnh fix sau
      window.location.href = "/";
      // setToken(response.data.accessToken);
      // setUser(response.data.user);

      showNotification(ts("AUTH_LOGIN_SUCCESS"), "success");
    } catch (error) {
      authBase.setError(error.message);
    } finally {
      authBase.setLoading(false);
    }
  };

  return { ...authBase, storeAccount, setStoreAccount, handleSubmit };
}

export default useLogin;
