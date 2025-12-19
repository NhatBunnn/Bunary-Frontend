import { useWordSetList } from "@features/wordsets/hooks";
import { useSearchParams } from "react-router-dom";

function useSearchPage() {
  const { wordSetList, pagination, fetchWordSets } = useWordSetList();

  return { fetchWordSets, wordSetList, pagination };
}

export default useSearchPage;
