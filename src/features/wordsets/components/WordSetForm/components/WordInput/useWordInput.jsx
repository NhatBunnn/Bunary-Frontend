import { useFetcher } from "@api/fetcher";
import useAppBase from "@hooks/useAppBase";
import { useState } from "react";

function useWordInput() {
  const { loading, setLoading, te, showNotification } = useAppBase();
  const { fetcher } = useFetcher();

  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const fetchTermImages = async () => {
    // kiểm tra searchKeyword có value ko (làm sau)

    setLoading(true);
    try {
      const response = await fetcher({
        url: "/api/v1/wordresources/search",
        method: "GET",
        params: {
          keyword: searchKeyword,
        },
      });

      let result = [];
      response.data.forEach((item) => {
        if (item.images) {
          result = [...result, ...item.images];
        }
      });

      setSearchResults(result);
    } catch (e) {
      showNotification(te(e.errorCode), "error");
    } finally {
      setLoading(false);
    }
  };

  return {
    searchResults,
    searchKeyword,
    setSearchKeyword,
    fetchTermImages,
    loading,
  };
}

export default useWordInput;
