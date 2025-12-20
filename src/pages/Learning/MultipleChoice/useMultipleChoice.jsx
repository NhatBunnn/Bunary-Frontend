import { useFetcher } from "@api/fetcher";
import useAppBase from "@hooks/useAppBase";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function useMultipleChoice() {
  const { te, setLoading, loading, showNotification } = useAppBase();
  const [words, setWords] = useState([]);
  const { id } = useParams();
  const { fetcher } = useFetcher();

  useEffect(() => {
    const fetchWords = async () => {
      setLoading(true);
      try {
        const response = await fetcher({
          url: `/api/v1/words/${id}`,
          method: "GET",
          params: {
            page: 0,
            size: 300,
            sort: "id,asc",
          },
        });

        const dataResponse = response;

        setWords(dataResponse.data);
      } catch (error) {
        console.log(error);
        showNotification(error, "error");
      } finally {
        setLoading(false);
      }
    };
    fetchWords();
  }, [id, showNotification, setLoading]);

  return { words };
}

export default useMultipleChoice;
