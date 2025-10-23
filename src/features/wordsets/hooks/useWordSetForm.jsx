import { useFetcher } from "@api/fetcher";
import { createWordSet, findWordSetById, updateWordSet } from "@api/wordSetApi";
import useAppBase from "@hooks/useAppBase";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function useWordSetForm() {
  const {
    te,
    setLoading,
    loading,
    fieldErrors,
    setFieldErrors,
    showNotification,
    accessToken,
  } = useAppBase();

  const [wordSetInput, setWordSetInput] = useState({
    name: "",
    description: "",
    thumbnailFile: null,
    visibility: "PRIVATE",
  });

  const [wordInputs, setWordInputs] = useState([
    {
      id: "",
      term: "",
      ipa: "",
      partOfSpeech: "",
      meaning: "",
      thumbnail: "",
    },
  ]);

  const [removedWordIds, setRemovedWordIds] = useState([]);

  const navigate = useNavigate();
  const { id } = useParams();
  const { fetcher } = useFetcher();

  useEffect(() => {}, [accessToken, setLoading]);

  const handleFindWordSetById = async () => {
    setLoading(true);
    try {
      const response = await fetcher({
        url: `/api/v1/wordsets/${id}`,
        method: "GET",
        params: {
          include: "word",
        },
      });

      setWordSetInput({ name: response.data.title, ...response.data });
      setWordInputs(response.data.words);
    } catch (e) {
      showNotification(te(e.errorCode) || e.message, "error");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateWordSet = async () => {
    setLoading(true);
    setFieldErrors({});
    try {
      if (wordSetInput.name === "") {
        setFieldErrors({ name: "Tên bộ từ vựng không được để trống" });
        return;
      }

      if (wordInputs.length < 3) {
        showNotification("Tối tiểu phải có 3 từ mới", "error");
        return;
      }

      const wordSet = {
        title: wordSetInput.name,
        description: wordSetInput.description,
        visibility: wordSetInput.visibility,
        word: wordInputs,
        removedWordIds,
      };

      const formData = new FormData();

      formData.append("wordSet", JSON.stringify(wordSet));
      if (wordSetInput.thumbnailFile)
        formData.append("thumbnailFile", wordSetInput.thumbnailFile);

      const response = await fetcher({
        url: `/api/v1/wordsets/${id}`,
        method: "PUT",
        data: formData,
      });

      showNotification("Cập nhật bộ từ vựng thành công", "success");
      navigate(
        `/wordset/${response.data.id}/${response.data.title
          .split(" ")
          .filter(Boolean)
          .map((d) => d.toLowerCase())
          .join("-")}`
      );
    } catch (e) {
      showNotification(te(e.errorCode) || e.message, "error");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWordSet = async (e) => {
    setLoading(true);
    setFieldErrors({});
    try {
      if (wordSetInput.name === "") {
        setFieldErrors({ name: "Tên bộ từ vựng không được để trống" });
        return;
      }

      if (wordInputs.length < 3) {
        showNotification("Tối tiểu phải có 3 từ mới", "error");
        return;
      }

      const wordSet = {
        title: wordSetInput.name,
        description: wordSetInput.description,
        word: wordInputs,
      };

      const formData = new FormData();

      formData.append("wordSet", JSON.stringify(wordSet));
      if (wordSetInput.thumbnailFile)
        formData.append("thumbnailFile", wordSetInput.thumbnailFile);

      const response = await fetcher({
        url: `/api/v1/wordsets`,
        method: "POST",
        data: formData,
      });

      showNotification("Tạo bộ từ vựng thành công", "success");
      navigate(
        `/wordset/${response.data.id}/${response.data.title
          .split(" ")
          .filter(Boolean)
          .map((d) => d.toLowerCase())
          .join("-")}`
      );
    } catch (e) {
      showNotification(te(e.errorCode) || e.message, "error");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return {
    handleUpdateWordSet,
    handleCreateWordSet,
    handleFindWordSetById,
    setRemovedWordIds,
    fieldErrors,
    wordInputs,
    setWordSetInput,
    setWordInputs,
    wordSetInput,
    loading,
  };
}

export default useWordSetForm;
