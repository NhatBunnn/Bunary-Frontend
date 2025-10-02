import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useStatus from "./useStatus";
import { getAccessToken } from "../service/apiService";
import { useNotification } from "../context/NotificationProvider";
import { API_URL } from "../config/apiConfig";

function useCreateWordSet() {
  const { fieldErrors, setFieldErrors, setLoading, loading } = useStatus();
  const { showNotification } = useNotification();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [wordCards, setWordCards] = useState([
    { term: "", ipa: "", partOfSpeech: "", meaning: "", thumbnail: "" },
  ]);

  const navigate = useNavigate();

  const handleSaveWordSet = async (e) => {
    setLoading(true);
    setFieldErrors({});
    try {
      const token = await getAccessToken();

      if (title === "") {
        setFieldErrors({ title: "Không để trống email" });
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

      const response = await fetch(`${API_URL}/api/v1/wordsets`, {
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
        navigate(
          `/wordset/${dataResponse.data.id}/${dataResponse.data.title
            .split(" ")
            .filter(Boolean)
            .map((d) => d.toLowerCase())
            .join("-")}`
        );
      } else {
        showNotification(dataResponse.error, "error");
      }
    } catch (error) {
      showNotification(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return {
    handleSaveWordSet,
    fieldErrors,
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
