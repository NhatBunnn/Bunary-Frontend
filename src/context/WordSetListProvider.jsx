import { createContext, useContext, useEffect, useState } from "react";
import { findAllWordSet } from "@api/wordSetApi";
import useAppBase from "@hooks/useAppBase";

const WordSetListContext = createContext(null);

export const useWordSetListProvider = () => useContext(WordSetListContext);

function WordSetListProvider({ children }) {
  const { te, setLoading, showNotification, accessToken } = useAppBase();

  const [wordSets, setWordSets] = useState();

  useEffect(() => {
    const fetchWordSet = async () => {
      setLoading(true);

      try {
        const dataReponse = await findAllWordSet(accessToken, {
          includeUser: true,
          visibility: "PUBLIC",
        });
        setWordSets(dataReponse.data);
      } catch (e) {
        showNotification(te(e.errorCode), "error");
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };
    fetchWordSet();
  }, [accessToken]);

  const getWordSetById = (wordSetId) => {
    if (!wordSets) return;

    const wordSetsMap = new Map(wordSets.map((w) => [w.id.toString(), w]));

    return wordSetsMap.get(wordSetId);
  };

  return (
    <WordSetListContext.Provider
      value={{ wordSets, setWordSets, getWordSetById }}
    >
      {children}
    </WordSetListContext.Provider>
  );
}

export default WordSetListProvider;
