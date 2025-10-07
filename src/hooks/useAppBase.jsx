import { useTranslation } from "react-i18next";
import useStatus from "./useStatus";
import { useNotification } from "@context/NotificationProvider";
import { useAccessToken } from "@context/AccessTokenProvider";

function useAppBase() {
  const { t: te } = useTranslation("error");
  const { t: ts } = useTranslation("success");
  const { setLoading, loading, setError, error, fieldErrors, setFieldErrors } =
    useStatus();
  const { showNotification } = useNotification();
  const { accessToken } = useAccessToken();

  return {
    te,
    ts,
    setLoading,
    loading,
    setError,
    error,
    fieldErrors,
    setFieldErrors,
    showNotification,
    accessToken,
  };
}

export default useAppBase;
