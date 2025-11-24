import useAuthBase from "./useAuthBase";
import useAppBase from "@hooks/useAppBase";
import { useFetcher } from "@api/fetcher";
import { useState } from "react";

function useLogin() {
  const authBase = useAuthBase();
  const { te, ts, showNotification } = useAppBase();
  const { fetcher } = useFetcher();

  const [loadingGoogle, setLoadingGoogle] = useState(false);

  // const loginGoogle = async (e) => {
  //   e.preventDefault();

  //   authBase.setLoading(true);

  //   try {
  //     const responseUrl = await fetcher({
  //       url: `/api/v1/auth/oauth2/google`,
  //       method: "GET",
  //     });
  //     window.location.href = responseUrl;
  //   } catch (e) {
  //     showNotification(te(e.errorCode), "error");
  //   } finally {
  //     authBase.setLoading(false);
  //   }
  // };

  const loginGoogle = async (e) => {
    e.preventDefault();
    setLoadingGoogle(true);

    try {
      // Lấy URL Google OAuth từ backend
      const responseUrl = await fetcher({
        url: `/api/v1/auth/oauth2/google`,
        method: "GET",
      });

      // Tạo popup
      const width = 500;
      const height = 600;
      const left = window.innerWidth / 2 - width / 2;
      const top = window.innerHeight / 2 - height / 2;

      const popup = window.open(
        responseUrl,
        "Login with Google",
        `width=${width},height=${height},top=${top},left=${left}`
      );

      if (!popup) throw new Error("Popup bị chặn bởi trình duyệt");

      // Lắng nghe token từ popup
      const listener = (event) => {
        if (event.data.success) {
          const accessToken = event.data.accessToken;
          console.log("Token nhận được:", accessToken);
          setLoadingGoogle(false);
          window.location.href = "/";
        } else {
          // lỗi
          showNotification(te(`${event.data.errorCode}`), "error");
          setLoadingGoogle(false);
        }
      };

      window.addEventListener("message", listener);
    } catch (err) {
      console.error(err);
      showNotification(te(err.errorCode), "error");
      setLoadingGoogle(false);
    }
  };

  const login = async (e) => {
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

  return { ...authBase, login, loginGoogle, loadingGoogle };
}

export default useLogin;
