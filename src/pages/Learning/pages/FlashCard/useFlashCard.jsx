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

  const [settings, setSettings] = useState({
    front: {
      term: true,
      ipa: true,
      partOfSpeech: true,
      meaning: true,
      image: true,
    },
    back: {
      term: true,
      ipa: true,
      partOfSpeech: true,
      meaning: true,
      image: true,
    },
  });

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const response = await fetcher({
          url: `/api/v1/settings/flashcard`,
          method: "GET",
        });

        setSettings(response.data.settings);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

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

  return { words, loading, settings };
}

export default useFlashCard;
