import { useWordSetList } from "@features/wordsets/hooks";

function useWordSetDashboard() {
  const { wordSetList, queryParams, setQueryParams, loading } =
    useWordSetList();

  return { wordSetList };
}

export default useWordSetDashboard;
