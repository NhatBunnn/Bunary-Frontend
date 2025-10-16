import { useTranslation } from "react-i18next";
import useStatus from "./useStatus";
import { useNotification } from "@context/NotificationProvider";

function useAppBase() {
  const { t: te } = useTranslation("error");
  const { t: ts } = useTranslation("success");
  const { setLoading, loading, setError, error, fieldErrors, setFieldErrors } =
    useStatus();
  const { showNotification } = useNotification();

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
  };
}

export default useAppBase;
