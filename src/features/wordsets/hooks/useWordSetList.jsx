import { useFetcher } from "@api/fetcher";
import useAppBase from "@hooks/useAppBase";
import { useEffect, useState } from "react";

function useWordSetList() {
  const { setLoading, loading } = useAppBase();
  const { fetcher } = useFetcher();

  const [wordSetList, setWordSetList] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const response = await fetcher({
          url: "/api/v1/wordsets",
          method: "GET",
          params: {
            include: "user",
          },
        });

        setWordSetList(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return { wordSetList, loading };
}

export default useWordSetList;
