import { useFetcher } from "@api/fetcher";
import { getStreakBadges, claimStreakBadge } from "@api/badgeApi";
import useAppBase from "@hooks/useAppBase";
import { useState, useEffect, useCallback } from "react";

function useStats() {
  const { fetcher } = useFetcher();
  const { setLoading } = useAppBase();

  const [chart, setChart] = useState([]);
  const [heatmap28, setHeatmap28] = useState([]);
  const [period, setPeriod] = useState("LAST_7_DAYS");
  const [total, setTotal] = useState({});
  const [streakBadges, setStreakBadges] = useState([]);
  const [maxStreak, setMaxStreak] = useState(0);
  const [claimingBadgeCode, setClaimingBadgeCode] = useState(null);

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

  const fetchLastDaysStats = async (targetPeriod = "LAST_7_DAYS") => {
    setLoading(true);
    try {
      const response = await fetcher({
        url: `/api/v1/users/me/stats-daily`,
        method: "GET",
        params: { period: targetPeriod },
      });

      const data = response.data || {};
      setTotal(data.total || {});
      setChart(data.chart || []);
      setPeriod(data.period || targetPeriod);
      if (targetPeriod === "LAST_28_DAYS") {
        setHeatmap28(data.chart || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchHeatmap28 = useCallback(async () => {
    try {
      const response = await fetcher({
        url: `/api/v1/users/me/stats-daily`,
        method: "GET",
        params: { period: "LAST_28_DAYS" },
      });
      setHeatmap28(response?.data?.chart || []);
    } catch (error) {
      console.error(error);
    }
  }, [fetcher]);

  const fetchStreakBadges = useCallback(async () => {
    try {
      const res = await getStreakBadges(fetcher);
      const data = res?.data;
      if (data) {
        setStreakBadges(data.badges || []);
        setMaxStreak(data.maxStreak || 0);
      }
    } catch (error) {
      console.error(error);
    }
  }, [fetcher]);

  const handleClaimBadge = async (code) => {
    if (!code || claimingBadgeCode) return null;
    setClaimingBadgeCode(code);
    try {
      const res = await claimStreakBadge(fetcher, code);
      const data = res?.data;
      if (data) {
        setStreakBadges(data.badges || []);
        setMaxStreak(data.maxStreak || 0);
      }
      if (period === "TOTAL") {
        await fetchTotalStats();
      } else {
        await fetchLastDaysStats(period);
      }
      return data;
    } finally {
      setClaimingBadgeCode(null);
    }
  };

  useEffect(() => {
    fetchLastDaysStats("LAST_7_DAYS");
    fetchHeatmap28();
    fetchStreakBadges();
  }, []);

  return {
    total,
    chart,
    heatmap28,
    period,
    streakBadges,
    maxStreak,
    claimingBadgeCode,
    handleClaimBadge,
    fetchLastDaysStats,
    fetchTotalStats,
  };
}

export default useStats;
