import { findAllWordSet } from "@api/wordSetApi";
import useAppBase from "@hooks/useAppBase";
import { createContext, useEffect, useState } from "react";

export const WordSetListContext = createContext(null);

function WordSetList({ children }) {
  const {
    te,
    setLoading,
    loading,
    fieldErrors,
    setFieldErrors,
    showNotification,
    accessToken,
  } = useAppBase();

  const [wordSets, setWordSets] = useState([]);

  useEffect(() => {
    const fetchApi = async () => {
      setLoading(true);
      try {
        const dataResponse = await findAllWordSet(accessToken, {
          includeUser: true,
        });
        setWordSets(dataResponse.data);
      } catch (e) {
        console.error(e.errorStatus);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };
    fetchApi();
  }, []);

  return (
    <WordSetListContext.Provider value={{ wordSets }}>
      {children}
    </WordSetListContext.Provider>
  );
}

export default WordSetList;
