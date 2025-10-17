import { useFetcher } from "@api/fetcher";
import { useUser } from "@context/UserProvider/UserContext";
import useAppBase from "@hooks/useAppBase";
import { useEffect, useState } from "react";

function useUserList() {
  const { setLoading, loading } = useAppBase();

  const { fetcher } = useFetcher();

  const [userList, setUserList] = useState([]);

  const { user, loading: userLoading } = useUser();

  useEffect(() => {
    if (userLoading) return;

    const fetch = async () => {
      setLoading(true);
      try {
        const response = await fetcher({
          url: "/api/v1/users",
          method: "GET",
          params: {
            page: 0,
            size: 20,
            sort: "id,asc",
          },
        });
        setUserList(response.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return { userList, loading, user };
}

export default useUserList;
