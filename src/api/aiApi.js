import { fetcher as defaultFetcher } from "./fetcher";

const resolveFetcher = (fn) => (typeof fn === "function" ? fn : defaultFetcher);

export const getAiUsage = async (fetcher) => {
  const f = resolveFetcher(fetcher);
  return await f({
    url: "/api/v1/ai/usage",
    method: "GET",
  });
};

export const buyAiCredits = async (arg1, arg2) => {
  let f = defaultFetcher;
  let credits = arg1;
  if (typeof arg1 === "function") {
    f = arg1;
    credits = arg2;
  }
  return await f({
    url: "/api/v1/ai/buy-credits",
    method: "POST",
    data: { credits },
  });
};

export const autoFillWords = async (arg1, arg2) => {
  let f = defaultFetcher;
  let terms = arg1;
  if (typeof arg1 === "function") {
    f = arg1;
    terms = arg2;
  }
  return await f({
    url: "/api/v1/ai/autofill",
    method: "POST",
    data: { terms },
    timeout: 60000,
  });
};

export const suggestWords = async (arg1, arg2) => {
  let f = defaultFetcher;
  let payload = arg1;
  if (typeof arg1 === "function") {
    f = arg1;
    payload = arg2;
  }
  return await f({
    url: "/api/v1/ai/suggest-words",
    method: "POST",
    data: payload,
    timeout: 60000,
  });
};
