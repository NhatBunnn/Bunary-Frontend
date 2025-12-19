import { useFetcher } from "@api/fetcher";
import useAppBase from "@hooks/useAppBase";
import { use, useEffect, useState } from "react";

function useStats() {
  const { fetcher } = useFetcher();
  const { te, setLoading, loading, showNotification } = useAppBase();

  const [charts, setCharts] = useState({
    today: null,
    thisWeek: [],
    thisMonth: [],
  });

  const [totals, setTotals] = useState({
    today: null,
    thisWeek: null,
    thisMonth: null,
  });

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const response = await fetcher({
          url: `/api/v1/user-wordset-daily/self`,
          method: "GET",
        });

        setTotals(response.data?.totals || {});
        setCharts(response.data?.charts || {});
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return { totals, charts };
}

export default useStats;
