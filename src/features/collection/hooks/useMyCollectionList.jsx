import { findAllMyCollections } from "@api/collectionApi";
import { useFetcher } from "@api/fetcher";
import useAppBase from "@hooks/useAppBase";
import { useEffect, useState } from "react";

function useMyCollectionList() {
  const { loading, setLoading } = useAppBase();
  const { fetcher } = useFetcher();

  const [myCollectionList, setMyCollectionList] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const response = await fetcher({
          url: "/api/v1/collections/me",
          method: "GET",
          params: {
            page: 0,
            size: 20,
            sort: "id,asc",
          },
        });

        setMyCollectionList(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return { loading, myCollectionList };
}

export default useMyCollectionList;
