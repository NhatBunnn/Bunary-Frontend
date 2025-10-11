import { findAllByCurrentUser } from "@api/wordSetApi";
import useAppBase from "@hooks/useAppBase";
import { createContext, useEffect, useState } from "react";

export const MyWordSetListContext = createContext(null);

function MyWordSetList({ children }) {
  const { setLoading, accessToken } = useAppBase();

  const [wordSets, setWordSets] = useState([]);

  useEffect(() => {
    const fetchApi = async () => {
      setLoading(true);
      try {
        const dataResponse = await findAllByCurrentUser(accessToken);
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

  async function updateWordSets(action, payload) {
    switch (action) {
      case "remove":
        setWordSets((prev) => prev.filter((c) => c.id !== Number(payload.id)));

        break;
      default:
        break;
    }
  }

  return (
    <MyWordSetListContext.Provider value={{ wordSets, updateWordSets }}>
      {children}
    </MyWordSetListContext.Provider>
  );
}

export default MyWordSetList;
