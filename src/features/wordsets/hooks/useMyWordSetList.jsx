import { useFetcher } from "@api/fetcher";
import useAppBase from "@hooks/useAppBase";
import { useEffect, useState } from "react";

function useMyWordSetList() {
  const { loading, setLoading } = useAppBase();
  const [myWordSetList, setMyWordSetlist] = useState([]);

  const { fetcher } = useFetcher();

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const response = await fetcher({
          url: "/api/v1/wordsets/me",
          method: "GET",
          params: {
            page: 0,
            size: 20,
            sort: "id,asc",
          },
        });
        setMyWordSetlist(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return { myWordSetList, loading };
}

export default useMyWordSetList;
