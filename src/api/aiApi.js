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

export const getAiQueueTicket = async (arg1, arg2) => {
  let f = defaultFetcher;
  let ticketId = arg1;
  if (typeof arg1 === "function") {
    f = arg1;
    ticketId = arg2;
  }
  return await f({
    url: `/api/v1/ai/queue/${ticketId}`,
    method: "GET",
  });
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Poll trạng thái AiQueueTicket cho đến khi COMPLETED hoặc FAILED.
 */
export const pollAiQueueTicket = async (
  fetcherFn,
  ticketId,
  { intervalMs = 1500, maxAttempts = 80, onStatus } = {}
) => {
  const f = resolveFetcher(fetcherFn);
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const res = await getAiQueueTicket(f, ticketId);
    const ticket = res?.data;
    if (!ticket) {
      throw new Error("Không nhận được trạng thái hàng đợi AI");
    }

    onStatus?.(ticket);

    if (ticket.status === "COMPLETED") {
      return ticket.result;
    }
    if (ticket.status === "FAILED") {
      const err = new Error(ticket.error || "Xử lý AI thất bại, vui lòng thử lại!");
      err.errorCode = "AI_TASK_FAILED";
      throw err;
    }

    await sleep(intervalMs);
  }

  throw new Error("Yêu cầu AI xử lý quá lâu, vui lòng thử lại sau!");
};

export const suggestWords = async (arg1, arg2) => {
  let f = defaultFetcher;
  let payload = arg1;
  if (typeof arg1 === "function") {
    f = arg1;
    payload = arg2;
  }
  const res = await f({
    url: "/api/v1/ai/suggest-words",
    method: "POST",
    data: payload,
  });
  if (res?.data?.ticketId) {
    const result = await pollAiQueueTicket(f, res.data.ticketId);
    return { ...res, data: result };
  }
  return res;
};
