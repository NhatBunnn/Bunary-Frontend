import { useState } from "react";
import useStatus from "./useStatus";
import { getAccessToken } from "../service/apiService";
import { useNotification } from "../context/NotificationProvider";
import { API_URL } from "../config/apiConfig";

function useCreateWordSet() {
  const { errors, setErrors, setLoading, loading } = useStatus();
  const { showNotification } = useNotification();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [wordCards, setWordCards] = useState([
    { term: "", ipa: "", partOfSpeech: "", meaning: "", thumbnail: "" },
  ]);

  console.log("wordCards ", wordCards);

  const handleSaveWordSet = async (e) => {
    setLoading(true);
    setErrors();
    try {
      const token = await getAccessToken();

      if (title === "") {
        setErrors("Không để trống tiêu đề");
        return;
      }

      const wordSet = {
        title,
        description,
        word: wordCards.filter((d) => d.term.trim() !== ""),
      };

      const formData = new FormData();

      formData.append("wordSet", JSON.stringify(wordSet));
      if (thumbnailFile) formData.append("thumbnailFile", thumbnailFile);

      const response = await fetch(`${API_URL}/api/v1/wordset`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
        credentials: "include",
      });

      const dataResponse = await response.json();

      if (dataResponse.statusCode >= 200 && dataResponse.statusCode < 300) {
        showNotification(dataResponse.message, "success");
        console.log(dataResponse.message);
      } else {
        showNotification(dataResponse.error, "error");
      }
    } catch (error) {
      console.log(error);
      showNotification(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return {
    handleSaveWordSet,
    errors,
    title,
    setTitle,
    description,
    setDescription,
    setThumbnailFile,
    wordCards,
    setWordCards,
    loading,
  };
}

export default useCreateWordSet;
