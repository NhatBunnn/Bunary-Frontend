import { useFetcher } from "@api/fetcher";
import useAppBase from "@hooks/useAppBase";
import { useEffect, useState } from "react";

function useFlashCardSetting() {
  const { loading, setLoading, te, showNotification } = useAppBase();
  const [activeSide, setActiveSide] = useState("front");
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

  const { fetcher } = useFetcher();

  console.log("settings", settings);

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

  const updateFlashCardSetting = async () => {
    setLoading(true);
    try {
      const response = await fetcher({
        url: `/api/v1/settings`,
        method: "PUT",
        data: {
          type: "flashcard",
          settings: settings,
        },
      });

      setSettings(response.data.settings);
    } catch (e) {
      showNotification(te(e.errorCode), "error");
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    activeSide,
    setActiveSide,
    settings,
    setSettings,
    updateFlashCardSetting,
  };
}

export default useFlashCardSetting;
