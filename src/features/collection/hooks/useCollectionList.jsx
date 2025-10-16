import { useToken } from "@context/AuthProvider/TokenContext";
import useAppBase from "@hooks/useAppBase";
import { useEffect } from "react";

function useCollectionList() {
  const { loading, setLoading } = useAppBase();
  const { getToken } = useToken();

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const response = await findAllCollections({ token: await getToken() });
        console.log("response ", response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);
  return {};
}

export default useCollectionList;
