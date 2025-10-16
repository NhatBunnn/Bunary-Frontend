import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNotification } from "@context/NotificationProvider";
import { useFetcher } from "@api/fetcher";

function useFlashCard() {
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);

  const { showNotification } = useNotification();
  const { id } = useParams();
  const { fetcher } = useFetcher();

  useEffect(() => {
    const fetchWords = async () => {
      setLoading(true);
      try {
        const response = await fetcher({
          url: `/api/v1/words/${id}`,
          method: "GET",
        });

        const dataResponse = response;

        if (dataResponse.statusCode >= 200 && dataResponse.statusCode < 300) {
          setWords(dataResponse.data);
        } else {
          showNotification(dataResponse.error, "error");
          console.log(dataResponse.error);
        }
      } catch (error) {
        console.log(error);
        showNotification(error, "error");
      } finally {
        setLoading(false);
      }
    };
    fetchWords();
  }, [id, showNotification, setLoading]);

  return { words, loading };
}

export default useFlashCard;
