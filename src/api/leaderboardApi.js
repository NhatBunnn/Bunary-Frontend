import { fetcher as defaultFetcher } from "./fetcher";

const resolveFetcher = (fn) => (typeof fn === "function" ? fn : defaultFetcher);

export const getLeaderboard = async (fetcher, { scope = "weekly", metric = "xp" } = {}) => {
  const f = resolveFetcher(fetcher);
  return await f({
    url: "/api/v1/leaderboard",
    method: "GET",
    params: { scope, metric },
  });
};

export const claimWeeklyReward = async (fetcher) => {
  const f = resolveFetcher(fetcher);
  return await f({
    url: "/api/v1/leaderboard/claim-reward",
    method: "POST",
  });
};
