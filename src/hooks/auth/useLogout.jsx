import useAppBase from "@hooks/useAppBase";
import useAuthBase from "./useAuthBase";
import { useFetcher } from "@api/fetcher";

function useLogout() {
  const { te, showNotification } = useAppBase();
  const { fetcher } = useFetcher();

  const authBase = useAuthBase();

  const handleSubmit = async (e) => {
    e.preventDefault();

    authBase.setError();
    authBase.setSuccess("");
    authBase.setLoading(true);

    try {
      await fetcher({
        url: "/api/v1/auth/logout",
        method: "GET",
        credentials: true,
      });

      showNotification("Đã đăng xuất", "success");

      // đang lười nào rảnh tối ưu sau
      window.location.reload();
    } catch (error) {
      showNotification(te(error.errorCode), "error");
    } finally {
      authBase.setLoading(false);
    }
  };

  return { handleSubmit };
}

export default useLogout;
