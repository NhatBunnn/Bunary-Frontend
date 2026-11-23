export const getAiUsage = async (fetcher) => {
  return await fetcher({
    url: "/api/v1/ai/usage",
    method: "GET",
  });
};

export const buyAiCredits = async (fetcher, credits) => {
  return await fetcher({
    url: "/api/v1/ai/buy-credits",
    method: "POST",
    data: { credits },
  });
};

export const autoFillWords = async (fetcher, terms) => {
  return await fetcher({
    url: "/api/v1/ai/autofill",
    method: "POST",
    data: { terms },
  });
};

export const suggestWords = async (fetcher, payload) => {
  return await fetcher({
    url: "/api/v1/ai/suggest-words",
    method: "POST",
    data: payload,
  });
};
