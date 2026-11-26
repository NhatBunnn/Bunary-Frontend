import { fetcher as defaultFetcher } from "./fetcher";

const resolveFetcher = (fn) => (typeof fn === "function" ? fn : defaultFetcher);

export const getStreakBadges = async (fetcher) => {
  const f = resolveFetcher(fetcher);
  return await f({
    url: "/api/v1/badges/streak",
    method: "GET",
  });
};

export const claimStreakBadge = async (arg1, arg2) => {
  let f = defaultFetcher;
  let code = arg1;
  if (typeof arg1 === "function") {
    f = arg1;
    code = arg2;
  }
  return await f({
    url: `/api/v1/badges/streak/${code}/claim`,
    method: "POST",
  });
};
