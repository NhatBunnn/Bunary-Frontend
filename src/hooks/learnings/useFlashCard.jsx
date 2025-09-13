import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAccessToken } from "../../context/AccessTokenProvider";
import { useNotification } from "../../context/NotificationProvider";
import { API_URL } from "../../config/apiConfig";
import Loading from "../../components/Loading";

function useFlashCard() {
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);

  const { showNotification } = useNotification();
  const { accessToken } = useAccessToken();
  const { id } = useParams();

  useEffect(() => {
    const fetchWords = async () => {
      setLoading(true);
      try {
        if (!accessToken) return;

        const response = await fetch(`${API_URL}/api/v1/words/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          credentials: "include",
        });

        const dataResponse = await response.json();

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
  }, [accessToken, id, showNotification, setLoading]);

  return { words, loading };
}

export default useFlashCard;
