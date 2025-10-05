import { useTranslation } from "react-i18next";

function useMyCollectionList() {
  const { t: te } = useTranslation("error");
  const { t: ts } = useTranslation("success");
  const { setLoading, loading, setError, error } = useStatus();
  const { showNotification } = useNotification();
  const { accessToken } = useAccessToken();

  return {};
}

export default useMyCollectionList;
