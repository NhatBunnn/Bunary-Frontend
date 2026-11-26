import { fetcher as defaultFetcher } from "./fetcher";

const resolveFetcher = (fn) => (typeof fn === "function" ? fn : defaultFetcher);

export const getQuests = async (fetcher) => {
  const f = resolveFetcher(fetcher);
  return await f({
    url: "/api/v1/quests",
    method: "GET",
  });
};

export const claimQuest = async (arg1, arg2) => {
  let f = defaultFetcher;
  let code = arg1;
  if (typeof arg1 === "function") {
    f = arg1;
    code = arg2;
  }
  return await f({
    url: `/api/v1/quests/${code}/claim`,
    method: "POST",
  });
};
