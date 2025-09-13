import { createContext, useContext, useEffect, useState } from "react";
import { API_URL } from "../config/apiConfig";
import { useAccessToken } from "./AccessTokenProvider";

const WordSetListContext = createContext(null);

export const useWordSetListProvider = () => useContext(WordSetListContext);

function WordSetListProvider({ children }) {
  const [wordSets, setWordSets] = useState();
  const { loadingToken, accessToken } = useAccessToken();

  useEffect(() => {
    const fetchWordSet = async () => {
      try {
        // const token = await getAccessToken();
        if (!accessToken || loadingToken) return;

        const response = await fetch(`${API_URL}/api/v1/wordsets`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          credentials: "include",
        });

        const dataResponse = await response.json();

        if (dataResponse.statusCode >= 200 && dataResponse.statusCode < 300) {
          setWordSets(dataResponse.data);
        } else {
          console.log(dataResponse.error);
        }
      } catch (error) {
        console.error(error);
      } finally {
      }
    };
    fetchWordSet();
  }, [loadingToken, accessToken]);

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
