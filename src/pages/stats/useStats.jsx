import { useFetcher } from "@api/fetcher";
import useAppBase from "@hooks/useAppBase";
import { useState, useEffect } from "react";

function useStats() {
  const { fetcher } = useFetcher();
  const { setLoading } = useAppBase();

  const [chart, setChart] = useState([]);
  const [period, setPeriod] = useState("TODAY");
  const [total, setTotal] = useState({});

  const fetchTotalStats = async () => {
    setLoading(true);
    try {
      const response = await fetcher({
        url: `/api/v1/users/me/stats`,
        method: "GET",
      });

      const data = response.data || {};
      setTotal(data || {});
      setPeriod("TOTAL");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLastDaysStats = async (period = "TODAY") => {
    setLoading(true);
    try {
      const response = await fetcher({
        url: `/api/v1/users/me/stats-daily`,
        method: "GET",
        params: { period },
      });

      const data = response.data || {};
      setTotal(data.total || {});
      setChart(data.chart || []);
      setPeriod(data.period || period);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLastDaysStats("TODAY");
  }, []);

  return { total, chart, period, fetchLastDaysStats, fetchTotalStats };
}

export default useStats;
