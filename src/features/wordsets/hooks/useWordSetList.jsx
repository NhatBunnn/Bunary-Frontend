import { useFetcher } from "@api/fetcher";
import useAppBase from "@hooks/useAppBase";
import { useState } from "react";

function useWordSetList() {
  const { setLoading } = useAppBase();
  const { fetcher } = useFetcher();

  const [wordSetList, setWordSetList] = useState([]);
  const [pagination, setPagination] = useState({});

  const fetchWordSets = async (param) => {
    let params = {};

    if (param instanceof URLSearchParams) {
      params = {
        sort: param.get("sort"),
        keyword: param.get("keyword") || undefined,
        minRating: param.get("minRating") || undefined,
        level: param.get("level") || undefined,
        page: param.get("page") ? param.get("page") - 1 : 0,
      };
    } else {
      params = {
        sort: param.sort,
        keyword: param.keyword || undefined,
        minRating: param.minRating || undefined,
        level: param.level || undefined,
        page: param.page ? param.page - 1 : 0,
      };
    }

    setLoading(true);
    try {
      const res = await fetcher({
        url: "/api/v1/wordsets",
        method: "GET",
        params: {
          visibility: "PUBLIC",
          size: 9,
          page: 0,
          ...params,
        },
      });

      setWordSetList(res.data);
      setPagination(res.pagination);
    } finally {
      setLoading(false);
    }
  };

  return {
    wordSetList,
    pagination,
    fetchWordSets,
  };
}

export default useWordSetList;
